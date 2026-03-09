// ============================================================
// 🔌 API ROUTE — Utilisateurs
// Fichier : app/api/users/route.ts
//
// Cette route gère la création et la récupération
// des joueurs dans la base de données.
//
// 📌 Endpoints disponibles :
//    POST /api/users → Créer ou récupérer un joueur
//    GET  /api/users?username=xxx → Chercher un joueur
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createOrGetUser, getUserByUsername } from "@/lib/queries";

// ─────────────────────────────────────────────
// 📥 POST /api/users
//
// Reçoit un pseudo et crée le joueur en DB
// Si le pseudo existe déjà → retourne l'existant
//
// Body attendu :
// { "username": "MonPseudo" }
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1️⃣ On lit le body de la requête (JSON)
    const body = await request.json();
    const { username } = body;

    // 2️⃣ Validation : le pseudo est obligatoire
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "❌ Le champ 'username' est obligatoire" },
        { status: 400 } // 400 = Bad Request
      );
    }

    // 3️⃣ Validation : longueur du pseudo (3 à 20 caractères)
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      return NextResponse.json(
        { error: "❌ Le pseudo doit faire entre 3 et 20 caractères" },
        { status: 400 }
      );
    }

    // 4️⃣ Création ou récupération du joueur en DB
    const user = await createOrGetUser(trimmed);

    // 5️⃣ On retourne l'utilisateur avec un statut 201 (Created)
    return NextResponse.json(
      { success: true, user },
      { status: 201 }
    );

  } catch (error) {
    // En cas d'erreur imprévue → on retourne un 500
    console.error("❌ Erreur POST /api/users :", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// 📤 GET /api/users?username=xxx
//
// Cherche un joueur par son pseudo
//
// Exemple d'appel :
// fetch("/api/users?username=SpeedRunner42")
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // 1️⃣ On récupère le paramètre "username" dans l'URL
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // 2️⃣ Validation
    if (!username) {
      return NextResponse.json(
        { error: "❌ Paramètre 'username' manquant dans l'URL" },
        { status: 400 }
      );
    }

    // 3️⃣ Recherche en DB
    const user = await getUserByUsername(username);

    // 4️⃣ Si introuvable → 404
    if (!user) {
      return NextResponse.json(
        { error: "Joueur introuvable" },
        { status: 404 }
      );
    }

    // 5️⃣ On retourne le joueur trouvé
    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("❌ Erreur GET /api/users :", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
