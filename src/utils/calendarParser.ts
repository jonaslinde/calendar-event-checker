import ical from 'ical.js';
import { getCalendarNameFromIcs } from './calendarName';

export interface EventType {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
  calendarName: string;
}

export interface CalendarFile {
  name: string;
  events: EventType[];
}

export function parseIcsToCalendar(ics: string, fallbackName: string): CalendarFile {
  const name = getCalendarNameFromIcs(ics, fallbackName);
  const jcalData = ical.parse(ics);
  const comp = new ical.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent') as any[];
  const events: EventType[] = vevents.map((vevent) => {
    const e = new ical.Event(vevent);
    return {
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: e.startDate ? e.startDate.toString() : '',
      end: e.endDate ? e.endDate.toString() : '',
      calendarName: name,
    };
  });
  return { name, events };
} 