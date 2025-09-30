import { useState } from 'react';

const STORAGE_KEY: string = "recentCalendarUrls"
const MAX_RECENT = 20;

function loadFromLocalStorage(): string[] {
    try {
        const isBrowser = typeof window !== "undefined" && "localStorage" in window;

        if (!isBrowser) return [];
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
        return [];
    }
}

export function useIcsUrls() {
    const [urls, setUrls] = useState<string[]>(() => loadFromLocalStorage());

    // Lägg till URL i "senaste länkar" och spara i localStorage
    const addToRecentUrls = (url: string) => {
        const normalized = (url || "").trim();
        if (!normalized) return;

        try {
            new URL(normalized);
        } catch {
            return;
        }

        setUrls((prev) => {
            const next = [normalized, ...prev.filter((u) => u !== normalized)].slice(0, MAX_RECENT);
            // Spara direkt så listan finns kvar även om effekten inte hunnit köras
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                return prev;
            }
            return next;
        });
    };

    return {
        urls,
        addToRecentUrls
    };
}