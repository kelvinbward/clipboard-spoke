<h1 align="center">
  📋 Clipboard Spoke
</h1>

<p align="center">
  A fast, private clipboard history manager that runs entirely in your browser tab.<br/>
  No server. No tracking. History clears when you close the tab.
</p>

<p align="center">
  <a href="https://github.com/kelvinbward/clipboard-spoke/actions/workflows/ci.yml">
    <img src="https://github.com/kelvinbward/clipboard-spoke/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://kelvinbward.github.io/clipboard-spoke/">
    <img src="https://img.shields.io/badge/live-GitHub%20Pages-7c6af7" alt="Live" />
  </a>
  <img src="https://img.shields.io/badge/version-0.1.0-white" alt="Version" />
</p>

---

## Features

| Feature | Details |
|---|---|
| 📝 **History** | Captures every copy event in your session (up to 200 items) |
| 🔍 **Fuzzy Search** | Instant search powered by fuse.js with 200ms debounce |
| 🔒 **Secret Scrubber** | Auto-detects and redacts AWS keys, GitHub PATs, private keys, bearer tokens |
| 🔗 **Link Detection** | URLs render as clickable anchors with a link badge |
| ⌨️ **Hotkey** | `Ctrl+Shift+V` (Windows/Linux) · `Cmd+Shift+V` (Mac) to focus search |
| 🧹 **Session Only** | History lives in `sessionStorage` — gone when you close the tab |
| 🧩 **Extension** | Optional browser extension for background capture across all tabs |

---

## Live App

**[clipboard-spoke.kelvinbward.io →](https://kelvinbward.github.io/clipboard-spoke/)**

---

## Architecture

This is a **Logic Spoke** in the kelvinbward federated ecosystem.

```
Browser Tab (primary — GitHub Pages)
├── sessionStorage      ← session-only, no persistence
├── copy event listener ← captures in-tab copies
├── visibilitychange    ← reads clipboard when tab re-focuses
└── message listener    ← receives items from extension

Browser Extension (optional — Manifest V3)
├── clipboardRead       ← monitors clipboard across all tabs
└── Ctrl/Cmd+Shift+V   ← global shortcut to open/focus tab
```

---

## Local Development

```bash
# 1. Clone
git clone git@github.com:kelvinbward/clipboard-spoke.git
cd clipboard-spoke

# 2. Install Node (if needed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
nvm install --lts

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
# → http://localhost:5173/clipboard-spoke/
```

## Testing

```bash
npm run test        # Vitest unit tests (14 tests)
npm run lint        # ESLint
npm run build       # Production build → dist/
```

---

## Secret Scrubber

Before any clipboard item is stored, it passes through the scrubber (`src/lib/scrubber.ts`). Matched items are flagged `isSensitive: true` and their content replaced with `[REDACTED — Sensitive Data Detected]`. Patterns checked:

- AWS Access Keys (`AKIA...`)
- GitHub PATs (`ghp_...`, `gho_...`, `ghs_...`)
- Private key blocks (`-----BEGIN * PRIVATE KEY-----`)
- Bearer tokens
- Generic secret env assignments (`SECRET=...`, `API_KEY=...`)
- Database connection strings

---

## Browser Extension (Optional)

The extension lives in `extension/` and enhances the web app without replacing it — the tab still works standalone.

**Install for development:**
1. Open Edge/Chrome → `edge://extensions` or `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension/` directory

See [`extension/README.md`](extension/README.md) for the full architecture.

---

## Deployment

On every merge to `main`, GitHub Actions builds the static app and deploys it to the `gh-pages` branch automatically.

To enable for the first time:  
**Settings → Pages → Source → `gh-pages` branch → `/root`**

---

## Federated Ecosystem

| Key | Value |
|---|---|
| Registry | `CLIPBOARD_SPOKE` |
| Port | `5100` (reserved) |
| Hub | `kelvinbward/` |
| Role | Logic Spoke |

See [`AGENTS.md`](AGENTS.md) for agent workflow and contributing guidelines.

---

## Roadmap

- **V1** ✅ Text + link history, fuzzy search, secret scrubber, session storage, hotkey
- **V2** Configurable hotkey, image clipboard support, category tagging
