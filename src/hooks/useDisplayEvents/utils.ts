import type { DisplayEvent, DisplayEventStatus } from './types'

/** Locale-aware formatting helpers that accept Date or string */
export function formatDate(value: Date | string) {
    try {
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) return typeof value === 'string' ? value : '';
        return date.toLocaleDateString('sv-SE');
    } catch {
        return typeof value === 'string' ? value : '';
    }
}

export function formatTime(value: Date | string) {
    try {
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) return typeof value === 'string' ? value : '';
        return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return typeof value === 'string' ? value : '';
    }
}

/** Date predicates */
export const isValidDate = (date: Date, earliest: Date, latest: Date) => date > earliest && date < latest;
/** Monday–Friday */
export const isWeekday = (date: Date) => {
    const d = date.getDay(); // 0 = Sun, 6 = Sat
    return d >= 1 && d <= 5;
};
export const isWeekend = (date: Date) => {
    const d = date.getDay();
    return d === 0 || d === 6;
};

/** Same-day check (local time) */
export const isSameDay = (event1: DisplayEvent, event2: DisplayEvent) => {
    const a = event1.start;
    const b = event2.start;
    if (!(a instanceof Date) || !(b instanceof Date)) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
};

/** Overlap check (assumes sameDay already checked by caller if needed) */
export const isOverlapping = (event1: DisplayEvent, event2: DisplayEvent) => {
    try {
        const start1 = event1.start instanceof Date ? event1.start : new Date(event1.start);
        const end1 = event1.end instanceof Date ? event1.end : new Date(event1.end);
        const start2 = event2.start instanceof Date ? event2.start : new Date(event2.start);
        const end2 = event2.end instanceof Date ? event2.end : new Date(event2.end);

        if ([start1, end1, start2, end2].some(d => isNaN(d.getTime()))) return false;
        return start1 < end2 && start2 < end1;
    } catch {
        return false;
    }
};

/** Key for merging duplicates – stable across renders */
const normalize = (s: string) => s.trim().toLowerCase();
const eventKey = (e: DisplayEvent) => {
    const startKey = (e.start instanceof Date ? e.start.getTime() : new Date(e.start).getTime()).toString();
    const endKey = (e.end instanceof Date ? e.end.getTime() : new Date(e.end).getTime()).toString();
    return [
        startKey,
        endKey,
        normalize(e.summary || ''),
        normalize(e.location || '')
    ].join('|');
};

const mergeStatus = (left: DisplayEventStatus, right: DisplayEventStatus): DisplayEventStatus => {
    if (left === 'overlapping' || right === 'overlapping') return 'overlapping';
    if (left === 'sameDay' || right === 'sameDay') return 'sameDay';
    if (left === 'merged' || right === 'merged') return 'merged';
    if (left === 'duplicate' || right === 'duplicate') return 'merged';
    return left;
};

/** Mark duplicates by (start,end,summary,location) without merging */
export const markDuplicates = (events: DisplayEvent[]): DisplayEvent[] => {
    const counts = new Map<string, number>();
    for (const e of events) {
        const key = eventKey(e);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return events.map(e => {
        const key = eventKey(e);
        if ((counts.get(key) ?? 0) > 1 && e.status === 'ok') {
            return { ...e, status: 'duplicate' };
        }
        return e;
    });
};

/** Merge duplicates by (start,end,summary,location) and union calendar *names* */
export const mergeByKey = (events: DisplayEvent[]): DisplayEvent[] => {
    const map = new Map<string, DisplayEvent>();
    for (const e of events) {
        const key = eventKey(e);
        const existing = map.get(key);
        if (existing) {
            const existingNames = new Set(existing.calendars.map(c => c.name));
            for (const c of e.calendars) existingNames.add(c.name);
            const mergedCalendars = Array.from(existingNames).map(name => {
                // keep first color we saw for that name
                const found = [...existing.calendars, ...e.calendars].find(c => c.name === name);
                return found ?? { name, color: '#999' };
            });
            map.set(key, {
                ...existing,
                status: mergeStatus(existing.status, e.status),
                calendars: mergedCalendars
            });
        } else {
            map.set(key, e);
        }
    }
    return [...map.values()];
};

/** Generate all calendar days in [startDate, endDate] inclusive (local time) */
export const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const last = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    while (current <= last) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

/** Simple reducers for min/max by start */
export const getEarliestDate = (events: DisplayEvent[], latest: Date): Date =>
    events.map(e => e.start).reduce((prev, curr) => (curr < prev ? curr : prev), latest);

export const getLatestDate = (events: DisplayEvent[], earliest: Date): Date => {
    const early = events.map(e => e.end).reduce((prev, curr) => (curr > prev ? curr : prev), earliest);
    return endOfDay(early);
}

/** Weekend days within range */
export const getWeekendDays = (start: Date, end: Date): Date[] => {
    if (start.getTime() > end.getTime()) return [];
    const out: Date[] = [];
    for (const d of generateDateRange(start, end)) {
        if (isWeekend(d)) out.push(d);
    }
    return out;
};

/** Helpers for free-day calculation */
const toYMD = (d: Date) =>
    `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

/** Build set of busy local days covered by events (handles exclusive end at midnight) */
export const buildBusyDaySet = (events: DisplayEvent[]): Set<string> => {
    const busy = new Set<string>();
    for (const ev of events) {
        const s = ev.start instanceof Date ? ev.start : new Date(ev.start);
        let e = ev.end instanceof Date ? ev.end : new Date(ev.end);
        if ([s, e].some(d => isNaN(d.getTime()))) continue;

        // If end is exactly local midnight, back off 1 ms so last day is included
        const isMidnight =
            e.getHours() === 0 && e.getMinutes() === 0 && e.getSeconds() === 0 && e.getMilliseconds() === 0;
        if (isMidnight) e = new Date(e.getTime() - 1);

        let d = startOfDay(s);
        const last = startOfDay(e);
        while (d <= last) {
            busy.add(toYMD(d));
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        }
    }
    return busy;
};

/**
 * Compute free local days between min/max event dates (inclusive) and filter by weekday/weekend.
 * If both includeHolidays and includeWeekdays are false, returns [].
 */
export const getFreeDays = (
    events: DisplayEvent[],
    includeHolidays: boolean,
    includeWeekdays: boolean
): Date[] => {
    if (!includeHolidays && !includeWeekdays) return [];

    if (events.length === 0) return [];

    const minStart = events.reduce((min, e) => (e.start < min ? e.start : min), events[0].start);
    const maxEnd = events.reduce((max, e) => (e.end > max ? e.end : max), events[0].end);

    const busy = buildBusyDaySet(events);

    const free: Date[] = [];
    for (const d of generateDateRange(minStart, maxEnd)) {
        const ymd = toYMD(d);
        if (busy.has(ymd)) continue;
        if (includeWeekdays && isWeekday(d)) free.push(startOfDay(d));
        else if (includeHolidays && isWeekend(d)) free.push(startOfDay(d));
        else if (includeWeekdays && includeHolidays) free.push(startOfDay(d));
    }
    return free;
};

// TODO #1 & #4: Wire up conflict detection and fix event status assignment - This function exists and is now called in App.tsx
export function setEventStatuses(events: DisplayEvent[]): DisplayEvent[] {
    // Preserve existing statuses (e.g., duplicate/merged) and only set if currently ok.
    const updated = events.map(ev => ({ ...ev, status: ev.status ?? 'ok' as DisplayEventStatus }));

    // 2) Compare pairs only within the same calendar day for speed (optional micro-opt)
    for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i];
            const b = updated[j];

            if (isOverlapping(a, b)) {
                if (updated[i].status === 'ok') updated[i].status = 'overlapping';
                if (updated[j].status === 'ok') updated[j].status = 'overlapping';
            } else if (isSameDay(a, b)) {
                if (updated[i].status === 'ok') updated[i].status = 'sameDay';
                if (updated[j].status === 'ok') updated[j].status = 'sameDay';
            }
        }
    }
    return updated;
}
