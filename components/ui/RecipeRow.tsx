import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Heart } from ".";
import { Recipe } from "../../src/types";

const placeholder = require("../../images/recipe.jpg");

const C = {
  surface: "#101520",
  surface2: "#0F1420",
  border: "#1E2633",
  text: "#E8EEF6",
  muted: "#9AA7BD",
};

export default function RecipeRow({
  recipe,
  onPress,
  hearted,
  onHeart,
}: {
  recipe: Recipe;
  onPress?: () => void;
  hearted?: boolean;
  onHeart?: () => void;
}) {
  const src = recipe.image ? { uri: recipe.image } : placeholder;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: C.surface,
        borderRadius: 14,
        padding: 12,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: C.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: C.surface2,
          marginRight: 12,
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        <Image source={src} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      </View>

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontWeight: "800", color: C.text }}>
          {recipe.title}
        </Text>
        <Text style={{ color: C.muted, marginTop: 4 }}>
          {recipe.totalTimeMinutes ?? "—"} min
        </Text>
      </View>

      <Heart filled={hearted} onPress={onHeart} />
    </TouchableOpacity>
  );
}
