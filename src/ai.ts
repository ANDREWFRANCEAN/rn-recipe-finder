import Constants from "expo-constants";
import type { Recipe } from "./FavoritesContext";

type AIResponse = { recipes: Recipe[] };

const extra = (Constants.expoConfig || (Constants as any).manifest)?.extra || {};
const KEY: string = String(extra.AI_API_KEY || "");
const BASE: string = "https://generativelanguage.googleapis.com/v1";
const MODEL_PREF: string = String(extra.AI_MODEL || "gemini-1.5-flash-latest").replace(/^models\//i, "");

function extractJSON(text: string): AIResponse {
  if (!text) throw new Error("Empty AI response");
  try { return JSON.parse(text); } catch {}
  const m = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  if (m) return JSON.parse(m[1]);
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s !== -1 && e !== -1 && e > s) return JSON.parse(text.slice(s, e + 1));
  throw new Error("AI returned invalid JSON");
}

const SYSTEM = `Return STRICT JSON only:
{
  "recipes":[
    {"id":"slug-or-uuid","title":"string","totalTimeMinutes":number,"servings":"string","image":"","ingredients":["..."],"steps":["..."]}
  ]
}
Create 6 concise, diverse recipes. Steps short. No extra prose.`;

async function generateWith(model: string, userPrompt: string) {
  const url = `${BASE}/models/${model}:generateContent?key=${KEY}`;
  const body = {
    contents: [
      { role: "user", parts: [{ text: SYSTEM }] },
      { role: "user", parts: [{ text: `User description: ${userPrompt}\nCuisine/diet only if user asked. JSON ONLY.` }] }
    ],
    generationConfig: { temperature: 0.7 }
  };
  console.log("GEMINI_REQUEST", url);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res;
}

async function findWorkingModel(): Promise<string> {
  const url = `${BASE}/models?key=${KEY}`;
  console.log("GEMINI_LIST", url);
  const list = await fetch(url);
  if (!list.ok) throw new Error(`ListModels failed: ${list.status} ${await list.text()}`);
  const data = await list.json();
  const items: any[] = data?.models || data?.data || [];

  const pick = items.find(m =>
    typeof m?.name === "string" &&
    /gemini-1\.5-flash/i.test(m.name) &&
    (m?.supportedGenerationMethods || m?.supportedMethods || [])
      .some((s: string) => /generateContent/i.test(s))
  );

  const alt = items.find(m =>
    (m?.supportedGenerationMethods || m?.supportedMethods || [])
      .some((s: string) => /generateContent/i.test(s))
  );

  const id = (pick?.name || alt?.name || "").replace(/^models\//, "");
  if (!id) throw new Error("No compatible Gemini model found for this key/project.");
  return id;
}

export async function generateRecipes(userPrompt: string): Promise<Recipe[]> {
  if (!KEY.startsWith("AIza")) throw new Error("AI_API_KEY is missing or not a Gemini (AI Studio) key.");

  // 1 preferred model
  let res = await generateWith(MODEL_PREF, userPrompt);

  // 2 discover model 
  if (res.status === 404) {
    const model = await findWorkingModel();
    res = await generateWith(model, userPrompt);
  }

  if (!res.ok) {
    const t = await res.text();
    console.log("GEMINI_ERROR", res.status, t);
    throw new Error(`AI error ${res.status}`);
  }

  const data = await res.json();
  if (data?.promptFeedback?.blockReason) {
    console.log("GEMINI_BLOCKED", data.promptFeedback);
    throw new Error("Request was blocked by safety filters.");
  }

  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join("") ?? "";
  const json = extractJSON(text);
  if (!json?.recipes?.length) throw new Error("No recipes returned");

  return json.recipes.map(r => ({
    ...r,
    id: r.id || (r.title ? r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : String(Math.random()))
  }));
}
