// ============================================================
// 🎨 HOOK CUSTOM — useTheme
// Fichier : hooks/use-theme.ts
//
// Lit le thème depuis :
//   1. Le paramètre URL  ?theme=neon  (pages avec searchParams)
//   2. localStorage                   (fallback — leaderboard)
//   3. "dark"                         (défaut absolu)
//
// Sauvegarde automatiquement dans localStorage à chaque
// changement pour que le leaderboard ait le bon thème.
//
// Usage :
//   const { theme, themeKey } = useTheme();
//   <main className={theme.bg}>
// ============================================================

import { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { THEMES, DEFAULT_THEME, type ThemeKey, type Theme } from "@/lib/themes";

const STORAGE_KEY = "chasse-au-logo-theme";

export function useTheme(): { theme: Theme; themeKey: ThemeKey } {
  const searchParams = useSearchParams();

  // ── Résolution du thème actif
  // Priorité : URL → localStorage → défaut "dark"
  const themeKey = useMemo<ThemeKey>(() => {
    // 1. Paramètre URL (homepage → game)
    const fromUrl = searchParams?.get("theme") as ThemeKey | null;
    if (fromUrl && THEMES[fromUrl]) return fromUrl;

    // 2. localStorage (leaderboard + retour direct)
    if (typeof window !== "undefined") {
      const fromStorage = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
      if (fromStorage && THEMES[fromStorage]) return fromStorage;
    }

    // 3. Défaut
    return DEFAULT_THEME;
  }, [searchParams]);

  // ── Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, themeKey);
    }
  }, [themeKey]);

  return {
    themeKey,
    theme: THEMES[themeKey],
  };
}
