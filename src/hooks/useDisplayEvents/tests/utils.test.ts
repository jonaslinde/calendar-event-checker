import { describe, it, expect } from 'vitest';

import { generateDateRange } from "./../utils";

describe("generateDateRange", () => {
    it("handles start after end", () => {
        //Start is after end!
        const start = new Date('2025-01-11');
        const end = new Date("2025-01-01");
        const range = generateDateRange(start, end);
        expect(range.length).toBe(0);
    })
    it("handles ends 1 day after start", () => {
        //Start is after end!
        const start = new Date('2025-01-01');
        const end = new Date("2025-01-02");
        const range = generateDateRange(start, end);
        expect(range.length).toBe(2);
    })
    it("handles ends on same date as start", () => {
        //Start is after end!
        const start = new Date('2025-01-01');
        const end = new Date("2025-01-01");
        const range = generateDateRange(start, end);
        expect(range.length).toBe(1);
    })
    it("generates an array with 8 dates (2..9)", () => {
        const start = new Date('2025-01-01');
        const end = new Date("2025-01-10");
        const range = generateDateRange(start, end);
        expect(range.length).toBe(10);
    })
})

// describe("getEarliestStart", () => {
//     const latest = new Date('2030-01-01')
//     function ev(partial: Partial<DisplayEvent> = {}): DisplayEvent {
//         const now = new Date('2025-01-01T10:00:00Z');
//         return {
//             summary: '',
//             description: '',
//             location: '',
//             start: now,
//             end: new Date(now.getTime() + 60 * 60 * 1000),
//             calendars: [],
//             type: 'event',
//             status: 'ok',
//             ...partial,
//         };
//     }
//     it("handles no events", () => {
//         expect(getEarliestDate([], latest)).toStrictEqual(latest)
//     })
//     it("handles 1 event", () => {
//         const events: DisplayEvent[] = [
//             ev({ start: new Date('2025-01-01') })
//         ]
//         expect(getEarliestDate(events, latest)).toStrictEqual(new Date('2025-01-01'))
//     })
//     it("handles 2 event", () => {
//         const events: DisplayEvent[] = [
//             ev({ start: new Date('2025-01-02') }),
//             ev({ start: new Date('2025-01-01') }),
//         ]
//         expect(getEarliestDate(events, latest)).toStrictEqual(new Date('2025-01-01'))
//     })
//     it("handles 10 event - random order", () => {
//         const events: DisplayEvent[] = [
//             ev({ start: new Date('2025-04-02') }),
//             ev({ start: new Date('2025-02-02') }),
//             ev({ start: new Date('2025-03-01') }),
//             ev({ start: new Date('2025-06-02') }),
//             ev({ start: new Date('2025-01-01') }),
//             ev({ start: new Date('2025-08-02') }),
//             ev({ start: new Date('2025-01-02') }),
//             ev({ start: new Date('2025-09-01') }),
//             ev({ start: new Date('2025-05-01') }),
//             ev({ start: new Date('2025-07-01') }),
//         ]
//         expect(getEarliestDate(events, latest)).toStrictEqual(new Date('2025-01-01'))
//     })
// })

// describe("getLatestStart", () => {
//     const earliest = new Date('2020-01-01');

//     function ev(partial: Partial<DisplayEvent> = {}): DisplayEvent {
//         const now = new Date('2025-01-01T10:00:00Z');
//         return {
//             summary: '',
//             description: '',
//             location: '',
//             start: now,
//             end: new Date(now.getTime() + 60 * 60 * 1000),
//             calendars: [],
//             type: 'event',
//             status: 'ok',
//             ...partial,
//         };
//     }
//     it("handles no events", () => {
//         expect(getLatestDate([], earliest)).toStrictEqual(earliest)
//     })
//     it("handles 1 event", () => {
//         const events: DisplayEvent[] = [
//             ev({ start: new Date('2025-01-01T11:00:00.000Z'), end: new Date('2025-01-01T13:00:00.000Z') })
//         ]
//         expect(getLatestDate(events, earliest)).toStrictEqual(new Date('2025-01-01'))
//     })
//     it("handles 2 event", () => {
//         const events: DisplayEvent[] = [
//             ev({ start: new Date('2025-01-02') }),
//             ev({ start: new Date('2025-01-01') }),
//         ]
//         expect(getLatestDate(events, earliest)).toStrictEqual(new Date('2025-01-02'))
//     })
//     it("handles 10 event - random order", () => {
//         const events: DisplayEvent[] = [
//             ev({ start: new Date('2025-01-02') }),
//             ev({ start: new Date('2025-04-02') }),
//             ev({ start: new Date('2025-02-02') }),
//             ev({ start: new Date('2025-03-01') }),
//             ev({ start: new Date('2025-06-02') }),
//             ev({ start: new Date('2025-01-01') }),
//             ev({ start: new Date('2025-08-02') }),
//             ev({ start: new Date('2025-09-01') }),
//             ev({ start: new Date('2025-05-01') }),
//             ev({ start: new Date('2025-07-01') }),
//         ]
//         expect(getLatestDate(events, earliest)).toStrictEqual(new Date('2025-09-01'))
//     })
// })
