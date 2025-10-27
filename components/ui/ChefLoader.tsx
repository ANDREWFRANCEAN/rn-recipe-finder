import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Text, View, useWindowDimensions } from "react-native";

const C = {
  bg: "#0B0F14",
  surface: "#101520",
  surface2: "#0F1420",
  border: "#1E2633",
  text: "#E8EEF6",
  muted: "#9AA7BD",
  accent: "#8B7DFF",
};

type Props = {
  messages?: string[];
  speed?: number;        
  height?: number;       
};

export default function ChefLoader({
  messages = [
    "Our AI chef is preparing the recipes",
    "Soon you'll have them tailored to your taste",
    "Mixing flavors and ideas, just for you",
    "Almost ready—setting the table…",
  ],
  speed = 80,
  height = 44,
}: Props) {
  const { width: containerWidth } = useWindowDimensions();
  const [idx, setIdx] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (containerWidth === 0 || textWidth === 0) return;

    translateX.setValue(containerWidth);

    const duration = ((containerWidth + textWidth) / speed) * 1000; // ms
    const anim = Animated.timing(translateX, {
      toValue: -textWidth - 16,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const loop = Animated.loop(anim, { resetBeforeIteration: true });
    loop.start();

    return () => loop.stop();
  }, [containerWidth, textWidth, speed, translateX, idx]);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(t);
  }, [messages.length]);

  const current = useMemo(() => messages[idx], [messages, idx]);

  return (
    <View
      style={{
        backgroundColor: C.bg,
        paddingHorizontal: 16,
        paddingBottom: 8,
      }}
    >
      <View
        style={{
          height,
          backgroundColor: C.surface2,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 14,
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 12,
            zIndex: 2,
            backgroundColor: "transparent",
          }}
        >
          <Ionicons name="restaurant-outline" size={18} color={C.accent} />
        </View>

        <Animated.View
          style={{
            paddingLeft: 36, 
            paddingRight: 16,
            transform: [{ translateX }],
          }}
        >
          <Text
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            style={{
              color: C.text,
              fontWeight: "700",
              letterSpacing: 0.2,
              opacity: 0.95,
            }}
            numberOfLines={1}
          >
            {current}
          </Text>
        </Animated.View>
      </View>

      <View
        style={{
          height: 3,
          backgroundColor: C.border,
          borderRadius: 2,
          marginTop: 8,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: 3,
            width: translateX.interpolate({
              inputRange: [-textWidth - 16, containerWidth],
              outputRange: ["100%", "15%"],
            }) as any,
            backgroundColor: C.accent,
          }}
        />
      </View>
    </View>
  );
}
