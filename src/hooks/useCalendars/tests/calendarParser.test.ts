import { describe, it, expect } from 'vitest';
import { parseIcsToCalendar } from '../../utils/calendarParser';

describe('parseIcsToCalendar', () => {
  it('returnerar kalender med X-WR-CALNAME', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nX-WR-CALNAME:Testkalender\nBEGIN:VEVENT\nSUMMARY:Event1\nDTSTART:20240725T170000Z\nDTEND:20240725T180000Z\nEND:VEVENT\nEND:VCALENDAR`;
    const cal = parseIcsToCalendar(ics, 'fallback.ics');
    expect(cal.name).toBe('Testkalender');
    expect(cal.events.length).toBe(1);
    expect(cal.events[0].summary).toBe('Event1');
  });

  it('returnerar kalender med NAME', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nNAME:Andra kalendern\nBEGIN:VEVENT\nSUMMARY:Event2\nDTSTART:20240726T170000Z\nDTEND:20240726T180000Z\nEND:VEVENT\nEND:VCALENDAR`;
    const cal = parseIcsToCalendar(ics, 'fallback.ics');
    expect(cal.name).toBe('Andra kalendern');
    expect(cal.events.length).toBe(1);
    expect(cal.events[0].summary).toBe('Event2');
  });

  it('använder fallback om inget namn finns', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Event3\nDTSTART:20240727T170000Z\nDTEND:20240727T180000Z\nEND:VEVENT\nEND:VCALENDAR`;
    const cal = parseIcsToCalendar(ics, 'fallback.ics');
    expect(cal.name).toBe('fallback.ics');
    expect(cal.events.length).toBe(1);
    expect(cal.events[0].summary).toBe('Event3');
  });

  it('parsar flera events', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nX-WR-CALNAME:MultiEvent\nBEGIN:VEVENT\nSUMMARY:EventA\nDTSTART:20240728T170000Z\nDTEND:20240728T180000Z\nEND:VEVENT\nBEGIN:VEVENT\nSUMMARY:EventB\nDTSTART:20240729T170000Z\nDTEND:20240729T180000Z\nEND:VEVENT\nEND:VCALENDAR`;
    const cal = parseIcsToCalendar(ics, 'fallback.ics');
    expect(cal.name).toBe('MultiEvent');
    expect(cal.events.length).toBe(2);
    expect(cal.events[0].summary).toBe('EventA');
    expect(cal.events[1].summary).toBe('EventB');
  });

  it('returnerar tom events-array om inga event finns', () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nX-WR-CALNAME:Tom kalender\nEND:VCALENDAR`;
    const cal = parseIcsToCalendar(ics, 'fallback.ics');
    expect(cal.name).toBe('Tom kalender');
    expect(cal.events.length).toBe(0);
    expect(cal.events).toEqual([]);
  });
}); 