import { useState, useEffect } from 'react';
import ical from 'ical.js';
import type { CalendarEventType, CalendarType } from "./types";

const STORAGE_KEY = 'calendars_v1';
const isBrowser = typeof window !== 'undefined';

// Färgschema för kalendrar
const colors = [
  '#1976d2', // Blå
  '#388e3c', // Grön
  '#f57c00', // Orange
  '#7b1fa2', // Lila
  '#c2185b', // Rosa
  '#00796b', // Teal
  '#5d4037', // Brun
  '#455a64', // Blågrå
  '#e91e63', // Magenta
  '#ff5722', // Röd-orange
];

function getNameFromComponent(comp: ical.Component, fallback: string): string {
  let calName = comp.getFirstPropertyValue('x-wr-calname') || comp.getFirstPropertyValue('name') || fallback;
  if (typeof calName !== 'string') calName = fallback;
  return calName;
}

function createEventFromIcalEvent(e: ical.Event, calendarName: string): CalendarEventType {
  return {
    summary: e.summary,
    description: e.description,
    location: e.location,
    start: e.startDate ? e.startDate.toString() : '',
    end: e.endDate ? e.endDate.toString() : '',
    calendarName: calendarName
  };
}

function loadCalendarsFromLocalStorage(): CalendarType[] {
  if (!isBrowser) return [];
  console.log("Loading calendars...")
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.filter((c: any) => c && typeof c.name === 'string' && Array.isArray(c.events)) as CalendarType[];
    }
  } catch (e) {
    console.log('Failed to load calendars from local storage', e);
  }
  return [];
}

function formatIcs(text: string): string {
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

export function useCalendars() {
  console.log("useCalendars")
  const [calendars, setCalendars] = useState<CalendarType[]>(() => loadCalendarsFromLocalStorage());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isBrowser) return;
    console.log("Saving " + calendars.length + " calendars")
    try {
      const json = JSON.stringify(calendars);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
      console.error("Error saving calendars : ", e);
    }
  }, [calendars]);

  const getColor = () => colors[calendars.length % colors.length];

  function parseIcsToCalendar(ics: string, fallbackName: string): CalendarType {
    const jcalData = ical.parse(ics);
    const comp = new ical.Component(jcalData);
    const id = calendars.length;
    const name = getNameFromComponent(comp, fallbackName);
    const color = getColor();
    const vevents = comp.getAllSubcomponents('vevent') as any[];
    const visible = true;
    const events: CalendarEventType[] = vevents.map((vevent) => {
      const e = new ical.Event(vevent);
      return createEventFromIcalEvent(e, name);
    });
    return { name, events, color, visible, id };
  }
  function getCalendarColor(calendarName: string) {
    const index = calendars.findIndex(cal => cal.name === calendarName);
    return colors[index % colors.length];
  };

  function addCalendarFromIcs(ics: string, fallbackName: string) {
    try {
      const calendar = parseIcsToCalendar(formatIcs(ics), fallbackName);
      setCalendars((prev) => [...prev, calendar]);
      setError(null);
    } catch {
      setError('Kunde inte läsa/parsa filen. Kontrollera att det är en giltig .ics-fil.');
    }
  }

  function addCalendar(calendar: CalendarType) {
    setCalendars((prev) => [...prev, calendar]);
  }

  function removeCalendar(name: string) {
    setCalendars((prev) => prev.filter((cal) => cal.name !== name));
  }

  function updateCalendar(name: string, updatedCalendar: CalendarType) {
    setCalendars((prev) =>
      prev.map((cal) => cal.name === name ? updatedCalendar : cal)
    );
  }

  function updateEvent(calendarName: string, eventIndex: number, updatedEvent: any) {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.name === calendarName
          ? {
            ...cal,
            events: cal.events.map((event, index) =>
              index === eventIndex ? { ...event, ...updatedEvent } : event
            )
          }
          : cal
      )
    );
  }
  function deleteEvent(calendarName: string, eventIndex: number) {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.name === calendarName
          ? {
            ...cal,
            events: cal.events.filter((_, index) => index !== eventIndex)
          }
          : cal
      )
    );
  }
  function addEvent(calendarName: string, newEvent: any) {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.name === calendarName
          ? {
            ...cal,
            events: [...cal.events, { ...newEvent, calendarName }]
          }
          : cal
      )
    );
  }

  function clearCalendars() {
    setCalendars([]);
    if (isBrowser) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { }
    }
  }

  return {
    calendars,
    error,
    addCalendarFromIcs,
    addCalendar,
    removeCalendar,
    updateCalendar,
    updateEvent,
    deleteEvent,
    addEvent,
    clearCalendars,
    getCalendarColor
  };
} 