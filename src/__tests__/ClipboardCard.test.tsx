import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClipboardCard } from '../components/ClipboardCard';
import type { ClipboardItem } from '../types';

const makeItem = (overrides: Partial<ClipboardItem> = {}): ClipboardItem => ({
    id: 'test-id-1',
    content: 'Hello, clipboard!',
    type: 'text',
    timestamp: Date.now(),
    metadata: { isSensitive: false },
    ...overrides,
});

describe('ClipboardCard', () => {
    it('renders content for a normal item', () => {
        render(<ClipboardCard item={makeItem()} onDelete={vi.fn()} onCopy={vi.fn()} />);
        expect(screen.getByText('Hello, clipboard!')).toBeInTheDocument();
    });

    it('shows REDACTED content for sensitive items', () => {
        const item = makeItem({
            content: '[REDACTED — Sensitive Data Detected]',
            metadata: { isSensitive: true },
        });
        render(<ClipboardCard item={item} onDelete={vi.fn()} onCopy={vi.fn()} />);
        expect(screen.getByText('[REDACTED — Sensitive Data Detected]')).toBeInTheDocument();
        expect(screen.getAllByText(/Sensitive/).length).toBeGreaterThanOrEqual(1);
    });

    it('calls onDelete when delete button clicked', async () => {
        const onDelete = vi.fn();
        render(<ClipboardCard item={makeItem()} onDelete={onDelete} onCopy={vi.fn()} />);
        // Trigger hover to make buttons visible, then click delete
        const article = screen.getByRole('article');
        fireEvent.mouseEnter(article);
        const deleteBtn = screen.getByLabelText('Delete item');
        fireEvent.click(deleteBtn);
        expect(onDelete).toHaveBeenCalledWith('test-id-1');
    });

    it('calls onCopy when copy button clicked', async () => {
        const onCopy = vi.fn().mockResolvedValue(undefined);
        render(<ClipboardCard item={makeItem()} onDelete={vi.fn()} onCopy={onCopy} />);
        const article = screen.getByRole('article');
        fireEvent.mouseEnter(article);
        const copyBtn = screen.getByLabelText('Copy to clipboard');
        fireEvent.click(copyBtn);
        expect(onCopy).toHaveBeenCalledWith('Hello, clipboard!');
    });

    it('renders a link type item as an anchor', () => {
        const item = makeItem({ content: 'https://example.com', type: 'link' });
        render(<ClipboardCard item={item} onDelete={vi.fn()} onCopy={vi.fn()} />);
        expect(screen.getByRole('link', { name: /example\.com/ })).toBeInTheDocument();
    });
});
