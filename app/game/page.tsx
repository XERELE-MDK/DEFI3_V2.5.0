"use client";

// ============================================================
// 🎮 DÉFI 3 — À LA CHASSE AU LOGO !
// Fichier : app/game/page.tsx
//
// Technologies utilisées :
// - Next.js 14 (App Router)
// - Tailwind CSS (style et animations)
// - React Hooks : useState, useEffect, useRef, useCallback
// - useSearchParams : lecture des paramètres d'URL
// - fetch() vers /api/users et /api/scores pour sauvegarder
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ─────────────────────────────────────────────
// 📐 CONSTANTES DU JEU
// ─────────────────────────────────────────────

const LOGO_SIZE     = 80;   // Taille du logo en pixels
const MOVE_INTERVAL = 1200; // Délai entre chaque déplacement (ms)
const TOTAL_LOGOS   = 5;    // Nombre de logos à attraper pour gagner

// Logo par défaut si aucun paramètre n'est passé dans l'URL
const DEFAULT_LOGO = { emoji: "🎯", color: "#facc15", shadow: "rgba(250,204,21,0.5)" };

// ─────────────────────────────────────────────
// 🎲 FONCTION UTILITAIRE — Position aléatoire
// ─────────────────────────────────────────────
function getRandomPosition(areaWidth: number, areaHeight: number) {
  const x = Math.random() * (areaWidth - LOGO_SIZE);
  const y = Math.random() * (areaHeight - LOGO_SIZE);
  return { x, y };
}

// ─────────────────────────────────────────────
// 🏆 COMPOSANT — Écran de victoire avec sauvegarde
//
// Cet écran gère 3 états internes :
//   "idle"    → formulaire pour entrer le pseudo
//   "saving"  → en cours de sauvegarde (loading)
//   "saved"   → score sauvegardé avec succès ✅
//   "error"   → une erreur s'est produite ❌
// ─────────────────────────────────────────────
function VictoryScreen({ score, timer, emoji, clicksTotal, onRestart }: {
  score: number;
  timer: number;
  emoji: string;
  clicksTotal: number;
  onRestart: () => void;
}) {
  // ── États internes de l'écran de victoire
  const [username, setUsername]   = useState("");          // Pseudo saisi
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");          // Message d'erreur éventuel

  // ─────────────────────────────────────────
  // 💾 FONCTION — Sauvegarder le score
  //
  // Flow :
  // 1. POST /api/users  → crée ou récupère le joueur
  // 2. POST /api/scores → sauvegarde la partie
  // ─────────────────────────────────────────
  const handleSave = async () => {
    // Validation : pseudo obligatoire (3-20 caractères)
    const trimmed = username.trim();
    if (trimmed.length < 3) {
      setErrorMsg("Le pseudo doit faire au moins 3 caractères !");
      return;
    }
    if (trimmed.length > 20) {
      setErrorMsg("Le pseudo ne peut pas dépasser 20 caractères !");
      return;
    }

    setSaveState("saving");
    setErrorMsg("");

    try {
      // ── Étape 1 : Créer ou récupérer l'utilisateur
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });

      if (!userRes.ok) {
        const userErr = await userRes.json();
        throw new Error(userErr.error || "Erreur création utilisateur");
      }

      const userData = await userRes.json();
      const userId = userData.user.id; // On récupère l'id pour la prochaine requête

      // ── Étape 2 : Sauvegarder la partie
      const scoreRes = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          score,
          timeSeconds: timer,
          clicksTotal,
        }),
      });

      if (!scoreRes.ok) {
        const scoreErr = await scoreRes.json();
        throw new Error(scoreErr.error || "Erreur sauvegarde score");
      }

      // ✅ Tout s'est bien passé
      setSaveState("saved");

    } catch (err: unknown) {
      // ❌ Une erreur s'est produite
      setSaveState("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] border-2 border-yellow-400 rounded-2xl px-8 py-8 text-center shadow-2xl max-w-md w-full mx-4">

        {/* ── En-tête : emoji + titre + temps ── */}
        <div className="text-5xl mb-3">{emoji}</div>
        <h2 className="text-4xl font-black text-yellow-400 tracking-tight mb-1">
          VICTOIRE !
        </h2>
        <p className="text-slate-400 mb-5">
          Temps : <span className="text-white font-bold">{timer}s</span>
          {" · "}
          Score : <span className="text-yellow-400 font-bold">{score}/{TOTAL_LOGOS}</span>
        </p>

        {/* ════════════════════════════════
            CAS 1 : Formulaire de saisie
            Affiché tant que saveState = "idle"
        ════════════════════════════════ */}
        {saveState === "idle" && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">
                Entre ton pseudo pour sauvegarder
              </p>

              {/* Champ de saisie du pseudo */}
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg(""); // Efface l'erreur au fur et à mesure
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSave()} // Entrée = valider
                placeholder="Ton pseudo..."
                maxLength={20}
                className="w-full bg-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-center font-bold text-lg outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                autoFocus
              />

              {/* Compteur de caractères */}
              <p className="text-slate-600 text-xs mt-1 text-right">
                {username.length}/20
              </p>

              {/* Message d'erreur de validation */}
              {errorMsg && (
                <p className="text-red-400 text-sm mt-2">{errorMsg}</p>
              )}
            </div>

            {/* Boutons : Sauvegarder + Passer */}
            <button
              onClick={handleSave}
              disabled={username.trim().length < 3}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-black font-black text-lg rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              💾 SAUVEGARDER
            </button>

            {/* Option : jouer sans sauvegarder */}
            <button
              onClick={onRestart}
              className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Passer sans sauvegarder → Rejouer
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            CAS 2 : Sauvegarde en cours
            Spinner pendant l'appel API
        ════════════════════════════════ */}
        {saveState === "saving" && (
          <div className="py-8 space-y-4">
            {/* Spinner CSS */}
            <div className="w-12 h-12 mx-auto border-4 border-slate-600 border-t-yellow-400 rounded-full animate-spin" />
            <p className="text-slate-400">Sauvegarde en cours...</p>
          </div>
        )}

        {/* ════════════════════════════════
            CAS 3 : Score sauvegardé ✅
            Confirmation + lien leaderboard
        ════════════════════════════════ */}
        {saveState === "saved" && (
          <div className="space-y-4">
            {/* Badge de confirmation */}
            <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
              <p className="text-green-400 font-bold text-lg">✅ Score sauvegardé !</p>
              <p className="text-slate-400 text-sm mt-1">
                Bien joué <span className="text-white font-bold">{username}</span> !
                Tu es dans le classement 🏆
              </p>
            </div>

            {/* Bouton vers le leaderboard */}
            <Link
              href="/leaderboard"
              className="block w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-center"
            >
              🏆 VOIR LE CLASSEMENT
            </Link>

            {/* Bouton rejouer */}
            <button
              onClick={onRestart}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-black text-lg rounded-xl transition-all duration-200"
            >
              🔄 REJOUER
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            CAS 4 : Erreur ❌
            Message + option réessayer
        ════════════════════════════════ */}
        {saveState === "error" && (
          <div className="space-y-4">
            <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
              <p className="text-red-400 font-bold">❌ Erreur de sauvegarde</p>
              <p className="text-slate-400 text-sm mt-1">{errorMsg}</p>
            </div>

            {/* Réessayer → remet l'état à "idle" pour re-afficher le formulaire */}
            <button
              onClick={() => { setSaveState("idle"); setErrorMsg(""); }}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg rounded-xl transition-all"
            >
              🔄 RÉESSAYER
            </button>

            <button
              onClick={onRestart}
              className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Rejouer sans sauvegarder
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🎮 COMPOSANT PRINCIPAL — Le Jeu
// ─────────────────────────────────────────────
export default function GamePage() {

  // ── Lecture des paramètres d'URL
  const searchParams = useSearchParams();
  const logo = {
    emoji:  searchParams.get("logo")   || DEFAULT_LOGO.emoji,
    color:  searchParams.get("color")  || DEFAULT_LOGO.color,
    shadow: searchParams.get("shadow") || DEFAULT_LOGO.shadow,
  };

  // ── États du jeu ──────────────────────────
  const [position, setPosition]       = useState({ x: 200, y: 200 });
  const [score, setScore]             = useState(0);
  const [timer, setTimer]             = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [hasWon, setHasWon]           = useState(false);
  const [clickEffect, setClickEffect] = useState(false);

  // ── clicksTotal : compte TOUS les clics (y compris les ratés)
  // Utile pour les stats — sauvegardé en DB avec la partie
  const [clicksTotal, setClicksTotal] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────
  // 🎲 DÉPLACER LE LOGO
  // ─────────────────────────────────────────
  const moveLogo = useCallback(() => {
    if (!gameAreaRef.current) return;
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    setPosition(getRandomPosition(width, height));
  }, []);

  // ─────────────────────────────────────────
  // ⏱️ EFFET — Déplacement automatique
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || hasWon) return;
    const moveInterval = setInterval(moveLogo, MOVE_INTERVAL);
    return () => clearInterval(moveInterval);
  }, [isPlaying, hasWon, moveLogo]);

  // ─────────────────────────────────────────
  // ⏱️ EFFET — Chronomètre
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || hasWon) return;
    const timerInterval = setInterval(() => setTimer((p) => p + 1), 1000);
    return () => clearInterval(timerInterval);
  }, [isPlaying, hasWon]);

  // ─────────────────────────────────────────
  // 🖱️ CLIC SUR LE LOGO
  // ─────────────────────────────────────────
  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying || hasWon) return;

    // On incrémente le total de clics à chaque clic réussi
    setClicksTotal((p) => p + 1);

    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 300);

    const newScore = score + 1;
    setScore(newScore);

    if (newScore >= TOTAL_LOGOS) {
      setHasWon(true);
      setIsPlaying(false);
    } else {
      moveLogo();
    }
  };

  // ─────────────────────────────────────────
  // 🚀 DÉMARRER / RECOMMENCER
  // ─────────────────────────────────────────
  const startGame = () => {
    setScore(0);
    setTimer(0);
    setClicksTotal(0); // Reset du compteur de clics
    setHasWon(false);
    setIsPlaying(true);
    moveLogo();
  };

  // ─────────────────────────────────────────
  // 🎨 RENDU
  // ─────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-mono flex flex-col">

      {/* ── En-tête ────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#1e293b] border-b border-slate-700">
        <h1 className="text-xl font-black tracking-widest text-yellow-400 uppercase">
          {logo.emoji} Chasse au Logo
        </h1>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Score</p>
            <p className="text-2xl font-black text-white">
              {score}<span className="text-slate-500 text-sm">/{TOTAL_LOGOS}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Temps</p>
            <p className="text-2xl font-black text-cyan-400">{timer}s</p>
          </div>
        </div>
      </header>

      {/* ── Zone de jeu ────────────────────── */}
      <div
        ref={gameAreaRef}
        className="relative flex-1 overflow-hidden cursor-crosshair"
        style={{ minHeight: "500px" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Message d'accueil */}
        {!isPlaying && !hasWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10">
            <p className="text-slate-400 text-center text-lg px-4">
              Attrape le logo{" "}
              <span className="text-yellow-400 font-bold">{TOTAL_LOGOS} fois</span>
              {" "}le plus vite possible !
            </p>
            <button
              onClick={startGame}
              className="px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg shadow-yellow-400/30"
            >
              🚀 DÉMARRER
            </button>
          </div>
        )}

        {/* Le logo qui bouge */}
        {isPlaying && !hasWon && (
          <button
            onClick={handleLogoClick}
            className="absolute z-20 flex items-center justify-center rounded-2xl hover:scale-110 active:scale-90 select-none"
            style={{
              left: position.x,
              top: position.y,
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              background: clickEffect ? "#4ade80" : logo.color,
              boxShadow: clickEffect ? "0 0 20px rgba(74,222,128,0.6)" : `0 0 20px ${logo.shadow}`,
              transform: clickEffect ? "scale(1.25)" : "scale(1)",
              transition: "left 0.3s ease-out, top 0.3s ease-out, transform 0.15s, background 0.15s",
            }}
            aria-label="Clique sur le logo !"
          >
            <span className="text-3xl">{logo.emoji}</span>
          </button>
        )}

        {/* Barre de progression */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-700">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${(score / TOTAL_LOGOS) * 100}%`, background: logo.color }}
            />
          </div>
        )}
      </div>

      {/* ── Écran de victoire avec sauvegarde ── */}
      {hasWon && (
        <VictoryScreen
          score={score}
          timer={timer}
          emoji={logo.emoji}
          clicksTotal={clicksTotal}
          onRestart={startGame}
        />
      )}

    </main>
  );
}


