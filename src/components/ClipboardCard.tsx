import { useState } from 'react';
import type { ClipboardItem } from '../types';

const PREVIEW_LENGTH = 120;

function formatRelativeTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    if (diff < 5000) return 'just now';
    if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
}

interface ClipboardCardProps {
    item: ClipboardItem;
    onDelete: (id: string) => void;
    onCopy: (content: string) => void;
}

export function ClipboardCard({ item, onDelete, onCopy }: ClipboardCardProps) {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);

    const displayContent =
        item.metadata.isSensitive && !revealed
            ? item.content
            : item.content.length > PREVIEW_LENGTH
                ? item.content.slice(0, PREVIEW_LENGTH) + '…'
                : item.content;

    const handleCopy = async () => {
        await onCopy(item.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <article
            className="
        group relative flex flex-col gap-2 rounded-xl border border-border bg-surface px-4 py-3
        transition-all duration-150 hover:border-accent/40 hover:bg-raised hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5
        animate-slide-up
      "
            aria-label={`Clipboard item from ${formatRelativeTime(item.timestamp)}`}
        >
            {/* Header: type badge + timestamp + actions */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    {item.metadata.isSensitive && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-700/40">
                            🔒 Sensitive
                        </span>
                    )}
                    {item.type === 'link' && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-400 border border-blue-700/40">
                            🔗 Link
                        </span>
                    )}
                    <time
                        className="text-xs text-muted flex-shrink-0"
                        dateTime={new Date(item.timestamp).toISOString()}
                    >
                        {formatRelativeTime(item.timestamp)}
                    </time>
                </div>

                {/* Action buttons — visible on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {/* Reveal toggle for sensitive items */}
                    {item.metadata.isSensitive && (
                        <button
                            onClick={() => setRevealed((r) => !r)}
                            className="rounded-md p-1.5 text-muted hover:text-white hover:bg-subtle transition-colors"
                            aria-label={revealed ? 'Hide content' : 'Reveal content'}
                            title={revealed ? 'Hide' : 'Reveal'}
                        >
                            {revealed ? (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Copy */}
                    <button
                        onClick={handleCopy}
                        disabled={item.metadata.isSensitive && !revealed}
                        className="rounded-md p-1.5 text-muted hover:text-white hover:bg-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Copy to clipboard"
                        title="Copy"
                    >
                        {copied ? (
                            <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-md p-1.5 text-muted hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        aria-label="Delete item"
                        title="Delete"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content preview */}
            <div className="min-w-0">
                {item.type === 'link' && !item.metadata.isSensitive ? (
                    <a
                        href={item.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                        {displayContent}
                    </a>
                ) : (
                    <p
                        className={`break-words text-sm leading-relaxed ${item.metadata.isSensitive ? 'font-mono text-amber-400/80 text-xs' : 'text-gray-200'
                            }`}
                    >
                        {displayContent}
                    </p>
                )}
            </div>
        </article>
    );
}
