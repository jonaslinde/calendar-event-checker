import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDisplayEvents } from '../hook';
import type { DisplayEvent } from '../types';

// Hjälpare för att snabbt skapa DisplayEvent med rimliga default-värden
function ev(partial: Partial<DisplayEvent> = {}): DisplayEvent {
    const now = new Date('2025-01-01T10:00:00Z');
    const summary = partial.summary ?? 'default';
    return {
        title: partial.title ?? summary,  // title defaults to summary
        summary: summary,
        description: 'descrition',
        location: 'location',
        start: now,
        end: new Date(now.getTime() + 60 * 60 * 1000),
        calendars: [{ name: 'calendar', color: '#000' }],
        status: 'ok',
        ...partial,
    };
}
describe('useDisplayEvents', () => {
    describe('initial state', () => {
        it('has no events by default', () => {
            const { result } = renderHook(() => useDisplayEvents());
            expect(result.current.displayEvents).toEqual([]);
        });
        it('does not merge by default', () => {
            const { result } = renderHook(() => useDisplayEvents());
            act(() => {
                result.current.setDisplayEvents([
                    ev({
                        summary: 'Match',
                        location: 'Arena',
                        start: new Date('2025-01-01T10:00:00Z'),
                        end: new Date('2025-01-01T11:00:00Z'),
                        calendars: [{ name: 'A', color: '#000' }],
                    }),
                    ev({
                        summary: 'Match',
                        location: 'Arena',
                        start: new Date('2025-01-01T10:00:00Z'),
                        end: new Date('2025-01-01T11:00:00Z'),
                        calendars: [{ name: 'B', color: '#111' }],
                    }),
                ]);
            });

            expect(result.current.displayEvents).toHaveLength(2);
            expect(result.current.mergeDuplicates).toBe(false);
        });
        it('shows all statuses by default', () => {
            const { result } = renderHook(() => useDisplayEvents());
            expect(result.current.show).toEqual([]);
        });
    });

    describe('Merge', () => {

        it('merges when set', () => {
            const { result } = renderHook(() => useDisplayEvents());

            act(() => {
                result.current.setDisplayEvents([
                    ev({
                        calendars: [{ name: 'A', color: '#000' }],
                    }),
                    ev({
                        calendars: [{ name: 'B', color: '#111' }],
                    }),
                ]);
                result.current.setMergeDuplicates(true)
            });

            // merged: 1 item med båda kalendrarna
            expect(result.current.displayEvents).toHaveLength(1);
            expect(result.current.displayEvents[0].calendars.map(c => c.name).sort()).toEqual(['A', 'B']);
        });
    });

    describe('Duplicates vs overlaps', () => {
        it('keeps duplicate status when events are identical', () => {
            const { result } = renderHook(() => useDisplayEvents());
            const t = new Date('2025-01-01T10:00:00Z');

            act(() => {
                result.current.setDisplayEvents([
                    ev({
                        summary: 'Match',
                        location: 'Arena',
                        start: t,
                        end: new Date(t.getTime() + 3600000),
                        calendars: [{ name: 'A', color: '#000' }],
                    }),
                    ev({
                        summary: 'Match',
                        location: 'Arena',
                        start: t,
                        end: new Date(t.getTime() + 3600000),
                        calendars: [{ name: 'B', color: '#111' }],
                    }),
                ]);
            });

            const statuses = result.current.displayEvents.map((event) => event.status);
            expect(statuses).toEqual(['duplicate', 'duplicate']);
        });
    });

});
