# AVideo-React-Sample 🎬⚛️

**AVideo-React-Sample** is a modern, production-style **React frontend** for [AVideo](https://github.com/WWBN/AVideo), the open-source video platform. It's built as a reference implementation showing how to build a fully custom UI on top of AVideo's REST API — from video browsing and playback to authentication, favorites, and playlists — using a current, real-world frontend stack (React 19, Vite, Tailwind CSS 4).

👉 **Live Demo:** [https://react.tutorials.avideo.com/](https://react.tutorials.avideo.com/)

<img width="850" height="421" alt="chrome-capture-2026-08-18 (1)" src="https://github.com/user-attachments/assets/b15bc86a-61e3-4eb5-882d-56c02e82c03d" />

## 🌟 Features

**Browsing & Playback**
- Category-based video browsing with an animated, scrollable pill filter bar
- Full-text video search (top bar), mutually exclusive with category filtering, with its own empty/error state
- Netflix-style hero banner spotlighting a featured video
- "Continue Watching" shelf, derived from each video's real watch-progress data (logged-in users only)
- Trending/Popular/Live/Suggested sections render as horizontal scrolling carousels; other sections use a responsive grid
- Live badge and watch-progress bar overlaid on video cards
- Responsive video grid with skeleton loading states, scroll-reveal animations, and `prefers-reduced-motion` support
- Click the logo at any time to return to the home feed, clearing any active search or category filter
- Custom video player overlay (fullscreen, mini/PiP mode, close button) built around AVideo's embeddable player, with embed parameters tuned to hide AVideo's own branding/info/close UI so it behaves like a native player inside the app
- Video detail stats: views, duration, tags, category

**User Interaction**
- Email/password authentication (login, sign up with CAPTCHA) against the AVideo API
- Like / Dislike voting
- Favorites (add/remove, persisted per-user)
- **Playlists** — create/delete playlists, add or remove videos from them, browse a playlist's contents, and play it back-to-back with Next/Previous queue navigation
- Threaded comments per video
- Dark mode with persisted preference

**Engineering**
- Toast notifications (success/error) for all async actions instead of `alert()`
- Accessible, tooltip-driven icon buttons (Radix UI)
- Dev-server proxy to the AVideo backend to avoid CORS issues locally (see `vite.config.js`)
- Sanitized rendering of backend-provided rich text/HTML (DOMPurify) to prevent XSS

---

## 📌 Getting Started

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/WWBN/AVideo-React-Sample.git
cd AVideo-React-Sample
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Configure Your AVideo Instance URL**
To point the app at your own AVideo instance, create a `.env` file in the project root:

```sh
touch .env
```

Then add the following line, replacing it with **your AVideo URL**:

```
VITE_BASE_URL=https://your-avideo-instance.com/
```

> In development, API calls are routed through the Vite dev server proxy (configured in `vite.config.js`) so the browser only ever talks to `localhost`, avoiding CORS issues with the AVideo backend. In production builds, `VITE_BASE_URL` is used directly.

---

### 4️⃣ **Run the Development Server**
```sh
npm run dev
```
Your React-based AVideo frontend will now be available at:
👉 **`http://localhost:5173`**

### 5️⃣ **Build for Production**
```sh
npm run build
npm run preview   # optional: preview the production build locally
```

---

## 🛠 Tech Stack
- **React 19** ⚛️ — UI framework
- **Vite 6** ⚡ — dev server & build tool (`@vitejs/plugin-react-swc`)
- **Tailwind CSS 4** 🎨 — utility-first styling, including full dark mode support
- **Framer Motion** 🎞️ — animated category pills, scroll-reveal, hero banner transitions
- **Radix UI** (`react-tooltip`, `react-popover`, `react-aspect-ratio`) — accessible, unstyled primitives for tooltips, the playlist dropdown, and thumbnail sizing
- **react-hot-toast** 🔔 — non-blocking success/error notifications
- **react-icons** — icon set (Font Awesome)
- **DOMPurify** 🛡️ — sanitizes rich-text HTML returned by the AVideo API before rendering
- **ESLint 10** (flat config, `eslint-plugin-react-hooks`) — linting, including strict Rules of Hooks enforcement
- **Fetch API** 📡 — all AVideo API requests (see `src/config/api.jsx`)
- **LocalStorage** 💾 — stores the authenticated user's session token

---

## 🔌 API Integration
This project talks directly to the **AVideo REST API** — see `src/config/api.jsx` for the full set of calls (video listing/search, categories, auth, favorites, likes/dislikes, comments, and the Playlist/"Programs" endpoints).

### Example API Call (Login)
```js
const response = await fetch(`${BASE_URL}get.json.php?APIName=signIn`, {
    method: "POST",
    body: JSON.stringify({ user: "admin", pass: "1234" }),
    headers: { "Content-Type": "application/json" },
});
const data = await response.json();
```

> **💡 Note:** `BASE_URL` (from `src/config/config.jsx`) resolves to the dev-server proxy path while running locally, and to `import.meta.env.VITE_BASE_URL` in production builds.

---

## 📡 Expanding API Support
Looking to extend the sample with **more AVideo API functionality**? AVideo exposes endpoints for:
✅ **User management** (register, profile, subscriptions)
✅ **Live streaming** (start/stop live streams, WebRTC integration)
✅ **Monetization** (Pay-Per-View, ads, memberships)
✅ **Analytics & Reports** (video views, user engagement)

Check out the **official AVideo API documentation** for the full list of available endpoints:
📖 **[AVideo API Wiki](https://github.com/WWBN/AVideo/wiki/AVideo-Platform-API)**
📖 **[Video Embed URL Parameters](https://github.com/WWBN/AVideo/wiki/Video-Embed-URL-for-AVideo)**

---

## 🔗 Useful Links
- 📌 **AVideo GitHub:** [https://github.com/WWBN/AVideo](https://github.com/WWBN/AVideo)
- 📖 **Documentation:** [https://github.com/WWBN/AVideo/wiki](https://github.com/WWBN/AVideo/wiki)

---

## 📜 License
This project is **open-source** and follows the **MIT License**.

---

## 🤝 Contributing
Contributions are welcome! Feel free to submit pull requests or open issues.

👨‍💻 **Developed by:** [Daniel Neto](https://github.com/DanielnetoDotCom)
```
