import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
    Animated,
    GestureResponderEvent,
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const C = {
  bg: "#0B0F14",
  surface: "#101520",
  surface2: "#0F1420",
  border: "#1E2633",
  text: "#E8EEF6",
  muted: "#9AA7BD",
  accent: "#8B7DFF",
};


const suggestive = require("../../images/recipe.jpg");

function PressableScale({
  enabled,
  onPress,
  children,
  style,
}: {
  enabled: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleIn = () => {
    if (!enabled) return;
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 10,
      tension: 120,
    }).start();
  };
  const handleOut = () => {
    if (!enabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={enabled ? 0.9 : 1}
        onPress={onPress}
        onPressIn={handleIn}
        onPressOut={handleOut}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

export const Card: React.FC<{ onPress?: () => void; children: React.ReactNode }> = ({
  onPress,
  children,
}) => (
  <PressableScale enabled={!!onPress} onPress={onPress} style={styles.shadowWrap}>
    <View style={styles.card}>{children}</View>
  </PressableScale>
);

export const Heart: React.FC<{ filled?: boolean; onPress?: () => void }> = ({
  filled,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} hitSlop={10} style={{ padding: 6 }}>
    <Ionicons
      name={filled ? "heart" : "heart-outline"}
      size={20}
      color={filled ? C.accent : C.muted}
    />
  </TouchableOpacity>
);

export const SkeletonRow = () => (
  <View style={[styles.card, { flexDirection: "row", alignItems: "center" }]}>
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#131A28",
        marginRight: 12,
      }}
    />
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 12,
          borderRadius: 6,
          backgroundColor: "#131A28",
          marginBottom: 8,
          width: "70%",
        }}
      />
      <View
        style={{
          height: 10,
          borderRadius: 6,
          backgroundColor: "#131A28",
          width: "45%",
        }}
      />
    </View>
  </View>
);

export const SuggestiveImage: React.FC<{
  height?: number;
  radius?: number;
}> = ({ height = 140, radius = 16 }) => {
  return (
    <View
      style={[
        styles.suggestiveWrap,
        {
          height,
          borderRadius: radius,
        },
      ]}
    >
      <Image
        source={suggestive}
        style={{ width: "100%", height: "100%", borderRadius: radius }}
        resizeMode="cover"
      />
      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: C.border,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: 16,
  },
  card: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
  },
  suggestiveWrap: {
    overflow: "hidden",
    marginVertical: 12,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    ...Platform.select({ android: { elevation: 4 } }),
  },
});
