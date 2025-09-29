import { useState, useMemo } from 'react';
import { mergeByKey, setEventStatuses, compareDisplayEvents } from './utils';
import type { DisplayEvent, DisplayEventSortOrder, DisplayEventSortField } from './types'


export function useDisplayEvents() {
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
    const [sortField, setSortField] = useState<DisplayEventSortField>('start');
    const [sortOrder, setSortOrder] = useState<DisplayEventSortOrder>('asc');
    const [includeFreeWeekdays, setIncludeFreeWeekdays] = useState(false);
    const [includeFreeHolidays, setIncludeFreeHolidays] = useState(false);
    const [merge, setMerge] = useState(false);
    const [showOnly, setShowOnly] = useState<'all' | 'conflict' | 'same-day' | 'not-ok'>('all');
    //todo: add functionality to only show future events

    const processedEvents = useMemo(() => {
        const merged = merge ? mergeByKey(displayEvents) : displayEvents;
        const withStatus = setEventStatuses(merged);

        // 3) include synthetic free-days (optional)
        //const withFree = addFreeDays(withStatus, includeFreeHolidays, includeFreeWeekdays);

        // 4) filter by status if requested
        const filtered =
            showOnly === 'all'
                ? withStatus
                : withStatus.filter(ev =>
                    showOnly === 'not-ok' ? ev.status !== 'ok' : ev.status === showOnly
                );
        // Sort (non-mutating)
        const sorted = [...filtered].sort((a, b) => compareDisplayEvents(a, b, sortField, sortOrder));

        return sorted;
    }, [displayEvents, merge, showOnly, sortField, sortOrder]);

    return {
        displayEvents: processedEvents,
        // raw setter (if the caller wants to inject/replace base events)
        setDisplayEvents,
        // sort controls
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        // pipeline flags
        merge,
        setMerge,
        includeFreeWeekdays,
        setIncludeFreeWeekdays,
        includeFreeHolidays,
        setIncludeFreeHolidays,
        showOnly,
        setShowOnly,
    };
}