import { useState } from 'react';

const STORAGE_KEY: string = "recentCalendarUrls"

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

        // Validera att det ser ut som en URL
        try {
            // Om den inte är en giltig URL kastas ett fel
            new URL(normalized);
        } catch {
            // Spara inte ogiltiga URL:er
            return;
        }

        setUrls((prev) => {
            const next = [normalized, ...prev.filter((u) => u !== normalized)].slice(0, 20);
            // Spara direkt så listan finns kvar även om effekten inte hunnit köras
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return {
        urls,
        addToRecentUrls
    };
}