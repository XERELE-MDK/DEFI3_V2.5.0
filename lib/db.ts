// ============================================================
// 🗄️ CONFIGURATION NEONDB
// Fichier : lib/db.ts
//
// NeonDB est une base de données PostgreSQL "serverless"
// Ce fichier crée la connexion à la base de données
// et l'exporte pour être utilisé partout dans le projet.
//
// 📦 Installation requise :
//    npm install @neondatabase/serverless
// ============================================================

import { neon } from "@neondatabase/serverless";

// ─────────────────────────────────────────────
// 🔌 CONNEXION À NEONDB
//
// process.env.DATABASE_URL → Variable d'environnement
// définie dans le fichier .env.local (jamais committé sur Git !)
//
// Format de l'URL :
// postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
// ─────────────────────────────────────────────
if (!process.env.DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL est manquant ! Ajoute-le dans ton fichier .env.local"
  );
}

// On crée l'instance de connexion SQL
// `sql` est une fonction qu'on utilisera pour faire nos requêtes
export const sql = neon(process.env.DATABASE_URL);

// ─────────────────────────────────────────────
// 🧪 FONCTION — Tester la connexion
// Utile pour vérifier que tout fonctionne
// Usage : appelle testConnection() au démarrage
// ─────────────────────────────────────────────
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log("✅ NeonDB connecté à :", result[0].current_time);
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion NeonDB :", error);
    return false;
  }
}
