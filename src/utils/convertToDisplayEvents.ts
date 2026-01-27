import type { CalendarType, CalendarEventType } from "../hooks/useCalendars"
import type { DisplayEvent } from '../hooks/useDisplayEvents'

// TODO #4: Fix event status assignment - Status is currently hardcoded to "ok", should receive computed status from setEventStatuses
export function convertCalendarEvent(
    calendarEvent: CalendarEventType,
    calendar: CalendarType
): DisplayEvent {
    return {
        // For react-big-calendar compatibility
        title: calendarEvent.summary,  // Alias for summary
        start: calendarEvent.start,
        end: calendarEvent.end,
        allDay: undefined,  // TODO: Detect from ICS (DATE vs DATETIME)

        // For processing/analysis
        summary: calendarEvent.summary,
        description: calendarEvent.description,
        location: calendarEvent.location,
        calendars: [{ name: calendar.name, color: calendar.color }],
        status: 'ok',
    };
}

export function convertAll(calendars: CalendarType[]): DisplayEvent[] {
    return calendars.flatMap(c => c.events.map(e => convertCalendarEvent(e, c)));
}
