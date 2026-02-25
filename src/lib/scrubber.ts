/**
 * Secret Scrubber — detects sensitive content before it enters session state.
 * Flagged items are stored with isSensitive=true and content replaced with [REDACTED].
 */

const SENSITIVE_PATTERNS: { name: string; pattern: RegExp }[] = [
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/ },
    { name: 'AWS Secret Key', pattern: /[A-Za-z0-9/+=]{40}/ },
    { name: 'GitHub PAT', pattern: /ghp_[a-zA-Z0-9]{36}/ },
    { name: 'GitHub OAuth', pattern: /gho_[a-zA-Z0-9]{36}/ },
    { name: 'GitHub App Token', pattern: /ghs_[a-zA-Z0-9]{36}/ },
    { name: 'Private Key Block', pattern: /-----BEGIN\s[\w\s]+PRIVATE KEY-----/ },
    { name: 'Generic Secret Env', pattern: /(secret|token|password|api[_-]?key)\s*[=:]\s*\S{8,}/i },
    { name: 'Bearer Token', pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/i },
    { name: 'Connection String', pattern: /(mongodb|postgres|mysql|redis):\/\/[^\s]+:[^\s]+@/ },
];

export interface ScrubResult {
    isSensitive: boolean;
    content: string;
    originalLength?: number;
    matchedRule?: string;
}

export function scrub(content: string): ScrubResult {
    for (const { name, pattern } of SENSITIVE_PATTERNS) {
        if (pattern.test(content)) {
            return {
                isSensitive: true,
                content: '[REDACTED — Sensitive Data Detected]',
                originalLength: content.length,
                matchedRule: name,
            };
        }
    }
    return { isSensitive: false, content };
}

export function isLikelyLink(text: string): boolean {
    try {
        const url = new URL(text.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}
