import { describe, it, expect, beforeEach } from 'vitest';
import { useCalendars } from "./../../useCalendars";
import { renderHook, act } from '@testing-library/react';

describe("useCalendar", () => {
    beforeEach(() => localStorage.clear());

    it('hydrerar från localStorage', () => {
        const sample = [{
            id: 0,
            name: 'Demo',
            color: '#1976d2',
            visible: true,
            events: [{
                summary: 'Match',
                description: '',
                location: '',
                start: new Date(NaN),
                end: new Date(NaN),
                calendarName: 'Demo'
            }]
        }];
        localStorage.setItem('calendars_v1', JSON.stringify(sample));

        const { result } = renderHook(() => useCalendars());
        expect(result.current.calendars).toHaveLength(1);
        expect(result.current.calendars[0].events[0].start).toBeInstanceOf(Date);
    });
    it('sparar till localStorage vid ändring', () => {
        localStorage.clear();
        const { result } = renderHook(() => useCalendars());

        act(() => {
            result.current.addCalendar({
                id: 1,
                name: 'Demo',
                color: '#1976d2',
                visible: true,
                events: []
            });
        });

        const stored = JSON.parse(localStorage.getItem('calendars_v1')!);
        expect(stored).toHaveLength(1);
    });
    it('lägger till event och konverterar strängdatum till Date', () => {
        const { result } = renderHook(() => useCalendars());

        act(() => {
            result.current.addCalendar({
                id: 1, name: 'Demo', color: '#1976d2', visible: true, events: []
            });
        });

        act(() => {
            result.current.addEvent('Demo', {
                summary: 'Träning',
                description: '',
                location: '',
                start: new Date(NaN),
                end: new Date(NaN),
                name: 'Demo'
            });
        });

        expect(result.current.calendars[0].events[0].start).toBeInstanceOf(Date);
    });
    it('tar bort kalender', () => {
        const { result } = renderHook(() => useCalendars());
        act(() => {
            result.current.addCalendar({ id: 1, name: 'Demo', color: '#1976d2', visible: true, events: [] });
        });
        act(() => {
            result.current.removeCalendar('Demo');
        });
        expect(result.current.calendars).toHaveLength(0);
    });
});