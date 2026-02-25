# Clipboard Spoke Extension

This directory contains the optional browser extension that enhances the Clipboard Spoke web app.

## What it does

- **Global shortcut** (`Ctrl+Shift+V` / `Cmd+Shift+V`): Opens/focuses the Clipboard Spoke tab from any page.
- **Background capture**: Monitors clipboard activity across all tabs and relays items to the web app, even when the Clipboard Spoke tab is not in focus.

## Architecture

```
Content Script (all pages)
    ↓ copy event → navigator.clipboard.readText()
    ↓ chrome.runtime.sendMessage({ type: 'RELAY_CLIPBOARD', text })
Background Service Worker
    ↓ chrome.tabs.sendMessage() to Clipboard Spoke tab
Clipboard Spoke Tab (web app)
    ↓ window.addEventListener('message') → useClipboardHistory hook
```

## Installation (Development)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select this `extension/` directory

## Build (Production)

> TODO: Add a small `esbuild` or `rollup` config to compile `background.ts` and `content.ts` to browser-compatible JS.

## Permissions

| Permission | Reason |
|---|---|
| `clipboardRead` | Read clipboard text from content scripts |
| `tabs` | Find/open the Clipboard Spoke tab |
| `storage` | Future: persist user preferences |
