import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useDisplayEvents } from '../hook';
import type { DisplayEvent } from '../types';

// Hjälpare för att snabbt skapa DisplayEvent med rimliga default-värden
function ev(partial: Partial<DisplayEvent> = {}): DisplayEvent {
    const now = new Date('2025-01-01T10:00:00Z');
    const summary = partial.summary ?? '';
    return {
        title: partial.title ?? summary,  // title defaults to summary
        summary: summary,
        description: '',
        location: '',
        start: now,
        end: new Date(now.getTime() + 60 * 60 * 1000),
        calendars: [],
        type: 'event',
        status: 'ok',
        ...partial,
    };
}
describe('useDisplayEvents', () => {
    describe('Sort', () => {
        beforeEach(() => {
            // inget persistent mellan testfallen
        });

        it('sorterar på start (default) asc (default) & desc', () => {
            const { result } = renderHook(() => useDisplayEvents());
            const t0 = new Date('2025-01-01T10:00:00Z');
            const t1 = new Date('2025-01-01T12:00:00Z');

            act(() => {
                result.current.setDisplayEvents([
                    ev({ summary: 'B', start: t1, end: new Date(t1.getTime() + 3600000) }),
                    ev({ summary: 'A', start: t0, end: new Date(t0.getTime() + 3600000) }),
                ]);
            });

            // default sortField = 'start', order = 'asc'
            expect(result.current.displayEvents[0].summary).toBe('A');

            act(() => {
                result.current.setSortOrder('desc');
            });
            expect(result.current.displayEvents[0].summary).toBe('B');
        });

        it('sorterar på end asc & desc', () => {
            const { result } = renderHook(() => useDisplayEvents());
            const t0 = new Date('2025-01-01T10:00:00Z');
            const t1 = new Date('2025-01-01T12:00:00Z');

            act(() => {
                result.current.setDisplayEvents([
                    ev({ summary: 'B', start: t1, end: new Date(t1.getTime() + 3600000) }),
                    ev({ summary: 'A', start: t0, end: new Date(t0.getTime() + 3600000) }),
                ]);
                result.current.setSortField('end');
            });

            expect(result.current.displayEvents[0].summary).toBe('A');

            act(() => {
                result.current.setSortOrder('desc');
            });
            expect(result.current.displayEvents[0].summary).toBe('B');
        });

        it('sorterar på location asc & desc', () => {
            const { result } = renderHook(() => useDisplayEvents());

            act(() => {
                result.current.setDisplayEvents([
                    ev({ summary: 'B', location: 'B hallen' }),
                    ev({ summary: 'A', location: 'A hallen' }),
                ]);
                result.current.setSortField('location');
            });

            expect(result.current.displayEvents[0].summary).toBe('A');

            act(() => {
                result.current.setSortOrder('desc');
            });
            expect(result.current.displayEvents[0].summary).toBe('B');
        });

        it('sorterar på summary asc & desc', () => {
            const { result } = renderHook(() => useDisplayEvents());

            act(() => {
                result.current.setDisplayEvents([
                    ev({ summary: 'Match B' }),
                    ev({ summary: 'Match A' }),
                ]);
                result.current.setSortField('summary');
            });

            expect(result.current.displayEvents[0].summary).toBe('Match A');

            act(() => {
                result.current.setSortOrder('desc');
            });
            expect(result.current.displayEvents[0].summary).toBe('Match B');
        });
    });

    describe('Merge', () => {
        it('does not merge as default', () => {
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

            // merged: 1 item med båda kalendrarna
            expect(result.current.displayEvents).toHaveLength(2);
        });

        it('merges when set', () => {
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
                result.current.setMerge(true)
            });

            // merged: 1 item med båda kalendrarna
            expect(result.current.displayEvents).toHaveLength(1);
            expect(result.current.displayEvents[0].calendars.map(c => c.name).sort()).toEqual(['A', 'B']);
        });
    });

    // describe('Include Free Weekdays', () => {
    //     it('handles no events', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.length).toBe(0);
    //     });
    //     it('handles 1 event on a weekday', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(0);
    //         expect(result.current.displayEvents.length).toBe(1);
    //     });
    //     it('handles wed to thu', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-02T10:00:00Z'), end: new Date('2025-01-02T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(0);
    //         expect(result.current.displayEvents.length).toBe(2);
    //     });
    //     it('handles wed to fri - 1 free day', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-03T10:00:00Z'), end: new Date('2025-01-03T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(1);
    //         expect(result.current.displayEvents.length).toBe(3); // 2 events + 1 free day
    //     });
    //     it('set free day to start and end at 00:00', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-01T10:00:00'), end: new Date('2025-01-01T11:00:00') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-03T10:00:00'), end: new Date('2025-01-03T11:00:00') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(1);
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day')[0].start.getHours()).toBe(0);
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day')[0].start.getMinutes()).toBe(0);
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day')[0].end.getHours()).toBe(0);
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day')[0].end.getMinutes()).toBe(0);

    //     });
    //     it('handles mon to thu - 2 free days', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-06T10:00:00Z'), end: new Date('2025-06-01T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-09T10:00:00Z'), end: new Date('2025-01-0911:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(2);
    //         expect(result.current.displayEvents.length).toBe(4);
    //     });
    //     it('handles mon to fri - 3 free days', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-06T10:00:00Z'), end: new Date('2025-06-01T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-10T10:00:00Z'), end: new Date('2025-01-1011:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(3);
    //         expect(result.current.displayEvents.length).toBe(5);
    //     });
    //     it('handles mon to sat - 3 free days', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-06T10:00:00Z'), end: new Date('2025-06-01T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-11T10:00:00Z'), end: new Date('2025-01-11T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(4);
    //         expect(result.current.displayEvents.length).toBe(6);
    //     });
    //     it('handles mon to sat - 3 free days', () => {
    //         const { result } = renderHook(() => useDisplayEvents());
    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-06T10:00:00Z'), end: new Date('2025-06-01T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-12T10:00:00Z'), end: new Date('2025-01-12T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeWeekdays(true);
    //         });
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(4);
    //         expect(result.current.displayEvents.length).toBe(6);
    //     });
    // });
    // describe('Include Free Holidays', () => {
    //     it('handles fri to sun - 1 free holiday', () => {
    //         const { result } = renderHook(() => useDisplayEvents());

    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-03T10:00:00Z'), end: new Date('2025-01-03T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-05T10:00:00Z'), end: new Date('2025-01-05T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeHolidays(true);
    //         });
    //         expect(result.current.displayEvents.length).toBe(3);
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(1);
    //     });
    //     it('handles fri to mon - 2 free holidays', () => {
    //         const { result } = renderHook(() => useDisplayEvents());

    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-03T10:00:00Z'), end: new Date('2025-01-03T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-06T10:00:00Z'), end: new Date('2025-01-06T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeHolidays(true);
    //         });
    //         console.log(result.current.displayEvents)
    //         expect(result.current.displayEvents.length).toBe(4);
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(2);
    //     });
    //     it('handles mon to mon - 2 free holidays', () => {
    //         const { result } = renderHook(() => useDisplayEvents());

    //         act(() => {
    //             result.current.setDisplayEvents([
    //                 ev({ summary: 'E1', start: new Date('2025-01-13T10:00:00Z'), end: new Date('2025-01-13T11:00:00Z') }),
    //                 ev({ summary: 'E2', start: new Date('2025-01-06T10:00:00Z'), end: new Date('2025-01-06T11:00:00Z') }),
    //             ]);
    //             result.current.setIncludeFreeHolidays(true);
    //         });
    //         expect(result.current.displayEvents.length).toBe(8);
    //         expect(result.current.displayEvents.filter(e => e.type === 'free-day').length).toBe(2);
    //     });

    // });
    describe('Status', () => {
        describe('conflict', () => {
            it('handles not overlapping', () => {
                const { result } = renderHook(() => useDisplayEvents());
                const d = new Date('2025-01-01T10:00:00Z');
                // 10.00 -- 11.00
                const e1 = ev({ summary: 'E1', start: d, end: new Date(d.getTime() + 60 * 60 * 1000) });
                // 11.30 -- 12.00
                const e2 = ev({ summary: 'E2', start: new Date(d.getTime() + 90 * 60 * 1000), end: new Date(d.getTime() + 120 * 60 * 1000) });
                act(() => {
                    result.current.setDisplayEvents([e1, e2]);
                    result.current.setShowOnly('conflict');
                });
                expect(result.current.displayEvents.length).toBe(0);
            });
            it('Overlapping', () => {
                const { result } = renderHook(() => useDisplayEvents());
                const d = new Date('2025-01-01T10:00:00Z');
                const e1 = ev({ summary: 'E1', start: d, end: new Date(d.getTime() + 60 * 60 * 1000) });  // 10.00 -- 11.00
                const e2 = ev({ summary: 'E2', start: new Date(d.getTime() + 30 * 60 * 1000), end: new Date(d.getTime() + 90 * 60 * 1000) }); // 10.30 -- 11.30
                act(() => {
                    result.current.setDisplayEvents([e1, e2]);
                    result.current.setShowOnly('conflict');
                });
                const statuses = result.current.displayEvents.map(x => x.status).sort();
                expect(result.current.displayEvents.length).toBe(2);
                expect(statuses).toEqual(['conflict', 'conflict']);
            });
        });
        describe('sameDay', () => {
            it('Overlapping should not be sameDay', () => {
                const { result } = renderHook(() => useDisplayEvents());
                const d = new Date('2025-01-01T10:00:00Z');
                // 10.00 -- 11.00
                const e1 = ev({ summary: 'E1', start: d, end: new Date(d.getTime() + 60 * 60 * 1000) });
                // 10.30 -- 11.30
                const e2 = ev({ summary: 'E2', start: new Date(d.getTime() + 30 * 60 * 1000), end: new Date(d.getTime() + 90 * 60 * 1000) });
                act(() => {
                    result.current.setDisplayEvents([e1, e2]);
                    result.current.setShowOnly('sameDay');
                });
                expect(result.current.displayEvents.length).toBe(0);
            });
            it('two events on the same day', () => {
                const { result } = renderHook(() => useDisplayEvents());
                const d = new Date('2025-01-01T10:00:00Z');
                // 10.00 -- 11.00
                const e1 = ev({ summary: 'E1', start: d, end: new Date(d.getTime() + 60 * 60 * 1000) });
                // 12.00 -- 13.00
                const e2 = ev({ summary: 'E2', start: new Date(d.getTime() + 120 * 60 * 1000), end: new Date(d.getTime() + 180 * 60 * 1000) });
                act(() => {
                    result.current.setDisplayEvents([e1, e2]);
                    result.current.setShowOnly('sameDay');
                });
                expect(result.current.displayEvents.length).toBe(2);
            });
        });
        describe('not-ok', () => {
            it('sameDay should be not-ok', () => {
                const { result } = renderHook(() => useDisplayEvents());
                const d = new Date('2025-01-01T10:00:00Z');
                // 10.00 -- 11.00
                const e1 = ev({ summary: 'E1', start: d, end: new Date(d.getTime() + 60 * 60 * 1000) });
                // 11.30 -- 12.00
                const e2 = ev({ summary: 'E2', start: new Date(d.getTime() + 90 * 60 * 1000), end: new Date(d.getTime() + 120 * 60 * 1000) });
                act(() => {
                    result.current.setDisplayEvents([e1, e2]);
                    result.current.setShowOnly('not-ok');
                });
                expect(result.current.displayEvents.length).toBe(2);
            });
            it('conflicts should be not-ok', () => {
                const { result } = renderHook(() => useDisplayEvents());
                const d = new Date('2025-01-01T10:00:00Z');
                // 10.00 -- 11.00
                const e1 = ev({ summary: 'E1', start: d, end: new Date(d.getTime() + 60 * 60 * 1000) });
                // 10.30 -- 11.30
                const e2 = ev({ summary: 'E2', start: new Date(d.getTime() + 30 * 60 * 1000), end: new Date(d.getTime() + 90 * 60 * 1000) });
                act(() => {
                    result.current.setDisplayEvents([e1, e2]);
                    result.current.setShowOnly('not-ok');
                });
                expect(result.current.displayEvents.length).toBe(2);
            });
        });
    });
    // describe('Filter', () => {

    // });
});
