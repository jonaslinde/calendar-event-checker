import { useState, useMemo } from 'react';
import { setEventStatuses, markDuplicates, mergeByKey } from './utils';
import type { DisplayEvent, DisplayEventStatus } from '.'

export function useDisplayEvents() {
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [show, setShow] = useState<DisplayEventStatus[]>([]);
    const [nameFilter, setNameFilter] = useState('');

    const processedEvents = useMemo(() => {
        const withDuplicates = markDuplicates(displayEvents);
        const eventsWithStatus = setEventStatuses(withDuplicates);
        const mergedEvents = mergeDuplicates ? mergeByKey(eventsWithStatus) : eventsWithStatus;

        return mergedEvents.filter(e => {
            if (show.length > 0 && !show.includes(e.status)) return false;
            if (nameFilter.trim().length === 0) return true;
            const needle = nameFilter.toLowerCase();
            return (e.title ?? '').toLowerCase().includes(needle)
                || (e.summary ?? '').toLowerCase().includes(needle);
        });
    }, [displayEvents, mergeDuplicates, nameFilter, show]);

    return {
        displayEvents: processedEvents,
        setDisplayEvents,
        // pipeline flags
        mergeDuplicates,
        setMergeDuplicates,
        show,
        setShow,
        nameFilter,
        setNameFilter,
    };
}
