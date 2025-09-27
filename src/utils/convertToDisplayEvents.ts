import type { CalendarType, CalendarEventType } from "../hooks/useCalendars"
import type { DisplayEvent } from '../hooks/useDisplayEvents'

export function convertCalendarEvent(
    calendarEvent: CalendarEventType,
    calendar: CalendarType
): DisplayEvent {
    return {
        date: calendarEvent.start,
        type: 'event',
        weekday: calendarEvent.start,
        summary: calendarEvent.summary,
        description: calendarEvent.description,
        status: 'ok',
        location: calendarEvent.location,
        startDate: calendarEvent.start,
        endDate: calendarEvent.end,
        calendars: [{ name: calendar.name, color: calendar.color }],
    };
}

export function convertAll(calendars: CalendarType[]): DisplayEvent[] {
    return calendars.flatMap(c => c.events.map(e => convertCalendarEvent(e, c)));
}