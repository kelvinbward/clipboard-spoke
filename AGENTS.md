# 🧠 Project: clipboard-spoke

## 📋 Role
**Logic Spoke** in the kelvinbward federated ecosystem. A browser-native clipboard manager that provides persistent session history, fuzzy search, and secret scrubbing. Optionally extended by a Chrome/Firefox extension for system-level clipboard access.

- **Registry Entry**: `CLIPBOARD_SPOKE`
- **Port**: `5100` (reserved; not used by browser app)
- **Hosted at**: `https://kelvinbward.github.io/clipboard-spoke/`

## 🌳 Relationship: System Root
- **Root**: `../kelvinbward/AGENTS.md`
- **Downstream**: None (standalone utility)

## 🛠 Tech Stack
| Layer | Choice |
|---|---|
| Build | Vite 5 + React 18 + TypeScript |
| Styling | Tailwind CSS v3 (dark glassmorphism) |
| Search | fuse.js (client-side fuzzy) |
| Storage | `sessionStorage` only (clears on tab close) |
| Testing | Vitest (unit) + Playwright (E2E) |
| Extension | Manifest V3 (Chrome/Firefox) |
| Hosting | GitHub Pages (static) |

## 🛠 Local Development

```bash
# Setup (first time only)
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
npm install

# Dev server
npm run dev          # http://localhost:5173

# Tests
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright E2E

# Build
npm run build        # → dist/
```

## 🔒 Session Startup Protocol
Before any work, install the branch protection hook:
```bash
echo '#!/bin/sh
branch=$(git symbolic-ref HEAD | sed -e "s,.*/\(.*\),\1,")
if [ "$branch" = "main" ]; then
  echo "🚫 DIRECT PUSH TO MAIN IS BLOCKED. USE A PR."
  exit 1
fi' > .git/hooks/pre-push && chmod +x .git/hooks/pre-push
```

## 🌳 Git Branching & Workflow
1. **NEVER commit directly to `main`**. Use `feature/`, `fix/`, or `infra/` prefix branches.
2. CI checks must pass on all PRs.
3. Deploy to GitHub Pages triggers automatically on merge to `main`.

## 🧩 Browser Extension (Optional)
Located in `extension/`. Load unpacked in Chrome DevTools for local testing.
See `extension/README.md` for architecture and install steps.

## 🗺 V1 → V2 Roadmap
- **V1** (current): Text + link history, fuzzy search, `Ctrl+Shift+V` hotkey, secret scrubber
- **V2**: Configurable hotkey via SettingsPanel, image clipboard support, category tagging

## 🔄 Self-Documentation Protocol
After completing any task:
1. Update this file if commands, ports, or architecture change.
2. Update `../kelvinbward/AGENTS.md` if the federated registry changes.
