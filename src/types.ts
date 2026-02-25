export type ClipboardItemType = 'text' | 'link';

export interface ClipboardItem {
    id: string;
    content: string;
    type: ClipboardItemType;
    timestamp: number;
    metadata: {
        isSensitive: boolean;
        originalLength?: number;
    };
}

export interface SearchResult {
    item: ClipboardItem;
    score?: number;
}
