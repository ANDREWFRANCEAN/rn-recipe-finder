import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RecipeCard from "../components/RecipieCard";
import { generateRecipes } from "../src/ai";
import type { Recipe } from "../src/FavoritesContext";
import { useFavs } from "../src/FavoritesContext";

const C = {
  bg: "#0B0F14",
  surface: "#101520",
  border: "#1E2633",
  text: "#E8EEF6",
  muted: "#9AA7BD",
  accent: "#8B7DFF",
};

// ─────────────────────────────────────────────
// Full-screen loader: big spinner + cross-fade text
// ─────────────────────────────────────────────
function FullScreenLoader({
  messages = [
    "Our AI chef is preparing the recipes",
    "Soon you'll have them tailored to your taste",
    "Mixing flavors and ideas, just for you",
    "Almost ready — setting the table…",
  ],
  interval = 2500, // ms between message changes
  iconSize = 72,   // bigger spinner
}: {
  messages?: string[];
  interval?: number;
  iconSize?: number;
}) {
  const [idx, setIdx] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;

  // Spin forever
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  // Cross-fade text every interval
  useEffect(() => {
    const t = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        setIdx((i) => (i + 1) % messages.length);
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, interval);
    return () => clearInterval(t);
  }, [fade, interval, messages.length]);

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const current = useMemo(() => messages[idx], [messages, idx]);

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: C.bg,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <Animated.View style={{ transform: [{ rotate: spinDeg }], marginBottom: 18 }}>
        <Ionicons name="refresh" size={iconSize} color={C.accent} />
      </Animated.View>

      <Animated.Text
        style={{
          opacity: fade,
          color: C.text,
          fontWeight: "800",
          fontSize: 16,
          textAlign: "center",
          lineHeight: 22,
        }}
        numberOfLines={2}
      >
        {current}
      </Animated.Text>
    </View>
  );
}

// ─────────────────────────────────────────────

export default function Results() {
  const { q = "", seed = "" } = useLocalSearchParams<{ q: string; seed?: string }>();
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const { isFav, toggle } = useFavs();

  const run = useCallback(async () => {
    setLoading(true); setErr(null); setRecipes(null);
    try {
      const out = await generateRecipes(String(q));
      setRecipes(out);
    } catch (e: any) {
      setErr(e?.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }, [q, seed]);

  useEffect(() => { run(); }, [run]);

  const reshuffle = () => {
    router.replace({ pathname: "/results", params: { q: String(q), seed: String(Date.now()) } } as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>Suggested recipes</Text>
      </View>

      {err ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: "#FF8A8A", marginBottom: 12, fontWeight: "600" }}>{err}</Text>
          <TouchableOpacity
            onPress={run}
            style={{
              backgroundColor: C.accent,
              padding: 12,
              borderRadius: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#AFA6FF33",
            }}
          >
            <Text style={{ color: "#0B0F14", fontWeight: "800" }}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          data={recipes || []}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              hearted={isFav(item.id)}
              onHeart={() => toggle(item)}
              onPress={() =>
                router.push({ pathname: "/detail", params: { id: item.id, r: JSON.stringify(item) } } as any)
              }
            />
          )}
          ListFooterComponent={
            <TouchableOpacity
              onPress={reshuffle}
              style={{
                backgroundColor: C.surface,
                padding: 12,
                borderRadius: 14,
                alignItems: "center",
                marginTop: 10,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Text style={{ color: C.text, fontWeight: "800" }}>I don’t like these</Text>
            </TouchableOpacity>
          }
        />
      )}

      {/* Full-screen loader overlay */}
      {loading && <FullScreenLoader />}
    </View>
  );
}
