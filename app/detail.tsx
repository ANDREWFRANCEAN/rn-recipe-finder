import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Heart } from "../components/ui";
import type { Recipe } from "../src/FavoritesContext";
import { useFavs } from "../src/FavoritesContext";

const C = {
  bg: "#0B0F14",
  surface: "#101520",
  border: "#1E2633",
  text: "#E8EEF6",
  muted: "#9AA7BD",
};

const placeholder = require("../images/recipe.jpg");

export default function Detail() {
  const { r } = useLocalSearchParams<{ r: string }>();
  const recipe: Recipe = JSON.parse(String(r));
  const { isFav, toggle } = useFavs();

  const src = recipe.image ? { uri: recipe.image } : placeholder;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ height: 220, borderRadius: 18, overflow: "hidden", marginBottom: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}>
        <Image source={src} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: C.text }}>{recipe.title}</Text>
          <Text style={{ color: C.muted, marginTop: 4 }}>{recipe.totalTimeMinutes ?? "—"} min</Text>
        </View>
        <Heart filled={isFav(recipe.id)} onPress={() => toggle(recipe)} />
      </View>

      <Text style={{ fontWeight: "800", color: C.text, marginTop: 8, marginBottom: 8 }}>Ingredients</Text>
      {recipe.ingredients.map((line, i) => (
        <Text key={i} style={{ color: C.text, opacity: 0.92, marginBottom: 6 }}>• {line}</Text>
      ))}

      <Text style={{ fontWeight: "800", color: C.text, marginTop: 18, marginBottom: 8 }}>Instructions</Text>
      {recipe.steps.map((step, i) => (
        <Text key={i} style={{ color: C.text, opacity: 0.92, marginBottom: 10 }}>{i + 1}. {step}</Text>
      ))}
    </ScrollView>
  );
}
