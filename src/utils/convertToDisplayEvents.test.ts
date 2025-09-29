import { describe, it, expect } from 'vitest';
import { convertAll } from './convertToDisplayEvents';
import type { CalendarType, CalendarEventType } from './../hooks/useCalendars'

describe('convertAll', () => {
  it('konverterar en kalender med ett event korrekt', () => {
    const events: CalendarEventType[] = [{
      name: 'Laget',
      summary: 'Match',
      description: 'Viktig match',
      location: 'Arena',
      start: new Date('2025-01-01T10:00:00Z'),
      end: new Date('2025-01-01T11:00:00Z'),
    }];
    const calendars: CalendarType[] = [{
      id: 0,
      name: 'TestCal',
      color: '#123456',
      events: events,
      visible: true
    }];
    const result = convertAll(calendars);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      summary: 'Match',
      calendars: [{ name: 'TestCal', color: '#123456' }],
    });
  });
});