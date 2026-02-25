import { useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ClipboardHistory } from './components/ClipboardHistory';
import { useClipboardHistory } from './hooks/useClipboardHistory';
import { useFuzzySearch } from './hooks/useFuzzySearch';

const IS_MAC = navigator.platform.toUpperCase().includes('MAC');

export default function App() {
    const { history, deleteItem, clearAll, copyItem } = useClipboardHistory();
    const { query, setQuery, results } = useFuzzySearch(history);

    // Global hotkey: Ctrl+Shift+V (Win/Linux) or Cmd+Shift+V (Mac)
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const mod = IS_MAC ? e.metaKey : e.ctrlKey;
            if (mod && e.shiftKey && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                document.getElementById('clipboard-search')?.focus();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className="min-h-screen bg-base flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-xl flex flex-col gap-0 rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl" aria-hidden="true">📋</span>
                        <div className="min-w-0">
                            <h1 className="text-sm font-semibold text-white leading-tight">Clipboard Spoke</h1>
                            <p className="text-xs text-muted truncate">
                                {history.length === 0
                                    ? 'Session history'
                                    : `${history.length} item${history.length !== 1 ? 's' : ''} this session`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Hotkey hint */}
                        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-raised px-1.5 py-0.5 text-xs text-muted font-mono">
                            {IS_MAC ? '⌘' : 'Ctrl'}+Shift+V
                        </kbd>

                        {/* Clear all */}
                        {history.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="
                  rounded-lg border border-border bg-raised px-3 py-1.5 text-xs font-medium text-muted
                  hover:border-red-700/50 hover:bg-red-900/20 hover:text-red-400
                  transition-all duration-150
                "
                                aria-label="Clear all clipboard history"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </header>

                {/* Search */}
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    resultCount={results.length}
                    totalCount={history.length}
                />

                {/* History list */}
                <main className="flex-1 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                    <ClipboardHistory
                        items={results}
                        onDelete={deleteItem}
                        onCopy={copyItem}
                        isFiltered={query.length > 0}
                    />
                </main>

                {/* Footer */}
                <footer className="flex items-center justify-between border-t border-border px-4 py-2.5">
                    <p className="text-xs text-muted">
                        Session only — history clears on tab close
                    </p>
                    <a
                        href="https://github.com/kelvinbward/clipboard-spoke/releases"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
                        aria-label="Install browser extension"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Get extension
                    </a>
                </footer>
            </div>
        </div>
    );
}
