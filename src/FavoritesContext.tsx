import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loadFavorites, saveFavorites } from "./storage";

export type Recipe = {
  id: string;
  title: string;
  totalTimeMinutes?: number;
  servings?: string;
  image?: string;
  ingredients: string[];
  steps: string[];
};

type Ctx = {
  favorites: Recipe[];
  isFav: (id: string) => boolean;
  toggle: (r: Recipe) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};

const C = createContext<Ctx>({
  favorites: [],
  isFav: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
  count: 0,
});

export const useFavs = () => useContext(C);

// optional haptics (safe if not installed)
async function hapticTap() {
  try {
    const Haptics = await import("expo-haptics");
    Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

const STORAGE_VERSION = 1;

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const readyRef = useRef(false);

  // Load once
  useEffect(() => {
    (async () => {
      try {
        const list = await loadFavorites(); // from your storage.ts
        setFavorites(Array.isArray(list) ? list : []);
      } catch (e) {
        console.warn("Favorites load failed:", e);
        setFavorites([]);
      } finally {
        readyRef.current = true;
      }
    })();
  }, []);

  useEffect(() => {
    if (!readyRef.current) return;
    saveFavorites(favorites).catch((e) => console.warn("Favorites save failed:", e));
  }, [favorites]);

  const favSet = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);
  const isFav = useCallback((id: string) => favSet.has(id), [favSet]);

  const remove = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggle = useCallback((r: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === r.id);
      const next = exists ? prev.filter((f) => f.id !== r.id) : [r, ...prev];
      return next;
    });
    hapticTap(); 
  }, []);

  const clear = useCallback(() => setFavorites([]), []);
  const count = favorites.length;

  const value = useMemo(
    () => ({ favorites, isFav, toggle, remove, clear, count }),
    [favorites, isFav, toggle, remove, clear, count]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
};
