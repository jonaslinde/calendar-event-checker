import { useState, useMemo } from 'react';
import { setEventStatuses, markDuplicates, mergeByKey } from './utils';
import type { DisplayEvent, DisplayEventStatus } from '.'

export function useDisplayEvents() {
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [show, setShow] = useState<DisplayEventStatus[]>([]);

    const processedEvents = useMemo(() => {
        const withDuplicates = markDuplicates(displayEvents);
        const eventsWithStatus = setEventStatuses(withDuplicates);
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
