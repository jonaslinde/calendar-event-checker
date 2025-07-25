import { describe, it, expect } from 'vitest';
import { getCalendarNameFromIcs } from './utils/calendarName';

describe('Kalendernamn-extraktion', () => {
  it('hittar X-WR-CALNAME', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nX-WR-CALNAME:Testkalender\nEND:VCALENDAR`;
    expect(getCalendarNameFromIcs(ics, 'fallback.ics')).toBe('Testkalender');
  });

  it('hittar NAME', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nNAME:Andra kalendern\nEND:VCALENDAR`;
    expect(getCalendarNameFromIcs(ics, 'fallback.ics')).toBe('Andra kalendern');
  });

  it('använder fallback om inget namn finns', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR`;
    expect(getCalendarNameFromIcs(ics, 'fallback.ics')).toBe('fallback.ics');
  });
}); 