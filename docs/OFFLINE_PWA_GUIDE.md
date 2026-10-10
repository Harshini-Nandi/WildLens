# Testing Offline PWA Functionality in WildBuddy

WildBuddy is engineered as a **Progressive Web App (PWA)** backed by **browser-native IndexedDB**.

---

## 1. How Offline Support Works

1. **Service Worker (`sw.js`)**:
   Built with Vite PWA and Google Workbox. Caches the application shell (HTML, JS chunks, CSS, fonts, icons, hero illustrations).
2. **IndexedDB (`wildbuddy_db`)**:
   Stores all observations, base64 specimen photos, custom field notes, completed missions, streaks, achievements, and user preferences locally on the user's hard drive.
3. **Deterministic Mission Fallback**:
   When internet or Ollama backend is unreachable, the client-side deterministic mission engine generates outdoor adventures with zero network latency.

---

## 2. Step-by-Step Offline Testing Instructions

### In Google Chrome / Microsoft Edge DevTools:
1. Start WildBuddy:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:5173` in Chrome or Edge.
3. Open **Developer Tools** (`F12` or `Ctrl + Shift + I`).
4. Switch to the **Application** tab:
   - Check **Service Workers**: Verify that the service worker is `Activated and is running`.
   - Check **Storage -> IndexedDB -> wildbuddy_db**: Verify that object stores (`observations`, `adventures`, `dailyActivity`, `settings`) are created.
5. Switch to the **Network** tab:
   - Change the throttling dropdown from **No throttling** to **Offline**.
6. Observe WildBuddy's UI:
   - Notice the top **Offline Mode** pill appears automatically.
7. Test the following offline operations:
   - **Navigate between pages**: Click Dashboard, Missions, Journal, Badges, and Settings. All pages load instantly without network requests.
   - **Generate an outdoor adventure**: Select 15 minutes, Park, Birds, and click **Generate**. The offline deterministic engine instantly produces a multi-task mission checklist!
   - **Complete tasks & finish adventure**: Check off tasks, click **Finish Adventure**. Confetti triggers and outdoor minutes are logged into IndexedDB.
   - **View Nature Journal**: All previously stored observations and photographs display without missing image links.
   - **Refresh the page (`F5`)**: The app reloads cleanly from the Service Worker cache with zero network connection!

---

## 3. Installing as a Standalone Desktop / Mobile App

- **Desktop (Chrome/Edge):** Click the **Install WildBuddy** icon in the browser address bar. The app launches in its own native window without browser address bars or navigation clutter.
- **Mobile (Android Chrome):** Tap the triple-dot menu -> **Install app** or **Add to Home screen**.
- **Mobile (iOS Safari):** Tap Share -> **Add to Home Screen**.
