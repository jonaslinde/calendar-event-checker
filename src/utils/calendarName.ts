import ical from 'ical.js';

export function getCalendarNameFromIcs(ics: string, fallback: string): string {
  const jcalData = ical.parse(ics);
  const comp = new ical.Component(jcalData);
  let calName = comp.getFirstPropertyValue('x-wr-calname') || comp.getFirstPropertyValue('name') || fallback;
  if (typeof calName !== 'string') calName = fallback;
  return calName;
} 