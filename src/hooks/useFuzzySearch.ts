import { useState, useMemo, useCallback, useRef } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import type { ClipboardItem } from '../types';

const FUSE_OPTIONS: IFuseOptions<ClipboardItem> = {
    keys: ['content'],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 1,
};

export function useFuzzySearch(items: ClipboardItem[]) {
    const [query, setQuery] = useState('');
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => setDebouncedQuery(value), 200);
    }, []);

    const fuse = useMemo(() => new Fuse(items, FUSE_OPTIONS), [items]);

    const results = useMemo(() => {
        if (!debouncedQuery.trim()) return items;
        return fuse.search(debouncedQuery).map((r) => r.item);
    }, [fuse, items, debouncedQuery]);

    return { query, setQuery: handleQueryChange, results };
}
