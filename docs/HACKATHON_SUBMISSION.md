# WildBuddy — Hackathon Submission Details

## 1. Problem Statement
Digital devices and modern software prioritize screen engagement, ad views, and continuous dopamine loops. People spend less time outdoors, leading to nature deficit, heightened stress, and disconnection from local biodiversity. When beginners do venture outside, they often lack the botanical knowledge to interpret what they see or don't know where to start exploring.

## 2. Solution: WildBuddy
WildBuddy is an **offline-first open-source AI nature companion** designed to minimize screen time and maximize outdoor discovery. It enables users to:
1. Identify natural specimens (leaves, flowers, plants, birds, insects) from photographs using local open-weight vision models.
2. Generate personalized outdoor exploration missions (15, 30, or 60 minutes) tailored to their local environment and mobility preferences.
3. Switch into a "Screen-Minimal Mode" that prompts users to lock their phone and explore the physical world.
4. Maintain a private digital Nature Journal stored in browser-native IndexedDB.
5. Track real outdoor minutes, continuous exploration streaks, and unlock earned achievement badges.

## 3. Open-Source AI Architecture
- **Model Runtime:** Ollama local daemon (`http://127.0.0.1:11434`).
- **Vision-Language Model:** Compatible with open-weight models including `gemma3`, `llava`, and `moondream`. The backend feeds base64 image data and prompts requesting structured JSON output with strict confidence, visible features, and safety notes.
- **Text Generation Model:** Open-weight LLMs (`gemma3`, `llama3.2`, `mistral`) for contextual challenge authoring.
- **Resilient Fallback Engine:** Built-in deterministic adventure generator ensuring 100% functionality even when Ollama is offline or not installed.
- **Diagnostic API:** `GET /api/health` continuously detects available models, reports connection status, and provides 1-click terminal setup commands.

## 4. Privacy & Data Sovereignty Benefits
- **Zero Cloud APIs:** No OpenAI, Google Cloud, or third-party paid AI endpoints required.
- **Zero Tracking:** No user registration, email, or database tracking.
- **Local Storage:** All photographs, observations, and notes reside in the user's browser sandbox via IndexedDB.
- **Optional Geodata:** Locations are strictly entered manually by the user—no persistent GPS tracking.

## 5. Limitations & Ethical Considerations
- **Non-Definitive Identification:** AI identifications are presented as educational suggestions with explicit confidence badges, never as certified botanical or culinary advice.
- **Safety Warnings:** The application explicitly warns users never to consume wild flora or fungi, touch stinging insects, or disturb active wildlife habitats.

## 6. What Was Validated Outdoors
- Rapid specimen photo capture on mobile screen ratios.
- Screen-minimal mission workflow tested with 15-minute garden walks.
- Full offline operation verified by disconnecting network connection and completing exploration checklists.
- Instant import/export backup functionality verified with JSON archives.

## 7. Future Horizons
- Offline acoustic bird-call spectrogram classification using local audio models.
- Native mobile packaging via Capacitor / React Native.
- Community-curated open nature scavenger hunt packs.
