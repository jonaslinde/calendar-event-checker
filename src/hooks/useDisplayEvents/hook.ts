import { useState } from 'react';
import { formatDate } from './utils';
import type { DisplayEvent, DisplayEventSortOrder, DisplayEventSortField, DisplayEventStatus, DisplayEventType } from './types'

const earliestAllowedDate: Date = new Date('1900-01-01');
const latestAllowedDate: Date = new Date('2100-01-01');

const isWithinValidDateRange = (date: Date) => {
    return date > earliestAllowedDate && date < latestAllowedDate
}
// Funktion för att kontrollera om ett datum är giltigt
const isValidDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;
        if (!isWithinValidDateRange(date)) return false;
    } catch {
        return false;
    }
    return true;
};

// Funktion för att generera alla dagar mellan två datum
const generateDateRange = (startDate: Date, endDate: Date) => {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5;
}

const isSameDay = (event1: DisplayEvent, event2: DisplayEvent) => {
    const start1 = new Date(event1.startDate);
    const end1 = new Date(event1.endDate);
    const start2 = new Date(event2.startDate);
    const end2 = new Date(event2.endDate);

    // Kontrollera om datum är giltiga
    if (isNaN(start1.getTime()) || isNaN(end1.getTime()) ||
        isNaN(start2.getTime()) || isNaN(end2.getTime())) {
        return false;
    }

    // Kontrollera att events är på samma datum
    const date1 = start1.toDateString();
    const date2 = start2.toDateString();
    if (date1 !== date2) {
        return false;
    }
    return true;
}

const isOverlapping = (event1: DisplayEvent, event2: DisplayEvent) => {
    try {
        const start1 = new Date(event1.startDate);
        const end1 = new Date(event1.endDate);
        const start2 = new Date(event2.startDate);
        const end2 = new Date(event2.endDate);

        // Kontrollera om datum är giltiga
        if (isNaN(start1.getTime()) || isNaN(end1.getTime()) ||
            isNaN(start2.getTime()) || isNaN(end2.getTime())) {
            return false;
        }

        // Kontrollera att events är på samma datum
        const date1 = start1.toDateString();
        const date2 = start2.toDateString();
        if (date1 !== date2) {
            return false;
        }

        // Två events överlappar om: start1 < end2 && start2 < end1
        return start1 < end2 && start2 < end1;
    } catch {
        return false;
    }
};

const eventKey = (e: DisplayEvent) => {
    const day = formatDate(e.startDate)
    console.log("Event start = " + day)
    return [
        e.date,
        e.startDate,
        e.endDate,
        normalize(e.summary || ''),
        normalize(e.location || '')
    ].join('|');
};

const normalize = (s: string) => s.trim().toLowerCase();

const mergeByKey = (events: DisplayEvent[]): DisplayEvent[] => {
    console.log("Starting merging..")
    const map = new Map<string, DisplayEvent>();
    for (const e of events) {
        console.log(e)
        const key = eventKey(e);
        console.log("Key = " & key)
        const existing = map.get(key);
        if (existing) {
            console.log("key exists at ready! I should merge!")
            const mergedCalendars = [...new Set([...existing.calendars, ...e.calendars])];
            map.set(key, { ...existing, status: "ok", calendars: mergedCalendars });
        } else {
            // map.set(key, { ...e, calendarNames: [...new Set(e.calendarNames)], sourceIds: e.sourceIds?.slice() });
            map.set(key, e);
        }
    }
    console.log("Merging done")
    return [...map.values()];
};

function addFreeHolidays(events: DisplayEvent[]): DisplayEvent[] {

}

function addFreeWeekdays(events: DisplayEvent[]): DisplayEvent[] {

}

function mergeDuplicates(events: DisplayEvent[]): DisplayEvent[] {

}

function addDisplayEvent(events: DisplayEvent[], newEvent: DisplayEvent): DisplayEvent[] {
    events.push(newEvent);
    return events
}

function clearDisplayEvents(events: DisplayEvent[]): DisplayEvent[] {
    return []
}

function sortDisplayEvents(events: DisplayEvent[], sortField: DisplayEventSortField, sortOrder: SortOrder): DisplayEvent[] {
    return events.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortField) {
            case 'date':
                aValue = new Date(a.startDate);
                bValue = new Date(b.startDate);
                if (isNaN(aValue.getTime())) aValue = new Date(0);
                if (isNaN(bValue.getTime())) bValue = new Date(0);
                break;
            case 'start':
                aValue = new Date(a.startDate);
                bValue = new Date(b.startDate);
                if (isNaN(aValue.getTime())) aValue = new Date(0);
                if (isNaN(bValue.getTime())) bValue = new Date(0);
                break;
            case 'end':
                aValue = new Date(a.endDate);
                bValue = new Date(b.endDate);
                if (isNaN(aValue.getTime())) aValue = new Date(0);
                if (isNaN(bValue.getTime())) bValue = new Date(0);
                break;
            case 'summary':
                aValue = a.summary || '';
                bValue = b.summary || '';
                break;
            case 'location':
                aValue = a.location || '';
                bValue = b.location || '';
                break;
            default:
                return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        } else {
            return sortOrder === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        }
    });
}

function onlyConflictingEvents(events: DisplayEvent[]): DisplayEvent[] {
    return events.filter(event => event.status != "ok")
}


// Hitta alla events som spelas samma tid och dag
const findConflictingEvents = (events: DisplayEvent[]): { conflictingEventIndices: number[]; sameDayEventIndices: number[] } => {
    const conflictingEventIndices: number[] = [];
    const sameDayEventIndices: number[] = [];

    for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
            if (isOverlapping(events[i], events[j]))
                conflictingEventIndices.push(i, j);
            else if (isSameDay(events[i], events[j]))
                sameDayEventIndices.push(i, j);
        }
    }

    // Ta bort dubbletter
    return {
        conflictingEventIndices: Array.from(new Set(conflictingEventIndices)),
        sameDayEventIndices: Array.from(new Set(sameDayEventIndices)),
    };
};

function setEventStatuses(events: DisplayEvent[]): DisplayEvent[] {
    // 1. Börja med en kopia där alla är "ok"
    const updated = events.map(ev => ({ ...ev, status: "ok" as EventStatus }));

    // 2. Jämför alla par
    for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i];
            const b = updated[j];

            if (isOverlapping(a, b)) {
                updated[i].status = "conflict";
                updated[j].status = "conflict";
            } else if (isSameDay(a, b)) {
                // Sätt bara same-day om ingen av dem redan är conflict
                if (updated[i].status === "ok") updated[i].status = "same-day";
                if (updated[j].status === "ok") updated[j].status = "same-day";
            }
        }
    }

    return updated;
}

export function useDisplayEvents() {
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);

    // Funktion för att hitta lediga dagar
    const getFreeDays = (events: DisplayEvent[], showFreeHolidays: boolean, showFreeWeekdays: boolean) => {
        if (events.length === 0) return [];

        // Filtrera bort events med ogiltiga datum
        const validEvents = events.filter(event => isValidDate(event.startDate));

        if (validEvents.length === 0) return [];

        // Hitta tidigaste och senaste datum från giltiga events
        const earliestDate: Date = validEvents.reduce<Date>((min, ev) => {
            const d = new Date(ev.startDate);
            if (isNaN(d.getTime())) return min; // hoppa över ogiltiga datum
            return d < min ? d : min;           // behåll minsta datumet
        }, latestAllowedDate);             // default 2100-01-01

        const latestDate: Date = validEvents.reduce<Date>((min, ev) => {
            const d = new Date(ev.startDate);
            if (isNaN(d.getTime())) return min; // hoppa över ogiltiga datum
            return d > min ? d : min;           // behåll minsta datumet
        }, earliestAllowedDate);             // default 1900-01-01

        // Om vi inte hittade några giltiga datum, returnera tom array
        if (earliestDate > latestDate) return [];

        // Generera alla dagar i intervallet
        const allDays = generateDateRange(earliestDate, latestDate);

        // Skapa en Set med dagar som har giltiga events

        const daysWithEvents = new Set();
        validEvents.forEach(event => {
            const eventDate = new Date(event.startDate);
            daysWithEvents.add(eventDate.toDateString());
        });
        // Returnera dagar utan events
        return allDays.filter(day => !daysWithEvents.has(day.toDateString())).filter(day => (showFreeHolidays && !isWeekday(day)) || (showFreeWeekdays && isWeekday(day)))
    };

    const includeWeekdays = () => {
        setDisplayEvents(displayEvents)
    }

    const includeHolidays = () => {
        setDisplayEvents(displayEvents)
    }

    const mergeDuplicates = () => {
        setDisplayEvents(displayEvents)
    }

    const sort = (field: DisplayEventSortField, order: DisplayEventSortOrder) => {
        setDisplayEvents(displayEvents)
    }

    return {
        displayEvents,
        setDisplayEvents,
        includeWeekdays,
        includeHolidays,
        mergeDuplicates,
        sort,
        onlyConflictingEvents,
        findConflictingEvents,
        getFreeDays,
        setEventStatuses,
        mergeByKey
    };
}