-- ============================================================
-- 🗄️ SCHÉMA DE LA BASE DE DONNÉES — Chasse au Logo
-- Fichier : lib/schema.sql
--
-- Ce fichier contient les instructions SQL pour créer
-- toutes les tables nécessaires au jeu.
--
-- 📌 Comment l'utiliser ?
-- 1. Va sur https://console.neon.tech
-- 2. Ouvre ton projet → SQL Editor
-- 3. Copie-colle ce fichier et exécute-le
-- ============================================================


-- ─────────────────────────────────────────────
-- 👤 TABLE : users
-- Stocke les joueurs du jeu
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,         -- Identifiant unique auto-incrémenté
  username    VARCHAR(50) UNIQUE NOT NULL, -- Pseudo du joueur (unique)
  created_at  TIMESTAMP DEFAULT NOW()      -- Date d'inscription
);


-- ─────────────────────────────────────────────
-- 🎮 TABLE : games
-- Stocke chaque partie jouée
--
-- Relation : une partie appartient à un utilisateur
-- → user_id est une clé étrangère vers users(id)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
  id            SERIAL PRIMARY KEY,        -- Identifiant unique de la partie
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Joueur
  score         INTEGER NOT NULL,          -- Nombre de logos attrapés
  time_seconds  INTEGER NOT NULL,          -- Temps total en secondes
  clicks_total  INTEGER DEFAULT 0,         -- Nombre total de clics (précision)
  created_at    TIMESTAMP DEFAULT NOW()    -- Date de la partie
);


-- ─────────────────────────────────────────────
-- 🏆 VUE : leaderboard
-- Une "vue" est une requête SQL sauvegardée.
-- Elle calcule automatiquement le classement
-- en groupant les meilleures parties par joueur.
--
-- Logique : on prend le MEILLEUR temps (MIN) de chaque joueur
-- ─────────────────────────────────────────────
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.username,                              -- Pseudo du joueur
  COUNT(g.id)        AS total_games,       -- Nombre de parties jouées
  MIN(g.time_seconds) AS best_time,        -- Meilleur temps (le plus bas = le mieux)
  MAX(g.score)       AS best_score,        -- Meilleur score
  MAX(g.created_at)  AS last_played        -- Dernière partie jouée
FROM users u
JOIN games g ON g.user_id = u.id
GROUP BY u.username
ORDER BY best_time ASC;                    -- Classé du plus rapide au plus lent


-- ─────────────────────────────────────────────
-- 🌱 DONNÉES DE TEST (optionnel)
-- Quelques données pour tester l'affichage
-- du leaderboard sans jouer
-- ─────────────────────────────────────────────
INSERT INTO users (username) VALUES
  ('SpeedRunner42'),
  ('LogoHunter'),
  ('ClickMaster')
ON CONFLICT (username) DO NOTHING; -- Évite les doublons si on re-exécute

INSERT INTO games (user_id, score, time_seconds, clicks_total) VALUES
  (1, 5, 12, 6),
  (1, 5, 9,  5),
  (2, 5, 15, 7),
  (3, 5, 20, 9);
