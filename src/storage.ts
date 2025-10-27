import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Recipe } from "./FavoritesContext";

const KEY = "favorites@v1";

export async function loadFavorites(): Promise<Recipe[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function saveFavorites(list: Recipe[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}
