// ============================================================
// 🔌 API ROUTE — Leaderboard
// Fichier : app/api/leaderboard/route.ts
//
// Cette route retourne le classement global des joueurs
// basé sur leur meilleur temps de jeu.
//
// 📌 Endpoint disponible :
//    GET /api/leaderboard         → Top 10 joueurs
//    GET /api/leaderboard?limit=5 → Top N joueurs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/queries";

// ─────────────────────────────────────────────
// 📤 GET /api/leaderboard
//
// Retourne le classement trié par meilleur temps
//
// Exemples d'appels :
// fetch("/api/leaderboard")          → top 10
// fetch("/api/leaderboard?limit=5")  → top 5
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Récupération du paramètre optionnel "limit"
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    // 2️⃣ Si limit est fourni → on le convertit, sinon on prend 10 par défaut
    let limit = 10;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);

      // Validation : limit doit être entre 1 et 50
      if (isNaN(parsed) || parsed < 1 || parsed > 50) {
        return NextResponse.json(
          { error: "❌ 'limit' doit être un nombre entre 1 et 50" },
          { status: 400 }
        );
      }
      limit = parsed;
    }

    // 3️⃣ Récupération du leaderboard depuis la vue NeonDB
    const entries = await getLeaderboard(limit);

    // 4️⃣ On formate les données pour le frontend
    // On ajoute un rang (position) à chaque entrée
    const ranked = entries.map((entry, index) => ({
      rank: index + 1,        // 1er, 2ème, 3ème...
      ...entry,
      // Formatage du temps en "Xm Xs" si > 60 secondes
      best_time_formatted: formatTime(entry.best_time),
    }));

    // 5️⃣ Réponse finale
    return NextResponse.json({
      success: true,
      count: ranked.length,
      leaderboard: ranked,
    });

  } catch (error) {
    console.error("❌ Erreur GET /api/leaderboard :", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// 🛠️ FONCTION UTILITAIRE — Formater le temps
// Convertit un nombre de secondes en string lisible
//
// Exemples :
//   formatTime(9)  → "9s"
//   formatTime(75) → "1m 15s"
// ─────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
