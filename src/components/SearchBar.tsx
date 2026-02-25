import type { ChangeEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    resultCount: number;
    totalCount: number;
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') onChange('');
    };

    return (
        <div className="relative px-4 pb-3 pt-2">
            <div className="relative flex items-center">
                {/* Search icon */}
                <svg
                    className="absolute left-3 h-4 w-4 text-muted pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                    id="clipboard-search"
                    type="search"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKey}
                    placeholder="Search clipboard history…"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="
            w-full rounded-lg border border-border bg-raised py-2.5 pl-9 pr-4
            text-sm text-white placeholder-muted outline-none
            transition-all duration-150
            focus:border-accent focus:ring-2 focus:ring-accent/20
          "
                    aria-label="Search clipboard history"
                />

                {/* Clear button */}
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute right-3 text-muted hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Result count hint */}
            {value && (
                <p className="mt-1.5 px-1 text-xs text-muted animate-fade-in">
                    {resultCount === 0
                        ? 'No matches'
                        : `${resultCount} of ${totalCount} item${totalCount !== 1 ? 's' : ''}`}
                </p>
            )}
        </div>
    );
}
