import { useState } from 'react';
import { parseIcsToCalendar } from '../utils/calendarParser';
import type { CalendarFile } from '../utils/calendarParser';

export function useCalendars() {
  const [calendars, setCalendars] = useState<CalendarFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  function addCalendarFromIcs(ics: string, fallbackName: string) {
    try {
      const calendar = parseIcsToCalendar(ics, fallbackName);
      setCalendars((prev) => [...prev, calendar]);
      setError(null);
    } catch {
      setError('Kunde inte läsa/parsa filen. Kontrollera att det är en giltig .ics-fil.');
    }
  }

  function addManualCalendar(calendar: CalendarFile) {
    setCalendars((prev) => [...prev, calendar]);
  }

  function removeCalendar(name: string) {
    setCalendars((prev) => prev.filter((cal) => cal.name !== name));
  }

  return { calendars, error, addCalendarFromIcs, addManualCalendar, removeCalendar };
} 