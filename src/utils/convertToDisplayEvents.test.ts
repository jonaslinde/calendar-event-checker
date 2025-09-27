import { describe, it, expect } from 'vitest';
import { convertAll } from './convertToDisplayEvents';

describe('convertAll', () => {
  it('konverterar en kalender med ett event korrekt', () => {
    const calendars = [{
      name: 'TestCal',
      color: '#123456',
      events: [{
        summary: 'Match',
        description: 'Viktig match',
        location: 'Arena',
        start: '2025-01-01T10:00:00Z',
        end: '2025-01-01T11:00:00Z',
      }],
    }];
    const result = convertAll(calendars);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      summary: 'Match',
      calendars: [{ name: 'TestCal', color: '#123456' }],
    });
  });
});