import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, Heart } from "../../components/ui";
import { useFavs } from "../../src/FavoritesContext";

const C = {
  bg: "#0B0F14",
  surface: "#101520",
  surface2: "#0F1420",
  border: "#1E2633",
  text: "#E8EEF6",
  muted: "#9AA7BD",
  accent: "#8B7DFF",
  accentDim: "#6C5CFF",
};

const placeholder = require("../../images/recipe.jpg");

export default function Home() {
  const [q, setQ] = useState("");
  const { favorites, toggle } = useFavs();

  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const topSpacer = Math.max(12, Math.min(44, Math.round(height * 0.06)));
  const isSmall = width < 360;
  const canSearch = q.trim().length > 0;

  const goResults = () => {
    const q2 = q.trim();
    if (!q2) return;
    const href = { pathname: "/results", params: { q: q2, seed: String(Date.now()) } } satisfies Href;
    Keyboard.dismiss();
    router.push(href);
  };

  const goDetail = (item: any) => {
    const href = { pathname: "/detail", params: { id: String(item.id), r: JSON.stringify(item) } } satisfies Href;
    router.push(href);
  };

  const renderFav = ({ item }: any) => (
    <Card onPress={() => goDetail(item)}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Img thumbnail*/}
        <View
          style={{
            width: isSmall ? 48 : 56,
            height: isSmall ? 48 : 56,
            borderRadius: 12,
            overflow: "hidden",
            marginRight: 12,
            backgroundColor: C.surface2,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <Image
            source={item.image ? { uri: item.image } : placeholder}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ fontWeight: "800", color: C.text }}>
            {item.title}
          </Text>
          <Text style={{ color: C.muted, marginTop: 4 }}>
            {item.totalTimeMinutes ?? "—"} min
          </Text>
        </View>

        <Heart filled onPress={() => toggle(item)} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top ? 2 : 12,
          paddingBottom: 14,
          paddingHorizontal: 18,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          backgroundColor: C.bg,
        }}
      >
        <Text
          accessibilityRole="header"
          style={{
            textAlign: "center",
            fontWeight: "800",
            fontSize: 22,
            letterSpacing: 1.1,
            color: C.text,
          }}
        >
          recipes.ai
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={{ flex: 1 }}
      >
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, paddingHorizontal: 18 }}>
            {/* Spacer */}
            <View style={{ height: topSpacer }} />

            {/* Search block */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: C.surface2,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: C.border,
                paddingHorizontal: 14,
                height: 48,
                marginBottom: 12,
              }}
            >
              <Ionicons name="search" size={18} color={C.muted} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="What do you feel like eating?"
                placeholderTextColor={C.muted}
                value={q}
                onChangeText={setQ}
                onSubmitEditing={goResults}
                returnKeyType="search"
                style={{ flex: 1, paddingVertical: 0, color: C.text, fontWeight: "600" }}
              />
              {q.length > 0 && (
                <TouchableOpacity onPress={() => setQ("")} hitSlop={10}>
                  <Ionicons name="close" size={16} color={C.muted} />
                </TouchableOpacity>
              )}
            </View>

            {/* CTA */}
            <TouchableOpacity
              onPress={goResults}
              disabled={!canSearch}
              style={{
                backgroundColor: canSearch ? C.accent : "#3C3C66",
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: "center",
                marginBottom: 22,
                borderWidth: 1,
                borderColor: canSearch ? "#AFA6FF33" : C.border,
                shadowColor: canSearch ? C.accent : "transparent",
                shadowOpacity: canSearch ? 0.35 : 0,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 10 },
                ...Platform.select({ android: { elevation: canSearch ? 4 : 0 } }),
              }}
            >
              <Text style={{ color: "#0B0F14", fontWeight: "800", letterSpacing: 0.4 }}>
                Find recipes
              </Text>
            </TouchableOpacity>

            {/* Favorites */}
            <Text style={{ fontSize: 16, fontWeight: "800", marginBottom: 10, color: C.text }}>
              Favorites
            </Text>
            <FlatList
              contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}
              data={favorites}
              keyExtractor={(i) => i.id}
              renderItem={renderFav}
              ListEmptyComponent={
                <Text style={{ color: C.muted }}>
                  Your favorites will appear here.
                </Text>
              }
            />
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
