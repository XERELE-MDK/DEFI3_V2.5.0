// ============================================================
// 🎨 THÈMES — Chasse au Logo v2
// Fichier : lib/themes.ts
//
// Centralise tous les tokens visuels du projet.
// Chaque thème définit des classes Tailwind pour chaque
// élément de l'interface.
//
// Usage :
//   import { THEMES, type ThemeKey } from "@/lib/themes";
//   const t = THEMES["neon"];
//   <main className={t.bg}>
// ============================================================

export type ThemeKey = "dark" | "retro" | "neon" | "pastel";

export type Theme = {
  key:         ThemeKey;
  name:        string;
  emoji:       string;
  description: string;
  color:       string;   // Couleur hex pour les sélecteurs UI
  border:      string;   // Bordure colorée du sélecteur

  // ── Layout général
  bg:          string;   // Fond de page
  header:      string;   // Fond + bordure du header
  card:        string;   // Cartes et blocs
  cardHover:   string;   // Hover sur les cartes

  // ── Textes
  text:        string;   // Texte principal
  subtext:     string;   // Texte secondaire / labels
  accent:      string;   // Couleur d'accent (titres, scores)
  accentAlt:   string;   // Accent secondaire

  // ── Zone de jeu
  gameArea:    string;   // Fond de la zone de jeu
  gridColor:   string;   // Couleur de la grille décorative (hex)
  objectBg:    string;   // Fond des objets cliquables (hex)
  objectGlow:  string;   // Glow des objets (rgba)

  // ── Timer
  timerNormal: string;   // Couleur timer normal
  timerWarn:   string;   // Couleur timer < 10s
  timerAlert:  string;   // Couleur timer < 5s

  // ── Boutons
  btnPlay:     string;   // Bouton principal JOUER
  btnSecondary:string;   // Bouton secondaire

  // ── Inputs / formulaires
  input:       string;   // Champ de saisie pseudo

  // ── Badges
  badge:       string;   // Badge mode/difficulté

  // ── Barre de progression
  progressBg:  string;   // Fond de la barre
  progressFill:string;   // Remplissage de la barre (hex)

  // ── Footer / séparateurs
  divider:     string;   // Bordures séparatrices
  footerText:  string;   // Texte du footer

  // ── Police
  font:        string;   // Font-family CSS
};

// ─────────────────────────────────────────────────────────
// 🌑 DARK — Le thème original, fond ardoise, accents jaunes
// ─────────────────────────────────────────────────────────
const dark: Theme = {
  key:          "dark",
  name:         "DARK",
  emoji:        "🌑",
  description:  "Élégance nocturne",
  color:        "#facc15",
  border:       "rgba(250,204,21,0.4)",

  bg:           "bg-[#0f172a]",
  header:       "bg-[#1e293b] border-slate-700",
  card:         "bg-slate-800/50 border-slate-700/50",
  cardHover:    "hover:bg-slate-700/50",

  text:         "text-white",
  subtext:      "text-slate-400",
  accent:       "text-yellow-400",
  accentAlt:    "text-cyan-400",

  gameArea:     "bg-[#0f172a]",
  gridColor:    "#334155",
  objectBg:     "#facc15",
  objectGlow:   "rgba(250,204,21,0.5)",

  timerNormal:  "text-cyan-400",
  timerWarn:    "text-orange-400",
  timerAlert:   "text-red-400",

  btnPlay:      "bg-yellow-400 hover:bg-yellow-300 text-black",
  btnSecondary: "border-2 border-slate-600 hover:border-yellow-400/60 text-slate-300 hover:text-yellow-400",

  input:        "bg-slate-700 text-white placeholder-slate-500 focus:ring-yellow-400",
  badge:        "bg-slate-700 text-slate-300",

  progressBg:   "bg-slate-700",
  progressFill: "#facc15",

  divider:      "border-slate-700",
  footerText:   "text-slate-700",

  font:         "'Share Tech Mono', monospace",
};

// ─────────────────────────────────────────────────────────
// 🖥️ RETRO — Vert phosphore sur noir, style terminal 1980
// ─────────────────────────────────────────────────────────
const retro: Theme = {
  key:          "retro",
  name:         "RETRO",
  emoji:        "🖥️",
  description:  "Terminal années 80",
  color:        "#00ff41",
  border:       "rgba(0,255,65,0.4)",

  bg:           "bg-black",
  header:       "bg-black border-green-500/40",
  card:         "bg-black border-green-500/30",
  cardHover:    "hover:bg-green-950/30",

  text:         "text-green-400",
  subtext:      "text-green-700",
  accent:       "text-green-400",
  accentAlt:    "text-green-300",

  gameArea:     "bg-black",
  gridColor:    "#052e16",
  objectBg:     "#00ff41",
  objectGlow:   "rgba(0,255,65,0.6)",

  timerNormal:  "text-green-400",
  timerWarn:    "text-yellow-400",
  timerAlert:   "text-red-400",

  btnPlay:      "bg-green-400 hover:bg-green-300 text-black",
  btnSecondary: "border-2 border-green-700 hover:border-green-400 text-green-600 hover:text-green-400",

  input:        "bg-black border border-green-600 text-green-400 placeholder-green-800 focus:ring-green-400",
  badge:        "bg-green-950 text-green-400",

  progressBg:   "bg-green-950",
  progressFill: "#00ff41",

  divider:      "border-green-900",
  footerText:   "text-green-900",

  font:         "'Share Tech Mono', monospace",
};

// ─────────────────────────────────────────────────────────
// 💜 NEON — Rose/violet fluo sur fond très sombre, cyberpunk
// ─────────────────────────────────────────────────────────
const neon: Theme = {
  key:          "neon",
  name:         "NEON",
  emoji:        "💜",
  description:  "Cyberpunk fluo",
  color:        "#f0abfc",
  border:       "rgba(240,171,252,0.4)",

  bg:           "bg-[#0d0015]",
  header:       "bg-[#130020] border-fuchsia-500/30",
  card:         "bg-fuchsia-950/30 border-fuchsia-500/20",
  cardHover:    "hover:bg-fuchsia-900/20",

  text:         "text-fuchsia-100",
  subtext:      "text-fuchsia-400",
  accent:       "text-fuchsia-300",
  accentAlt:    "text-pink-400",

  gameArea:     "bg-[#0d0015]",
  gridColor:    "#2e1065",
  objectBg:     "#f0abfc",
  objectGlow:   "rgba(240,171,252,0.7)",

  timerNormal:  "text-fuchsia-300",
  timerWarn:    "text-pink-400",
  timerAlert:   "text-red-400",

  btnPlay:      "bg-fuchsia-500 hover:bg-fuchsia-400 text-white",
  btnSecondary: "border-2 border-fuchsia-700 hover:border-fuchsia-400 text-fuchsia-400 hover:text-fuchsia-300",

  input:        "bg-fuchsia-950/50 border border-fuchsia-600 text-fuchsia-100 placeholder-fuchsia-700 focus:ring-fuchsia-400",
  badge:        "bg-fuchsia-900/50 text-fuchsia-300",

  progressBg:   "bg-fuchsia-950",
  progressFill: "#f0abfc",

  divider:      "border-fuchsia-900",
  footerText:   "text-fuchsia-900",

  font:         "'Share Tech Mono', monospace",
};

// ─────────────────────────────────────────────────────────
// 🌸 PASTEL — Tons doux, fond clair, ambiance printemps
// ─────────────────────────────────────────────────────────
const pastel: Theme = {
  key:          "pastel",
  name:         "PASTEL",
  emoji:        "🌸",
  description:  "Douceur printanière",
  color:        "#a78bfa",
  border:       "rgba(167,139,250,0.4)",

  bg:           "bg-slate-100",
  header:       "bg-white border-slate-200",
  card:         "bg-white border-slate-200",
  cardHover:    "hover:bg-violet-50",

  text:         "text-slate-800",
  subtext:      "text-slate-500",
  accent:       "text-violet-500",
  accentAlt:    "text-pink-400",

  gameArea:     "bg-slate-100",
  gridColor:    "#e2e8f0",
  objectBg:     "#a78bfa",
  objectGlow:   "rgba(167,139,250,0.5)",

  timerNormal:  "text-violet-500",
  timerWarn:    "text-orange-400",
  timerAlert:   "text-red-500",

  btnPlay:      "bg-violet-400 hover:bg-violet-500 text-white",
  btnSecondary: "border-2 border-slate-300 hover:border-violet-400 text-slate-500 hover:text-violet-500",

  input:        "bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-violet-400",
  badge:        "bg-violet-100 text-violet-600",

  progressBg:   "bg-slate-200",
  progressFill: "#a78bfa",

  divider:      "border-slate-200",
  footerText:   "text-slate-400",

  font:         "'Share Tech Mono', monospace",
};

// ─────────────────────────────────────────────────────────
// 📦 Export principal
// ─────────────────────────────────────────────────────────
export const THEMES: Record<ThemeKey, Theme> = { dark, retro, neon, pastel };

export const THEME_LIST = Object.values(THEMES);

export const DEFAULT_THEME: ThemeKey = "dark";
