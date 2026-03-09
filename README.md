# 🎯 Chasse au Logo !

> Défi 3 — Coordonnées et Aléatoire  
> Un mini-jeu interactif où tu dois attraper un logo qui se déplace aléatoirement sur l'écran.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00e5bf?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Technologies](#-technologies)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration NeonDB](#-configuration-neondb)
- [Lancer le projet](#-lancer-le-projet)
- [API Routes](#-api-routes)
- [Concepts appris](#-concepts-appris)

---

## 🎮 Présentation

**Chasse au Logo** est un mini-jeu web développé dans le cadre d'un défi pédagogique sur les **coordonnées et l'aléatoire** en JavaScript.

### Comment jouer ?
1. Entre sur la page d'accueil et clique sur **JOUER**
2. Un logo 🎯 apparaît à une position aléatoire sur l'écran
3. **Clique dessus** avant qu'il ne se déplace !
4. Attrape-le **5 fois** le plus vite possible
5. Ton score est sauvegardé → tente de battre le record sur le **Leaderboard** 🏆

### Pages disponibles
| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Présentation du jeu |
| Jeu | `/game` | La partie en cours |
| Classement | `/leaderboard` | Top 10 des joueurs |

---

## 🛠 Technologies

| Technologie | Rôle dans le projet |
|-------------|---------------------|
| **Next.js 14** | Framework React fullstack — gère les pages et les API Routes |
| **Tailwind CSS** | Style et animations — classes utilitaires CSS |
| **NeonDB** | Base de données PostgreSQL serverless — stocke scores et joueurs |
| **TypeScript** | Typage statique — fiabilité du code |
| **Windsurf IDE** | Environnement de développement avec IA intégrée |

---

## 📁 Structure du projet

```
chasse-au-logo/
│
├── app/                          # App Router Next.js
│   ├── page.tsx                  # 🏠 Page d'accueil
│   ├── game/
│   │   └── page.tsx              # 🎮 Page du jeu
│   ├── leaderboard/
│   │   └── page.tsx              # 🏆 Page du classement
│   └── api/                      # API Routes (backend)
│       ├── users/
│       │   └── route.ts          # GET/POST joueurs
│       ├── scores/
│       │   └── route.ts          # GET/POST scores
│       └── leaderboard/
│           └── route.ts          # GET classement
│
├── lib/                          # Utilitaires partagés
│   ├── db.ts                     # Connexion NeonDB
│   ├── queries.ts                # Requêtes SQL
│   └── schema.sql                # Structure des tables
│
├── .env.local                    # Variables secrètes (non commité)
├── .env.local.example            # Modèle de configuration
├── tailwind.config.ts            # Config Tailwind
├── next.config.ts                # Config Next.js
└── README.md                     # Ce fichier
```

---

## ⚙️ Installation

### Prérequis
- **Node.js** v18 ou supérieur
- **npm** ou **yarn**
- Un compte [NeonDB](https://neon.tech) (gratuit)

### Étapes

**1. Cloner le projet**
```bash
git clone https://github.com/ton-username/chasse-au-logo.git
cd chasse-au-logo
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Installer le driver NeonDB**
```bash
npm install @neondatabase/serverless
```

**4. Copier le fichier d'environnement**
```bash
cp .env.local.example .env.local
```

---

## 🗄️ Configuration NeonDB

### Créer la base de données

1. Va sur [console.neon.tech](https://console.neon.tech)
2. Crée un **nouveau projet**
3. Copie la **Connection string** depuis le Dashboard
4. Colle-la dans ton fichier `.env.local` :

```env
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
```

### Créer les tables

Dans le **SQL Editor** de NeonDB, exécute le contenu de `lib/schema.sql` :

```sql
-- Table des joueurs
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des parties
CREATE TABLE IF NOT EXISTS games (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  score        INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  clicks_total INTEGER DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Vue du classement
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.username,
  COUNT(g.id)         AS total_games,
  MIN(g.time_seconds) AS best_time,
  MAX(g.score)        AS best_score,
  MAX(g.created_at)   AS last_played
FROM users u
JOIN games g ON g.user_id = u.id
GROUP BY u.username
ORDER BY best_time ASC;
```

---

## 🚀 Lancer le projet

```bash
# Mode développement
npm run dev

# Build production
npm run build
npm start
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## 🔌 API Routes

### Joueurs

| Méthode | Endpoint | Description | Body / Params |
|---------|----------|-------------|---------------|
| `POST` | `/api/users` | Créer ou récupérer un joueur | `{ username: string }` |
| `GET` | `/api/users` | Chercher un joueur | `?username=xxx` |

**Exemple POST :**
```js
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "SpeedRunner42" }),
});
```

---

### Scores

| Méthode | Endpoint | Description | Body / Params |
|---------|----------|-------------|---------------|
| `POST` | `/api/scores` | Sauvegarder une partie | `{ userId, score, timeSeconds, clicksTotal }` |
| `GET` | `/api/scores` | Historique d'un joueur | `?userId=1` |

**Exemple POST :**
```js
const res = await fetch("/api/scores", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: 1,
    score: 5,
    timeSeconds: 12,
    clicksTotal: 7,
  }),
});
```

---

### Leaderboard

| Méthode | Endpoint | Description | Params |
|---------|----------|-------------|--------|
| `GET` | `/api/leaderboard` | Top 10 joueurs | `?limit=10` |

---

## 🧠 Concepts appris

Ce projet couvre les notions suivantes :

### JavaScript / TypeScript
- `Math.random()` — génération de positions aléatoires
- `setInterval` / `clearInterval` — déplacement automatique du logo
- Gestion des événements (`onClick`, `e.stopPropagation()`)
- Logique conditionnelle Si/Alors (Si clic → score + déplacement)
- Manipulation des coordonnées `(x, y)` dans le DOM

### React / Next.js
- `useState` — gestion des états (score, timer, position)
- `useEffect` — effets de bord (setInterval, fetch)
- `useRef` — accès aux dimensions réelles d'un élément HTML
- `useCallback` — optimisation des fonctions
- API Routes — backend intégré dans Next.js

### Base de données
- Connexion PostgreSQL serverless avec NeonDB
- Requêtes SQL : `INSERT`, `SELECT`, `JOIN`, `GROUP BY`
- Vues SQL (`CREATE VIEW`) pour simplifier les requêtes complexes
- Clés étrangères (`REFERENCES`) et intégrité des données

### CSS / Tailwind
- Animations `@keyframes` (floatUp, glitch, pulse, scanline)
- Positionnement absolu pour le mouvement du logo
- Variables CSS et design system cohérent

---

## 👤 Auteur

Projet réalisé dans le cadre d'une formation en développement web.

---

## 📄 Licence

MIT — libre d'utilisation à des fins éducatives.
