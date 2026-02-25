import { useEffect, useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { scrub, isLikelyLink } from '../lib/scrubber';
import type { ClipboardItem } from '../types';

const SESSION_KEY = 'clipboard-spoke-history';
const MAX_HISTORY = 200;

function loadFromSession(): ClipboardItem[] {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as ClipboardItem[]) : [];
    } catch {
        return [];
    }
}

function saveToSession(items: ClipboardItem[]): void {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
    } catch {
        // sessionStorage quota exceeded — trim and retry
        const trimmed = items.slice(0, Math.floor(MAX_HISTORY / 2));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(trimmed));
    }
}

export function useClipboardHistory() {
    const [history, setHistory] = useState<ClipboardItem[]>(loadFromSession);
    const lastSeen = useRef<string>('');

    const addItem = useCallback((text: string) => {
        const trimmed = text.trim();
        if (!trimmed || trimmed === lastSeen.current) return;
        lastSeen.current = trimmed;

        const { isSensitive, content, originalLength } = scrub(trimmed);
        const type = !isSensitive && isLikelyLink(trimmed) ? 'link' : 'text';

        const item: ClipboardItem = {
            id: uuidv4(),
            content,
            type,
            timestamp: Date.now(),
            metadata: { isSensitive, ...(originalLength ? { originalLength } : {}) },
        };

        setHistory((prev) => {
            const next = [item, ...prev].slice(0, MAX_HISTORY);
            saveToSession(next);
            return next;
        });
    }, []);

    // Listen for copy events fired within the page
    useEffect(() => {
        const handleCopy = () => {
            // Small delay so the clipboard is populated before we read it
            setTimeout(async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    addItem(text);
                } catch {
                    // Clipboard access denied — fall back to selection text
                    const selected = window.getSelection()?.toString() ?? '';
                    if (selected) addItem(selected);
                }
            }, 50);
        };

        document.addEventListener('copy', handleCopy);
        return () => document.removeEventListener('copy', handleCopy);
    }, [addItem]);

    // Poll clipboard on visibility change (tab regains focus)
    useEffect(() => {
        const handleVisibility = async () => {
            if (document.visibilityState !== 'visible') return;
            try {
                const text = await navigator.clipboard.readText();
                addItem(text);
            } catch {
                // Permission not granted — extension will handle this
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [addItem]);

    // Listen for messages from the optional browser extension
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.source !== window) return;
            if (event.data?.type === 'CLIPBOARD_SPOKE_NEW_ITEM' && typeof event.data.text === 'string') {
                addItem(event.data.text as string);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [addItem]);

    const deleteItem = useCallback((id: string) => {
        setHistory((prev) => {
            const next = prev.filter((item) => item.id !== id);
            saveToSession(next);
            return next;
        });
    }, []);

    const clearAll = useCallback(() => {
        setHistory([]);
        sessionStorage.removeItem(SESSION_KEY);
        lastSeen.current = '';
    }, []);

    const copyItem = useCallback(async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }, []);

    return { history, deleteItem, clearAll, copyItem };
}
