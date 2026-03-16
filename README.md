
# 🎯 Chasse au Logo ! — v2.5.0

> Défi 3 — Coordonnées et Aléatoire  
> Mini-jeu interactif multimodes avec thèmes visuels, musique adaptative, icônes personnalisées et classement en ligne.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00e5bf?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Howler.js](https://img.shields.io/badge/Howler.js-Audio-ff6b35?style=for-the-badge)

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Modes de jeu](#-modes-de-jeu)
- [Difficulté](#-niveaux-de-difficulté)
- [Thèmes visuels](#-thèmes-visuels)
- [Musiques](#-musiques-disponibles)
- [Technologies](#-technologies)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Fichiers médias requis](#-fichiers-médias-requis)
- [Configuration NeonDB](#-configuration-neondb)
- [Migrations](#-migrations-sql)
- [Lancer le projet](#-lancer-le-projet)
- [Dépannage](#-dépannage)
- [API Routes](#-api-routes)
- [Paramètres d'URL](#-paramètres-durl)
- [Concepts appris](#-concepts-appris)
- [Roadmap](#-roadmap)

---

## 🎮 Présentation

**Chasse au Logo** est un mini-jeu web développé dans le cadre d'un défi pédagogique sur les **coordonnées et l'aléatoire** en JavaScript.

Le joueur configure sa partie en **5 étapes** sur la page d'accueil, puis affronte des objets qui se déplacent aléatoirement à l'écran — le tout dans une ambiance visuelle et sonore personnalisée.

### Pages disponibles

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | 5 sélecteurs : mode · logo · difficulté · thème · musique |
| Jeu | `/game` | La partie en cours |
| Classement | `/leaderboard` | Top joueurs par difficulté |

---

## 🕹️ Modes de jeu

Le joueur choisit parmi **3 modes** avant de jouer :

### 🎯 SOLO — 1 objet
- Attrape le logo **5 fois** le plus vite possible
- **Objectif** : temps le plus court
- Le chronomètre **monte** (+1s par seconde)
- Classé par temps au leaderboard

### 🎯🎯 DUO — 2 objets simultanés
- **2 logos bougent en même temps**
- **Compte à rebours** de 30 secondes
- **Objectif** : maximum de clics avant la fin du temps
- Classé par score au leaderboard

### 🎯🎯🎯 TRIO — 3 objets simultanés
- **3 logos bougent en même temps**
- **Compte à rebours** de 30 secondes
- **Objectif** : maximum de clics — mode chaos !
- Alerte visuelle rouge quand il reste ≤ 5 secondes

---

## ⚙️ Niveaux de difficulté

| Niveau | Intervalle déplacement | Taille logo | Effet ressenti |
|--------|----------------------|-------------|----------------|
| 🟢 FACILE | 1800ms | 90px | Lent et grand |
| 🟡 MOYEN | 1200ms | 80px | Standard |
| 🔴 DIFFICILE | 700ms | 60px | Rapide et petit |

---

## 🎨 Thèmes visuels

4 thèmes disponibles, sélectionnables sur la page d'accueil.  
Le thème choisi s'applique **instantanément** sur toutes les pages et **persiste** entre les sessions via `localStorage`.

| Thème | Fond | Accent | Ambiance |
|-------|------|--------|----------|
| 🌑 DARK | `#0f172a` ardoise | Jaune `#facc15` | Élégance nocturne — thème par défaut |
| 🖥️ RETRO | `#000000` noir | Vert `#00ff41` | Terminal phosphore années 80 |
| 💜 NEON | `#0d0015` violet | Rose `#f0abfc` | Cyberpunk fluo |
| 🌸 PASTEL | `slate-100` clair | Violet `#a78bfa` | Douceur printanière |

### Architecture des thèmes

Tous les tokens visuels sont centralisés dans `lib/themes.ts` :

```ts
// Chaque thème définit des classes Tailwind sémantiques
const dark: Theme = {
  bg:          "bg-[#0f172a]",    // Fond de page
  header:      "bg-[#1e293b] border-slate-700",
  text:        "text-white",
  accent:      "text-yellow-400",
  timerNormal: "text-cyan-400",
  timerAlert:  "text-red-400",
  progressFill:"#facc15",
  // ... etc
};
```

Le hook `useTheme` lit `?theme=` dans l'URL (game) ou `localStorage` (leaderboard) et retourne l'objet thème prêt à l'emploi.

---

## 🎵 Musiques disponibles

| Musique | Ambiance | Fichier |
|---------|----------|---------|
| 🎮 ARCADE | Rétro & fun | `public/sounds/arcade.mp3` |
| 🎵 LO-FI | Chill & focus | `public/sounds/lofi.mp3` |
| ⚔️ EPIC | Intense & rapide | `public/sounds/epic.mp3` |

Sons additionnels :

| Son | Moment | Fichier |
|-----|--------|---------|
| 👆 Clic | À chaque objet attrapé (pitch aléatoire) | `public/sounds/click.mp3` |
| 🏆 Victoire | Fin de partie | `public/sounds/victory.mp3` |

Bouton **🔇/🔊** dans le header pour couper tous les sons instantanément (`Howler.mute()`).

---

## 🛠 Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 14 | Framework React fullstack — pages + API Routes |
| **Tailwind CSS** | 3 | Style et animations — classes utilitaires |
| **NeonDB** | — | PostgreSQL serverless — scores et joueurs |
| **TypeScript** | 5 | Typage statique — fiabilité du code |
| **Howler.js** | 2 | Gestion audio — musique de fond + effets sonores |
| **Windsurf IDE** | — | Environnement de développement avec IA |

---

## 📁 Structure du projet

```
chasse-au-logo/
│
├── app/                          # App Router Next.js
│   ├── layout.tsx                # Layout global (polices Google Fonts)
│   ├── page.tsx                  # 🏠 Page d'accueil (5 sélecteurs)
│   ├── game/
│   │   └── page.tsx              # 🎮 Page du jeu (SOLO / DUO / TRIO)
│   ├── leaderboard/
│   │   └── page.tsx              # 🏆 Classement filtrable par difficulté
│   └── api/
│       ├── users/
│       │   └── route.ts          # POST créer/récupérer joueur
│       ├── scores/
│       │   └── route.ts          # POST sauvegarder partie
│       └── leaderboard/
│           └── route.ts          # GET classement (filtres difficulty + mode)
│
├── hooks/
│   ├── use-sound.ts              # 🎵 Hook Howler.js (musique + effets)
│   └── use-theme.ts              # 🎨 Hook thème (URL → localStorage)
│
├── lib/
│   ├── db.ts                     # Connexion NeonDB
│   ├── queries.ts                # Requêtes SQL typées
│   ├── themes.ts                 # 🎨 Tokens visuels des 4 thèmes
│   ├── schema.sql                # Schéma initial des tables
│   └── migration_v2.sql          # Migration v1 → v2/v3
│
├── public/
│   ├── icons/                    # 🖼️ Images PNG des logos (à fournir)
│   │   ├── target.png
│   │   ├── rocket.png
│   │   ├── star.png
│   │   ├── fire.png
│   │   └── diamond.png
│   └── sounds/                   # 🎵 Fichiers audio (à fournir)
│       ├── arcade.mp3
│       ├── lofi.mp3
│       ├── epic.mp3
│       ├── click.mp3
│       └── victory.mp3
│
├── .env.local                    # Variables secrètes (non commité)
├── .env.local.example            # Modèle de configuration
├── package.json                  # Dépendances + scripts optimisés Windows
└── README.md                     # Ce fichier
```

---

## ⚙️ Installation

### Prérequis
- **Node.js** v18 ou supérieur
- **npm** ou **yarn**
- Un compte [NeonDB](https://neon.tech) (gratuit)
- **16 Go de RAM recommandés** pour le mode développement Next.js

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

**3. Installer les packages spécifiques**
```bash
# Driver NeonDB
npm install @neondatabase/serverless

# Audio
npm install howler
npm install --save-dev @types/howler

# Variables d'environnement cross-platform (Windows)
npm install cross-env
```

**4. Copier le fichier d'environnement**
```bash
cp .env.local.example .env.local
```

**5. Remplir `.env.local`**
```env
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🖼️ Fichiers médias requis

> ⚠️ Ces fichiers ne sont **pas inclus** dans le dépôt pour des raisons de droits.  
> Tu dois les fournir toi-même avant de lancer le projet.

### Icônes (`public/icons/`)

Format recommandé : **PNG 512×512px, fond transparent**

| Fichier | Description | Source |
|---------|-------------|--------|
| `target.png` | 🎯 Cible | [flaticon.com](https://flaticon.com) |
| `rocket.png` | 🚀 Fusée | [flaticon.com](https://flaticon.com) |
| `star.png` | ⭐ Étoile | [icons8.com](https://icons8.com) |
| `fire.png` | 🔥 Flamme | [flaticon.com](https://flaticon.com) |
| `diamond.png` | 💎 Diamant | [icons8.com](https://icons8.com) |

> 💡 Si une image est absente, l'emoji fallback s'affiche automatiquement — le jeu fonctionne quand même.

### Sons (`public/sounds/`)

Format recommandé : **MP3, 128 kbps** (compresser sur [onlineconverter.com](https://www.onlineconverter.com/compress-mp3) si nécessaire)

| Fichier | Durée | Source |
|---------|-------|--------|
| `arcade.mp3` | ~2-3 min | [pixabay.com/music](https://pixabay.com/music/search/retro%20arcade/) |
| `lofi.mp3` | ~2-3 min | [pixabay.com/music](https://pixabay.com/music/search/lofi%20chill/) |
| `epic.mp3` | ~2-3 min | [pixabay.com/music](https://pixabay.com/music/search/epic%20battle/) |
| `click.mp3` | ~0.1s | [pixabay.com/sound-effects](https://pixabay.com/sound-effects/search/click/) |
| `victory.mp3` | ~2s | [pixabay.com/sound-effects](https://pixabay.com/sound-effects/search/victory/) |

---

## 🗄️ Configuration NeonDB

**1.** Va sur [console.neon.tech](https://console.neon.tech)  
**2.** Crée un nouveau projet  
**3.** Copie la **Connection string** depuis le Dashboard  
**4.** Colle-la dans `.env.local` sous `DATABASE_URL`

---

## 🔄 Migrations SQL

> À exécuter dans le **SQL Editor** de NeonDB.

### Première installation — `lib/schema.sql`

Crée les tables `users` et `games` ainsi que la vue `leaderboard` de base.

### Mise à jour v2/v3 — `lib/migration_v2.sql`

À exécuter **une seule fois** après le schéma initial.  
**Idempotent** — peut être relu sans risque (`IF NOT EXISTS`).

Ce fichier ajoute :

**Table `users`**
```sql
theme          VARCHAR(20)  DEFAULT 'dark'       -- Thème visuel préféré
selected_icon  VARCHAR(100) DEFAULT 'target.png' -- Icône choisie
selected_music VARCHAR(20)  DEFAULT 'arcade'     -- Musique préférée
```

**Table `games`**
```sql
difficulty    VARCHAR(10) DEFAULT 'easy' -- 'easy' | 'medium' | 'hard'
objects_count INTEGER     DEFAULT 1      -- Nombre d'objets (1-3)
```

**Vues SQL**
- `leaderboard` — mise à jour avec icône, difficulté, objects_count
- `leaderboard_by_difficulty` — classement avec `RANK() OVER (PARTITION BY difficulty)`

---

## 🚀 Lancer le projet

```bash
# Mode développement (mémoire étendue pour Windows)
npm run dev

# Build production
npm run build
npm start
```

Le script `dev` est configuré avec `cross-env NODE_OPTIONS=--max-old-space-size=8192` pour éviter les crashes mémoire sur Windows avec 16 Go de RAM.

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## 🐛 Dépannage

### `FATAL ERROR: JavaScript heap out of memory`
Node.js manque de mémoire pour compiler Next.js. Le `package.json` fourni règle ce problème automatiquement avec `--max-old-space-size=8192`. Vérifie que tu utilises bien le `package.json` du projet.

### `relation "leaderboard_by_difficulty" does not exist`
La migration v2 n'a pas encore été exécutée dans NeonDB. Lance le contenu de `lib/migration_v2.sql` dans le SQL Editor de NeonDB.

### `Parsing ecmascript source code failed`
Erreur de syntaxe dans un fichier TypeScript — souvent due à du code en double collé par accident. Vérifie que chaque fonction `export async function POST` et `export async function GET` n'apparaît qu'une seule fois par fichier.

### Images qui ne s'affichent pas
Les fichiers PNG sont absents de `public/icons/`. Le fallback emoji prend automatiquement le relais — le jeu reste fonctionnel.

### Sons muets
Les fichiers MP3 sont absents de `public/sounds/`. Howler ne plante pas — il n'émet simplement aucun son.

---

## 🔌 API Routes

### `POST /api/users` — Créer ou récupérer un joueur

```js
fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "SpeedRunner42" }),
});
// Retourne : { user: { id, username, theme, selected_icon, selected_music } }
```

---

### `POST /api/scores` — Sauvegarder une partie

```js
fetch("/api/scores", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId:       1,
    score:        5,
    timeSeconds:  12,
    clicksTotal:  7,
    difficulty:   "hard",   // 'easy' | 'medium' | 'hard'
    objectsCount: 2,        // 1 | 2 | 3
  }),
});
// Retourne : { success: true, game: { id, score, time_seconds, ... } }
```

---

### `GET /api/leaderboard` — Classement

```
GET /api/leaderboard                       → top 10 global
GET /api/leaderboard?difficulty=hard       → top 10 en difficile
GET /api/leaderboard?difficulty=easy&limit=5
```

---

## 🔗 Paramètres d'URL

La page d'accueil passe tous les choix via l'URL vers `/game` :

```
/game
  ?logo=🚀
  &image=%2Ficons%2Frocket.png
  &color=%2322d3ee
  &shadow=rgba(34,211,238,0.5)
  &difficulty=hard
  &moveInterval=700
  &logoSize=60
  &mode=duo
  &objects=2
  &timeLimit=30
  &music=arcade
  &theme=neon
```

| Paramètre | Type | Description |
|-----------|------|-------------|
| `logo` | string | Emoji fallback si image absente |
| `image` | string | Chemin vers l'icône PNG |
| `color` | string | Couleur hex de l'icône |
| `shadow` | string | Ombre rgba autour de l'objet |
| `difficulty` | `easy\|medium\|hard` | Niveau de difficulté |
| `moveInterval` | number | Délai entre déplacements (ms) |
| `logoSize` | number | Taille des objets (px) |
| `mode` | `solo\|duo\|trio` | Mode de jeu |
| `objects` | number | Nombre d'objets simultanés |
| `timeLimit` | number | Durée en secondes (0 = pas de limite) |
| `music` | `arcade\|lofi\|epic` | Musique de fond |
| `theme` | `dark\|retro\|neon\|pastel` | Thème visuel |

---

## 🧠 Concepts appris

### JavaScript / TypeScript
- `Math.random()` — positions aléatoires `(x, y)` dans une zone définie
- `setInterval` / `clearInterval` — déplacement automatique et chronomètre
- Gestion des événements (`onClick`, `e.stopPropagation()`)
- Tableaux d'objets — `positions[]` pour gérer plusieurs objets simultanés
- `fetch()` asynchrone — appels API séquentiels avec `async/await`
- Typage avancé — `type`, `Record<K,V>`, union types (`"solo" | "duo" | "trio"`)

### React / Next.js
- `useState` — gestion de multiples states interdépendants
- `useEffect` — effets de bord avec cleanup (`clearInterval`, `Howl.unload()`)
- `useRef` — accès aux dimensions DOM + compteur sans re-render
- `useCallback` — mémorisation des fonctions pour éviter les boucles infinies
- **Hooks custom** — `useSound`, `useTheme` : encapsulation de logique réutilisable
- `useSearchParams` — lecture des paramètres URL côté client
- API Routes — backend intégré Next.js avec validation des données
- `<Image>` Next.js — optimisation automatique avec fallback `onError`

### Base de données
- PostgreSQL serverless avec NeonDB
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` — migration sans perte de données
- Contraintes `CHECK` — validation côté base de données
- Vues SQL avec `RANK() OVER (PARTITION BY ...)` — classement par groupe
- `COALESCE` — valeurs par défaut sur les colonnes optionnelles

### Audio (Howler.js)
- Instance `Howl` — gestion de la musique de fond en boucle (`loop: true`)
- `Howler.mute()` — mute global instantané sur tous les sons
- `rate()` — variation du pitch pour éviter la répétition monotone
- `preload: false` — chargement à la demande pour économiser la RAM
- Cleanup avec `unload()` — libération mémoire au démontage du composant

### Thèmes (Architecture)
- Objet de configuration centralisé (`lib/themes.ts`) inspiré des design tokens
- Classes Tailwind **sémantiques** — `t.accent` plutôt que `text-yellow-400` en dur
- Persistance via `localStorage` — thème conservé entre les sessions
- Passage via URL (`?theme=neon`) — cohérence entre pages

### CSS / Tailwind
- Animations `@keyframes` — floatUp, glitch, pulse, scanline, blink
- Positionnement absolu avec `transition` — déplacement fluide des objets
- `transition-colors duration-500` — changement de thème animé

---

## 🗺️ Roadmap

- [x] Jeu de base — 1 objet, chrono
- [x] Leaderboard avec NeonDB
- [x] Sauvegarde du score après victoire
- [x] Sélection de l'icône (5 logos PNG + fallback emoji)
- [x] 3 niveaux de difficulté (vitesse + taille)
- [x] 3 modes de jeu — SOLO (chrono) / DUO / TRIO (score 30s)
- [x] Musique de fond + effets sonores (Howler.js)
- [x] 4 thèmes visuels — DARK / RETRO / NEON / PASTEL
- [x] Leaderboard filtrable par difficulté avec badges SOLO/DUO/TRIO
- [x] Optimisation mémoire Windows (`cross-env --max-old-space-size`)
- [x] Adaptation mobile complète (touch events, taille min objets)
- [ ] Publication en ligne (Vercel)

---

## 👤 Auteur

Projet réalisé dans le cadre d'une formation en développement web.

---

## 📄 Licence

MIT — libre d'utilisation à des fins éducatives.
=======
# DEFI3_V2.5.0
the 2.5 version of the game chasing the logo
>>>>>>> 391c8c45c47a1a2bdfdd3a04541e72c0d8bfcec7
