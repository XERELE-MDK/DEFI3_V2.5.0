// ============================================================
// 🛠️ FONCTIONS D'ACCÈS À LA BASE DE DONNÉES
// Fichier : lib/queries.ts
//
// Ce fichier contient toutes les fonctions qui
// communiquent avec NeonDB.
//
// Principe : on centralise les requêtes SQL ici
// pour ne pas les répéter dans les API Routes.
// ============================================================

import { sql } from "./db";

// ─────────────────────────────────────────────
// 📦 TYPES TypeScript
// Définit la forme des données qu'on manipule
// ─────────────────────────────────────────────

export type User = {
  id: number;
  username: string;
  created_at: string;
};

export type Game = {
  id: number;
  user_id: number;
  score: number;
  time_seconds: number;
  clicks_total: number;
  created_at: string;
};

export type LeaderboardEntry = {
  username: string;
  total_games: number;
  best_time: number;
  best_score: number;
  last_played: string;
};


// ─────────────────────────────────────────────
// 👤 UTILISATEURS
// ─────────────────────────────────────────────

/**
 * Crée un nouvel utilisateur OU récupère l'existant
 * si le pseudo est déjà pris (logique "upsert").
 *
 * @param username - Le pseudo du joueur
 * @returns L'utilisateur créé ou existant
 */
export async function createOrGetUser(username: string): Promise<User> {
  // ON CONFLICT → si le pseudo existe déjà, on le retourne sans erreur
  const result = await sql`
    INSERT INTO users (username)
    VALUES (${username})
    ON CONFLICT (username)
    DO UPDATE SET username = EXCLUDED.username
    RETURNING *
  `;
  return result[0] as User;
}

/**
 * Récupère un utilisateur par son pseudo
 *
 * @param username - Le pseudo à chercher
 * @returns L'utilisateur ou null si introuvable
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users
    WHERE username = ${username}
    LIMIT 1
  `;
  return result.length > 0 ? (result[0] as User) : null;
}


// ─────────────────────────────────────────────
// 🎮 PARTIES
// ─────────────────────────────────────────────

/**
 * Sauvegarde une partie terminée en base de données
 *
 * @param userId       - L'id du joueur
 * @param score        - Le score final
 * @param timeSeconds  - Le temps en secondes
 * @param clicksTotal  - Nombre total de clics
 * @returns La partie sauvegardée
 */
export async function saveGame(
  userId: number,
  score: number,
  timeSeconds: number,
  clicksTotal: number
): Promise<Game> {
  const result = await sql`
    INSERT INTO games (user_id, score, time_seconds, clicks_total)
    VALUES (${userId}, ${score}, ${timeSeconds}, ${clicksTotal})
    RETURNING *
  `;
  return result[0] as Game;
}

/**
 * Récupère l'historique des parties d'un joueur
 * Triées de la plus récente à la plus ancienne
 *
 * @param userId - L'id du joueur
 * @returns Liste des parties du joueur
 */
export async function getGamesByUser(userId: number): Promise<Game[]> {
  const result = await sql`
    SELECT * FROM games
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return result as Game[];
}


// ─────────────────────────────────────────────
// 🏆 LEADERBOARD
// ─────────────────────────────────────────────

/**
 * Récupère le classement global (top 10)
 * Utilise la VUE "leaderboard" définie dans schema.sql
 *
 * @param limit - Nombre de joueurs à afficher (défaut: 10)
 * @returns Liste des meilleurs joueurs
 */
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const result = await sql`
    SELECT * FROM leaderboard
    LIMIT ${limit}
  `;
  return result as LeaderboardEntry[];
}
