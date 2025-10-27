import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { Recipe } from "../src/FavoritesContext";
import { Heart } from "./ui";

const placeholder = require("../images/recipe.jpg");

const C = {
  surface: "#101520",
  surface2: "#0F1420",
  border: "#1E2633",
  text: "#E8EEF6",
  muted: "#9AA7BD",
};

export default function RecipeCard({
  recipe, onPress, hearted, onHeart
}: {
  recipe: Recipe;
  onPress?: () => void;
  hearted?: boolean;
  onHeart?: () => void;
}) {
  const src = recipe.image ? { uri: recipe.image } : placeholder;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: "48%",
        backgroundColor: C.surface,
        borderRadius: 16,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: C.border,
      }}
    >
      <View
        style={{
          height: 120,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 10,
          backgroundColor: C.surface2,
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        <Image source={src} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      </View>

      <Text numberOfLines={2} style={{ fontWeight: "800", color: C.text }}>{recipe.title}</Text>
      <Text style={{ color: C.muted, marginTop: 4 }}>{recipe.totalTimeMinutes ?? "—"} min</Text>

      <View style={{ alignItems: "flex-end", marginTop: 8 }}>
        <Heart filled={hearted} onPress={onHeart} />
      </View>
    </TouchableOpacity>
  );
}
