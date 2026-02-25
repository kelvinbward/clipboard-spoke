/**
 * Content script injected into all pages.
 * Listens for copy events and relays clipboard text to the background worker,
 * which then forwards it to the Clipboard Spoke tab.
 */

document.addEventListener('copy', () => {
    // Small delay to allow the clipboard buffer to populate
    setTimeout(async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                chrome.runtime.sendMessage({ type: 'RELAY_CLIPBOARD', text });
            }
        } catch {
            // Clipboard access not available in this context
        }
    }, 50);
});

// Also receive forwarded items from the background and post to the Spoke web app
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'CLIPBOARD_SPOKE_NEW_ITEM') {
        window.postMessage(message, '*');
    }
});
