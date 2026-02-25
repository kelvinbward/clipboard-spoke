import { ClipboardCard } from './ClipboardCard';
import type { ClipboardItem } from '../types';

interface ClipboardHistoryProps {
    items: ClipboardItem[];
    onDelete: (id: string) => void;
    onCopy: (content: string) => void;
    isFiltered: boolean;
}

export function ClipboardHistory({ items, onDelete, onCopy, isFiltered }: ClipboardHistoryProps) {
    if (items.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center animate-fade-in">
                {isFiltered ? (
                    <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-3xl">
                            🔍
                        </div>
                        <div>
                            <p className="font-medium text-white">No matches found</p>
                            <p className="mt-1 text-sm text-muted">Try a different search term</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-3xl">
                            📋
                        </div>
                        <div>
                            <p className="font-medium text-white">Your clipboard history is empty</p>
                            <p className="mt-1 text-sm text-muted">
                                Copy anything in this tab and it'll appear here
                            </p>
                            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-raised px-3 py-1 text-xs text-muted">
                                <span>Install the extension for full background capture</span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-2 px-4 pb-4" role="list" aria-label="Clipboard history">
            {items.map((item) => (
                <li key={item.id}>
                    <ClipboardCard item={item} onDelete={onDelete} onCopy={onCopy} />
                </li>
            ))}
        </ul>
    );
}
