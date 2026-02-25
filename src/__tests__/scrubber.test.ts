import { describe, it, expect } from 'vitest';
import { scrub } from '../lib/scrubber';

describe('Secret Scrubber', () => {
    it('passes clean text through unchanged', () => {
        const result = scrub('Hello, world!');
        expect(result.isSensitive).toBe(false);
        expect(result.content).toBe('Hello, world!');
    });

    it('flags AWS Access Keys', () => {
        const result = scrub('My key is AKIAIOSFODNN7EXAMPLE here');
        expect(result.isSensitive).toBe(true);
        expect(result.content).toBe('[REDACTED — Sensitive Data Detected]');
    });

    it('flags GitHub Personal Access Tokens', () => {
        const result = scrub('ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890');
        expect(result.isSensitive).toBe(true);
        expect(result.content).toBe('[REDACTED — Sensitive Data Detected]');
    });

    it('flags Private Key blocks', () => {
        const result = scrub('-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAK...\n-----END RSA PRIVATE KEY-----');
        expect(result.isSensitive).toBe(true);
    });

    it('flags generic secret env assignments', () => {
        const result = scrub('API_SECRET=supersecretvalue123');
        expect(result.isSensitive).toBe(true);
    });

    it('flags Bearer tokens', () => {
        const result = scrub('Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
        expect(result.isSensitive).toBe(true);
    });

    it('records original length for sensitive items', () => {
        const text = 'AKIAIOSFODNN7EXAMPLE';
        const result = scrub(text);
        expect(result.originalLength).toBe(text.length);
    });

    it('passes plain URLs through', () => {
        const result = scrub('https://example.com/blog/post-1');
        expect(result.isSensitive).toBe(false);
    });

    it('passes regular code snippets through', () => {
        const result = scrub('const x = async () => { return 42; };');
        expect(result.isSensitive).toBe(false);
    });
});
