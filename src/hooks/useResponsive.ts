import { useWindowDimensions } from "react-native";

export type Breakpoint = "phone" | "tablet";

export default function useResponsive(): Breakpoint {
  const { width } = useWindowDimensions();
  // very safe default split
  return width >= 768 ? "tablet" : "phone";
}
