"use client";

// ============================================================
// 🏆 PAGE LEADERBOARD — Classement des joueurs
// Fichier : app/leaderboard/page.tsx
//
// Cette page affiche le classement global des joueurs
// en récupérant les données depuis /api/leaderboard
//
// Concepts utilisés :
// - fetch() vers une API Route Next.js
// - useState / useEffect pour charger les données
// - Rendu conditionnel (loading, erreur, données)
// ============================================================

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// 📦 TYPE — Structure d'une entrée du classement
// Correspond exactement à ce que retourne l'API
// ─────────────────────────────────────────────
type LeaderboardEntry = {
  rank: number;
  username: string;
  best_time: number;
  best_time_formatted: string;
  best_score: number;
  total_games: number;
  last_played: string;
};

// ─────────────────────────────────────────────
// 🥇 COMPOSANT — Médaille selon le rang
// Retourne une médaille emoji pour le top 3
// ─────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-3xl">🥇</span>;
  if (rank === 2) return <span className="text-3xl">🥈</span>;
  if (rank === 3) return <span className="text-3xl">🥉</span>;
  return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 font-bold text-sm">
      {rank}
    </span>
  );
}

// ─────────────────────────────────────────────
// ⏳ COMPOSANT — Skeleton de chargement
// Affiché pendant que les données arrivent
// Donne l'impression que la page charge proprement
// ─────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-slate-700" />
      <div className="flex-1 h-4 rounded bg-slate-700" />
      <div className="w-16 h-4 rounded bg-slate-700" />
      <div className="w-16 h-4 rounded bg-slate-700" />
      <div className="w-12 h-4 rounded bg-slate-700" />
    </div>
  );
}

// ─────────────────────────────────────────────
// 🏆 COMPOSANT PRINCIPAL — Leaderboard
// ─────────────────────────────────────────────
export default function LeaderboardPage() {

  // ── États ─────────────────────────────────
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);   // Chargement en cours ?
  const [error, setError] = useState<string | null>(null); // Message d'erreur éventuel
  const [lastUpdated, setLastUpdated] = useState<string>(""); // Heure du dernier refresh

  // ─────────────────────────────────────────
  // 📡 FONCTION — Charger le leaderboard
  // Fait un appel GET vers /api/leaderboard
  // ─────────────────────────────────────────
  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Appel à notre API Route Next.js
      const response = await fetch("/api/leaderboard?limit=10");

      // Vérification que la réponse est OK (status 200-299)
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      // Mise à jour des données dans le state
      setEntries(data.leaderboard);

      // Enregistre l'heure du dernier chargement
      setLastUpdated(new Date().toLocaleTimeString("fr-FR"));

    } catch (err) {
      console.error("❌ Erreur fetchLeaderboard :", err);
      setError("Impossible de charger le classement. Vérifie ta connexion.");
    } finally {
      // finally = exécuté TOUJOURS, même en cas d'erreur
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // ⏱️ EFFET — Chargement initial + auto-refresh
  // Le leaderboard se recharge automatiquement
  // toutes les 30 secondes pour rester à jour
  // ─────────────────────────────────────────
  useEffect(() => {
    // Chargement initial
    fetchLeaderboard();

    // Auto-refresh toutes les 30 secondes
    const refreshInterval = setInterval(fetchLeaderboard, 30000);

    // Nettoyage de l'intervalle au démontage du composant
    return () => clearInterval(refreshInterval);
  }, []); // [] = s'exécute une seule fois au montage

  // ─────────────────────────────────────────
  // 🎨 RENDU
  // ─────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-mono">

      {/* ── En-tête ──────────────────────── */}
      <header className="bg-[#1e293b] border-b border-slate-700 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">

          {/* Titre + sous-titre */}
          <div>
            <h1 className="text-2xl font-black text-yellow-400 tracking-widest uppercase">
              🏆 Leaderboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Classement par meilleur temps
            </p>
          </div>

          {/* Bouton refresh manuel */}
          <button
            onClick={fetchLeaderboard}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* L'icône tourne pendant le chargement */}
            <span className={isLoading ? "animate-spin" : ""}>🔄</span>
            Actualiser
          </button>
        </div>
      </header>

      {/* ── Contenu principal ─────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── CAS 1 : Erreur ──────────────── */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-400">⚠️ {error}</p>
            <button
              onClick={fetchLeaderboard}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-sm transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* ── CAS 2 : Chargement ──────────── */}
        {isLoading && (
          <div className="space-y-3">
            {/* On affiche 5 squelettes pendant le chargement */}
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {/* ── CAS 3 : Données chargées ─────── */}
        {!isLoading && !error && (

          <>
            {/* Aucun joueur encore */}
            {entries.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🎮</p>
                <p className="text-slate-400 text-lg">
                  Aucune partie jouée pour l&apos;instant.
                </p>
                <a
                  href="/game"
                  className="inline-block mt-4 px-6 py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-colors"
                >
                  Être le premier ! 🚀
                </a>
              </div>
            ) : (

              <div className="space-y-3">

                {/* ── En-tête du tableau ─────── */}
                <div className="grid grid-cols-12 gap-2 px-4 pb-2 text-xs text-slate-500 uppercase tracking-widest">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Joueur</div>
                  <div className="col-span-3 text-center">⏱ Temps</div>
                  <div className="col-span-2 text-center">🎯 Score</div>
                  <div className="col-span-2 text-center">🎮 Parties</div>
                </div>

                {/* ── Lignes du classement ───── */}
                {entries.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`
                      grid grid-cols-12 gap-2 items-center
                      px-4 py-4 rounded-xl border transition-all duration-200
                      hover:scale-[1.01] hover:shadow-lg
                      ${entry.rank === 1
                        ? "bg-yellow-400/10 border-yellow-400/40 shadow-yellow-400/10"
                        : entry.rank === 2
                        ? "bg-slate-400/10 border-slate-400/30"
                        : entry.rank === 3
                        ? "bg-orange-400/10 border-orange-400/30"
                        : "bg-slate-800/50 border-slate-700/50"
                      }
                    `}
                  >
                    {/* Rang / Médaille */}
                    <div className="col-span-1 flex justify-center">
                      <RankBadge rank={entry.rank} />
                    </div>

                    {/* Pseudo du joueur */}
                    <div className="col-span-4">
                      <p className={`font-bold truncate ${
                        entry.rank === 1 ? "text-yellow-400" :
                        entry.rank === 2 ? "text-slate-300" :
                        entry.rank === 3 ? "text-orange-400" : "text-white"
                      }`}>
                        {entry.username}
                      </p>
                    </div>

                    {/* Meilleur temps */}
                    <div className="col-span-3 text-center">
                      <span className="text-cyan-400 font-black">
                        {entry.best_time_formatted}
                      </span>
                    </div>

                    {/* Meilleur score */}
                    <div className="col-span-2 text-center">
                      <span className="text-white font-bold">
                        {entry.best_score}
                      </span>
                    </div>

                    {/* Nombre de parties */}
                    <div className="col-span-2 text-center">
                      <span className="text-slate-400 text-sm">
                        {entry.total_games}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dernière mise à jour */}
            {lastUpdated && (
              <p className="text-center text-slate-600 text-xs mt-6">
                Dernière mise à jour : {lastUpdated} · Refresh auto toutes les 30s
              </p>
            )}
          </>
        )}

        {/* ── Bouton retour au jeu ─────────── */}
        <div className="text-center mt-10">
          <a
            href="/game"
            className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🎯 Jouer
          </a>
        </div>

      </div>
    </main>
  );
}
