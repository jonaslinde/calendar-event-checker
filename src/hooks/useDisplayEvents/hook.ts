import { useState, useMemo } from 'react';
import { setEventStatuses, markDuplicates, mergeByKey } from './utils';
import type { DisplayEvent, DisplayEventStatus } from '.'

export function useDisplayEvents() {
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [show, setShow] = useState<DisplayEventStatus[]>([]);

    const processedEvents = useMemo(() => {
        const eventsWithStatus = setEventStatuses(displayEvents);
        const withDuplicates = markDuplicates(eventsWithStatus);
        const mergedEvents = mergeDuplicates ? mergeByKey(withDuplicates) : withDuplicates;

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
