export function drizzleTextArray(input: unknown): string[] {
    if (Array.isArray(input)) {
        return input.map(String);
    }

    if (typeof input !== "string" || !input.trim()) {
        return [];
    }

    const value = input.trim();

    // JSON: '["a", "b"]'
    try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.map(String);
        }
    } catch {
        // Not JSON
    }

    // Single string
    return [value];
}
