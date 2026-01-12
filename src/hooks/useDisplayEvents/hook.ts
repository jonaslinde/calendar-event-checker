import { useState, useMemo } from 'react';
import { setEventStatuses } from './utils';
import type { DisplayEvent, DisplayEventStatus } from '.'

export function useDisplayEvents() {
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [show, setShow] = useState<DisplayEventStatus[]>([]);

    const mergeByKey = (events: DisplayEvent[]): DisplayEvent[] => {
        const map = new Map<string, DisplayEvent>();
        for (const e of events) {
            const key = eventKey(e);
            const existing = map.get(key);
            if (existing) {
                const existingNames = new Set(existing.calendars.map(c => c.name));
                for (const c of e.calendars) existingNames.add(c.name);
                const mergedCalendars = Array.from(existingNames).map(name => {
                    // keep first color we saw for that name
                    const found = [...existing.calendars, ...e.calendars].find(c => c.name === name);
                    return found ?? { name, color: '#999' };
                });
                map.set(key, { ...existing, status: 'ok', calendars: mergedCalendars });
            } else {
                map.set(key, e);
            }
        }
        return [...map.values()];
    };

    const processedEvents = useMemo(() => {
        const eventsWithStatus = setEventStatuses(displayEvents);

        const mergedEvents = mergeDuplicates ? mergeByKey(eventsWithStatus) : eventsWithStatus;

        return mergedEvents.filter(e =>
            show.length === 0 ? true : show.includes(e.status)
        );
    }, [displayEvents, mergeDuplicates, show]);

    return {
        displayEvents: processedEvents,
        setDisplayEvents,
        // pipeline flags
        mergeDuplicates,
        setMergeDuplicates,
        show,
        setShow,
    };
}
