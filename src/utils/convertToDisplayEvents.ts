import type { CalendarType, CalendarEventType } from "../hooks/useCalendars"
import type { DisplayEvent } from '../hooks/useDisplayEvents'
import { formatWeekday } from "./dateStringHelpers";

export function convertCalendarEvent(
    calendarEvent: CalendarEventType,
    calendar: CalendarType
): DisplayEvent {
    return {
        date: calendarEvent.start.toDateString(),
        type: 'event',
        weekday: formatWeekday(calendarEvent.start),
        summary: calendarEvent.summary,
        description: calendarEvent.description,
        status: 'ok',
        location: calendarEvent.location,
        start: calendarEvent.start.toISOString(),
        end: calendarEvent.end.toISOString(),
        calendars: [{ name: calendar.name, color: calendar.color }],
    };
}

export function convertAll(calendars: CalendarType[]): DisplayEvent[] {
    return calendars.flatMap(c => c.events.map(e => convertCalendarEvent(e, c)));
}