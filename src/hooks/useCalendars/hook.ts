import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CalendarEventType, CalendarType } from "./types";
import { loadCalendarsFromLocalStorage, parseIcsToCalendar, saveToLocalStorage } from "./utils";

const isBrowser = typeof window !== 'undefined';

export function useCalendars() {
  if (import.meta.env.MODE !== 'production') console.log("useCalendars")
  const STORAGE_KEY = 'calendars_v1';
  const [calendars, setCalendars] = useState<CalendarType[]>(() => loadCalendarsFromLocalStorage(STORAGE_KEY));
  const [error, setError] = useState<string | null>(null);
  const colors = useMemo(() => [
    '#000000', // Svart
    '#ffffff', // Vit
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
  ], []);

  useEffect(() => {
    if (!isBrowser) return;
    if (import.meta.env.MODE !== 'production') console.log("Saving " + calendars.length + " calendars")
    try {
      saveToLocalStorage(calendars, STORAGE_KEY);
    } catch (e) {
      if (import.meta.env.MODE !== 'production') console.error("Error saving calendars : ", e);
    }
  }, [calendars]);

  const getColor = useCallback(() => colors[calendars.length % colors.length], [calendars, colors]);

  const getCalendarColor = useCallback((calendarName: string) => {
    const cal = calendars.find(c => c.name === calendarName);
    return cal?.color ?? colors[0]; // fallback så du aldrig får undefined
  }, [calendars, colors]);

  const addCalendar = useCallback((calendar: CalendarType) => {
    setCalendars(prev => [...prev, calendar]);
  }, []);

  const addCalendarFromIcs = useCallback((ics: string, fallbackName: string) => {
    try {
      const newId = calendars.length ? Math.max(...calendars.map(c => c.id ?? -1)) + 1 : 0;
      const calendar = parseIcsToCalendar(ics, fallbackName, newId, getColor());
      addCalendar(calendar);
    } catch {
      setError('Kunde inte läsa/parsa filen. Kontrollera att det är en giltig .ics-fil.');
    }
  }, [calendars, getColor, addCalendar]);

  const removeCalendar = useCallback((name: string) => {
    setCalendars((prev) => prev.filter((cal) => cal.name !== name));
  }, [])

  const updateCalendar = useCallback((name: string, updatedCalendar: CalendarType) => {
    setCalendars((prev) =>
      prev.map((cal) => cal.name === name ? updatedCalendar : cal)
    );
  }, [])

  const updateEvent = useCallback((
    calendarName: string,
    eventIndex: number,
    updatedEvent: Partial<CalendarEventType>
  ) => {
    setCalendars(prev =>
      prev.map(cal =>
        cal.name === calendarName
          ? {
            ...cal,
            events: cal.events.map((event, idx) => {
              if (idx !== eventIndex) return event;
              const patch = { ...updatedEvent } as Partial<CalendarEventType>;
              if (typeof patch.start === 'string') patch.start = new Date(patch.start);
              if (typeof patch.end === 'string') patch.end = new Date(patch.end);
              return { ...event, ...patch };
            }),
          }
          : cal
      )
    );
  }, [])
  const deleteEvent = useCallback((calendarName: string, eventIndex: number) => {
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
  }, []);

  const addEvent = useCallback((
    calendarName: string,
    newEvent: CalendarEventType
  ) => {
    setCalendars(prev =>
      prev.map(cal => {
        if (cal.name !== calendarName) return cal;
        const normalized = {
          ...newEvent,
          start: newEvent.start || new Date(NaN),
          end: newEvent.end || new Date(NaN),
          name: calendarName
        } as CalendarEventType;
        return { ...cal, events: [...cal.events, normalized] };
      })
    );
  }, []);

  const clearCalendars = useCallback(() => {
    setCalendars([]);
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

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
