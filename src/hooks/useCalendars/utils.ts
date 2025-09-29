import ical from 'ical.js';
import type { CalendarType, CalendarEventType } from "./types";

const isBrowser = typeof window !== 'undefined';

export function getNameFromComponent(comp: ical.Component, fallback: string): string {
    let calName = comp.getFirstPropertyValue('x-wr-calname') || comp.getFirstPropertyValue('name') || fallback;
    if (typeof calName !== 'string') calName = fallback;
    return calName;
}

export function createEventFromIcalEvent(e: ical.Event, calendarName: string): CalendarEventType {
    return {
        summary: e.summary,
        description: e.description,
        location: e.location,
        start: e.startDate ? e.startDate.toJSDate() : new Date(NaN),
        end: e.endDate ? e.endDate.toJSDate() : new Date(NaN),
        name: calendarName
    };
}

export function safeParseIcs(text: string) {
    try {
        return ical.parse(text);
    } catch {
        const fixed = formatIcs(text);
        return ical.parse(fixed);
    }
}

export function formatIcs(text: string): string {
    // Kontrollera att det verkligen är .ics-innehåll
    if (!text.includes('BEGIN:VCALENDAR')) {
        throw new Error('Innehållet verkar inte vara en giltig .ics-kalender');
    }

    // Formatera texten om den kommer som en lång rad
    if (!text.includes('\n')) {
        // Lägg till radbrytningar efter varje komponent
        text = text
            .replace(/BEGIN:/g, '\nBEGIN:')
            .replace(/END:/g, '\nEND:')
            .replace(/DTSTART/g, '\nDTSTART')
            .replace(/DTEND/g, '\nDTEND')
            .replace(/DTSTAMP/g, '\nDTSTAMP')
            .replace(/UID:/g, '\nUID:')
            .replace(/SUMMARY:/g, '\nSUMMARY:')
            .replace(/DESCRIPTION:/g, '\nDESCRIPTION:')
            .replace(/LOCATION:/g, '\nLOCATION:')
            .replace(/STATUS:/g, '\nSTATUS:')
            .replace(/TRANSP:/g, '\nTRANSP:')
            .replace(/SEQUENCE:/g, '\nSEQUENCE:')
            .replace(/CREATED:/g, '\nCREATED:')
            .replace(/LAST-MODIFIED:/g, '\nLAST-MODIFIED:')
            .replace(/TZID:/g, '\nTZID:')
            .replace(/TZOFFSETFROM:/g, '\nTZOFFSETFROM:')
            .replace(/TZOFFSETTO:/g, '\nTZOFFSETTO:')
            .replace(/TZNAME:/g, '\nTZNAME:')
            .replace(/RRULE:/g, '\nRRULE:')
            .replace(/PRODID:/g, '\nPRODID:')
            .replace(/VERSION:/g, '\nVERSION:')
            .replace(/METHOD:/g, '\nMETHOD:')
            .replace(/CALSCALE:/g, '\nCALSCALE:')
            .trim();
    }

    return text;
}

export const saveToLocalStorage = (calendars: CalendarType[], key: string) => {
    const json = JSON.stringify(calendars);
    localStorage.setItem(key, json);
}

export function loadCalendarsFromLocalStorage(key: string): CalendarType[] {
    if (!isBrowser) return [];
    if (import.meta.env.MODE !== 'production') console.log("Loading calendars...")
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;

        if (!Array.isArray(parsed)) return [];

        // Reviva start/end till Date
        const revived = (parsed as any[]).map(cal => ({
            ...cal,
            events: Array.isArray(cal.events)
                ? cal.events.map((ev: any) => ({
                    ...ev,
                    start: ev.start ? new Date(ev.start) : new Date(NaN),
                    end: ev.end ? new Date(ev.end) : new Date(NaN),
                }))
                : [],
        })) as CalendarType[];

        // Minimal validering
        return revived.filter(c => typeof c.name === 'string' && Array.isArray(c.events));
    } catch (e) {
        if (import.meta.env.MODE !== 'production') console.log('Failed to load calendars from local storage', e);
        return [];
    }
}

export function parseIcsToCalendar(ics: string, fallbackName: string, id: number, color: string): CalendarType {
    const jcalData = safeParseIcs(ics);
    const comp = new ical.Component(jcalData);
    const name = getNameFromComponent(comp, fallbackName);
    const vevents = comp.getAllSubcomponents('vevent') as any[];
    const visible = true;
    const events: CalendarEventType[] = vevents.map((vevent) => {
        const e = new ical.Event(vevent);
        return createEventFromIcalEvent(e, name);
    });
    return { name, events, color, visible, id };
}
