import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { FavoritesProvider } from "../src/FavoritesContext";

const C = {
  bg: "#0B0F14",
  border: "#1E2633",
  text: "#E8EEF6",
  accent: "#8B7DFF",
};

// Custom nav theme to blend header with your UI
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: C.bg, // screen background
    card: C.bg,       // header background
    border: C.border,
    text: C.text,
    primary: C.accent,
  },
};

// Reusable custom back button (back if possible, else go Home)
function BackBtn() {
  const onPress = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };
  return (
    <TouchableOpacity onPress={onPress} hitSlop={12} style={{ marginLeft: 8 }}>
      <Ionicons name="chevron-back" size={22} color={C.accent} />
    </TouchableOpacity>
  );
}

// Reusable title component (centered, bold)
function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: C.text,
        fontWeight: "800",
        fontSize: 16,
        letterSpacing: 0.3,
      }}
      numberOfLines={1}
    >
      {children}
    </Text>
  );
}

export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  // You can still read the system scheme for other parts of the app if needed,
  // but we force a dark-styled header to match your UI.
  useColorScheme();

  return (
    <FavoritesProvider>
      <ThemeProvider value={navTheme}>
        <Stack
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: C.bg },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTintColor: C.accent, // tints default items if ever shown
            // Hide default back label and use our button
            //headerBackTitleVisible: false,
            headerLeft: () => <BackBtn />,
            headerTitle: ({ children }) => <Title>{children}</Title>,
          }}
        >
          {/* Tab group uses your in-screen custom headers, so hide native header there */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Screens outside tabs use the themed native header */}
          <Stack.Screen name="results" options={{ title: "Suggested recipes" }} />
          <Stack.Screen name="detail" options={{ title: "Recipe details" }} />

          {/* Keep if you use the modal; inherits the theme */}
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
            }}
          />
        </Stack>

        {/* Light text on dark bg */}
        <StatusBar style="light" />
      </ThemeProvider>
    </FavoritesProvider>
  );
}
