# 🌿 WildBuddy — Your Offline AI Nature Companion

> **"Less scrolling. More exploring."**
> An offline-first, open-source AI application designed to help people spend less time staring at screens and more time observing nature.

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **IndexedDB**, **Node.js/Express**, and **Ollama** running local open-weight vision-language models.

---

## 🎯 The Mission

Most consumer AI apps are designed to maximize screen time, engagement metrics, and chat queries. **WildBuddy does the exact opposite**:
- The screen is designed to be the shortest part of the user's experience.
- Users receive a nature mission, lock their phone, walk outdoors, observe biodiversity, and return only to check off their discoveries.
- Identifies specimens (leaves, flowers, plants, birds, insects) using **local open-weight AI** via Ollama—ensuring complete privacy, zero subscription fees, and offline capabilities.
- Persists all observations, photos, and milestones locally in **IndexedDB** with full **PWA offline support**.

---

## 🎨 Visual Design Palette

WildBuddy uses a custom nature-inspired aesthetic crafted with warm, organic tones:

- **Forest Green** (`#245C45`) — Primary branding & active navigation
- **Deep Green** (`#173D30`) — High-contrast typography & hero cards
- **Soft Sage** (`#DCE8D5`) — Badges, secondary buttons & card accents
- **Warm Cream** (`#F7F5EB`) — Calming, easy-on-the-eyes background
- **Muted Terracotta** (`#C77B57`) — Streaks, alerts & action highlights
- **Charcoal** (`#26352C`) — Legible, accessible body text

---

## 🛠️ Architecture & Technology Stack

```
wildbuddy/
├── client/                     # Progressive Web App (React + Vite + Tailwind)
│   ├── public/                 # PWA icons, manifest, nature hero illustrations
│   ├── src/
│   │   ├── components/         # Reusable design system (Buttons, Cards, Badges, Modals)
│   │   ├── db/                 # IndexedDB abstraction (idb) for observations & stats
│   │   ├── features/           # Feature-driven UI:
│   │   │   ├── onboarding/     # First-time welcome & philosophy
│   │   │   ├── dashboard/      # Personalized touch-grass home dashboard
│   │   │   ├── identification/ # Camera capture & Ollama vision inference
│   │   │   ├── adventures/     # Screen-minimal outdoor missions & timer
│   │   │   ├── journal/        # Local photo scrapbook with search & JSON export
│   │   │   ├── progress/       # Real streak calculation & achievement badges
│   │   │   └── settings/       # Runtime diagnostics & model configuration
│   │   ├── hooks/              # Reactive hooks (online status, AI health)
│   │   ├── services/           # Backend API client + offline deterministic fallback
│   │   └── utils/              # Streak math, image compressor, achievement engine
├── server/                     # Lightweight Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/             # Configurable Ollama host & model names via env
│   │   ├── routes/             # Health, identify, adventure & config endpoints
│   │   ├── services/           # Ollama JSON generator & deterministic fallback
│   │   └── types/              # Strongly-typed schemas
├── tests/                      # Vitest unit test suite (streaks, badges, adventures)
└── docs/                       # Comprehensive setup, demo script, and offline guides
```

---

## ⚡ Quick Start Instructions (Windows)

### Prerequisites
1. **Node.js** (v18 or higher): Verify with `node -v`
2. **Ollama** (optional for demo mode, required for live local AI): [Download Ollama](https://ollama.com)

### 1. Install Dependencies
Clone the repository and install all dependencies:
```powershell
npm install
```

### 2. Configure Environment (Optional)
A default `.env` is provided in `server/.env`:
```env
PORT=3001
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_VISION_MODEL=gemma3
OLLAMA_TEXT_MODEL=gemma3
```

### 3. Start Both Frontend and Backend
Run concurrently from the root directory:
```powershell
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- **Health Diagnostics:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🤖 Running Open-Weight AI with Ollama

WildBuddy works out-of-the-box in **Demonstration Mode** if Ollama is not yet running. To activate real, 100% offline vision inference:

1. Download and install Ollama from [ollama.com](https://ollama.com).
2. Pull your chosen vision model:
   ```powershell
   ollama pull gemma3
   ```
   *(Or for lower VRAM devices, pull `moondream` or `llava`)*
3. Start the Ollama server:
   ```powershell
   ollama serve
   ```
4. Click **AI Runtime** in the WildBuddy header or settings to verify connection status!

---

## 📶 Testing Offline PWA Behavior

1. Open [http://localhost:5173](http://localhost:5173) in Google Chrome or Microsoft Edge.
2. Open Developer Tools (`F12`), navigate to the **Network** tab, and toggle the dropdown to **Offline**.
3. Notice that:
   - The top banner displays the **Offline Mode** indicator.
   - You can browse your saved Nature Journal and view all photos.
   - You can generate new outdoor adventures using the built-in deterministic mission engine.
   - You can complete tasks, check off items, and log outdoor minutes.
   - All state is persisted immediately in IndexedDB.

---

## 🧪 Running Automated Tests

Run the Vitest test suite covering streak math, achievement badges, and adventure engines:
```powershell
npm test
```

All 14 tests pass validating:
- Continuous streak calculation across calendar dates.
- Unlocking criteria for achievement badges based strictly on actual records.
- Deterministic task generation across durations and environmental niches.

---

## 🏆 Key Highlights for Hackathon Portfolio

1. **Anti-Addiction Design:** Prompts users into "Screen-Off Mode" so they keep their phone in their pocket while exploring.
2. **Zero Cloud Dependencies:** No reliance on paid OpenAI or Google cloud APIs; models run locally via Ollama.
3. **Data Sovereignty:** Photos and notes stay on the user's hard drive; exportable as JSON at any time.
4. **Resilient Offline Architecture:** PWA caching + browser IndexedDB + client deterministic mission generation.

---

## 📄 License
Released under the [MIT License](LICENSE).
Less scrolling. More exploring.
