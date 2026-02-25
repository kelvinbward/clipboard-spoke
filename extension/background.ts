/**
 * Clipboard Spoke - Browser Extension Background Service Worker
 *
 * Responsibilities:
 * 1. Open/focus the Clipboard Spoke web app tab on action click or shortcut
 * 2. Relay clipboard contents to the web app via tab messaging
 *
 * NOTE: Direct clipboard access from the background service worker requires
 * the 'clipboardRead' permission and a triggered user gesture (offscreen document
 * workaround may be needed in Chrome MV3). This is progressively enhanced.
 */

const SPOKE_URL = 'https://kelvinbward.github.io/clipboard-spoke/';

/** Find or open the Clipboard Spoke tab */
async function getOrOpenSpokeTab() {
    const tabs = await chrome.tabs.query({ url: SPOKE_URL + '*' });
    if (tabs.length > 0 && tabs[0].id !== undefined) {
        await chrome.tabs.update(tabs[0].id, { active: true });
        await chrome.windows.update(tabs[0].windowId!, { focused: true });
        return tabs[0];
    }
    return chrome.tabs.create({ url: SPOKE_URL });
}

/** Send clipboard text to the Spoke tab */
async function relayClipboardToSpoke(text: string) {
    const tabs = await chrome.tabs.query({ url: SPOKE_URL + '*' });
    for (const tab of tabs) {
        if (tab.id !== undefined) {
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    type: 'CLIPBOARD_SPOKE_NEW_ITEM',
                    text,
                });
            } catch {
                // Tab may not have content script loaded yet — ignore
            }
        }
    }
}

// Open/focus spoke tab on extension action click
chrome.action.onClicked.addListener(() => {
    getOrOpenSpokeTab();
});

// Relay clipboard content any time the popup fires (future: use offscreen doc)
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'RELAY_CLIPBOARD' && typeof message.text === 'string') {
        relayClipboardToSpoke(message.text as string);
    }
});
