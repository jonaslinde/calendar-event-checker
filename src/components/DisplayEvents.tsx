import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { DisplayEventTable } from "./DisplayEventTable";
import { DisplayEventList } from "./DisplayEventList";
import { DisplayEventsStatusBox } from "./DisplayEventsStatusBox";
import { DisplayEventsShowOptions } from "./DisplayEventsShowOptions";

import type {
    DisplayEvent,
    DisplayEventSortField,
    DisplayEventSortOrder
} from "./../hooks/useDisplayEvents";

import type { OptionCheckBoxProps } from "./DisplayEventsShowOptions"

type ViewModeType = "list" | "table" | "calendar";

export type Props = {
    events: DisplayEvent[]
}

export function DisplayEvents({ events }: Props) {
    const [viewMode, setViewMode] = useState<ViewModeType>('list');
    const [showFreeWeekdays, setshowFreeWeekdays] = useState(false);
    const [showFreeHolidays, setshowFreeHolidays] = useState(false);
    const [showConflictsOnly, setShowConflictsOnly] = useState(false);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [sortField, setSortField] = useState<DisplayEventSortField>("start");
    const [sortOrder, setSortOrder] = useState<DisplayEventSortOrder>("asc");

    const viewToIndex = (mode: ViewModeType): number => (mode === "list") ? 0 : (mode === "table") ? 1 : 2
    const indexToView = (idx: number): ViewModeType => (idx === 0) ? "list" : (idx === 1) ? "table" : "calendar";

    const handleSort = (field: DisplayEventSortField) => {
        const newOrder: DisplayEventSortOrder = (sortOrder === "asc") ? "desc" : "asc"
        setSortOrder(newOrder);
        setSortField(field);
    };

    const optionSettings: OptionCheckBoxProps[] = [{
        label: 'Visa lediga vardagar',
        checked: showFreeWeekdays,
        onChange: setshowFreeWeekdays
    }, {
        label: 'Visa lediga helgdagar',
        checked: showFreeHolidays,
        onChange: setshowFreeHolidays
    }, {
        label: 'Visa bara konflikter',
        checked: showConflictsOnly,
        onChange: setShowConflictsOnly
    }, {
        label: 'Slå ihop dubbletter',
        checked: mergeDuplicates,
        onChange: setMergeDuplicates
    },]

    return (
        <>
            {events.length > 0 && (
                <Box mt={6}>
                    <Tabs value={viewToIndex(viewMode)} onChange={(_, idx) => setViewMode(indexToView(idx))} centered sx={{ mb: 4 }}>
                        <Tab label="Listvy" />
                        <Tab label="Tabellvy" />
                        <Tab label="Kalendervy" disabled />
                    </Tabs>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <DisplayEventsStatusBox events={events} />
                        <DisplayEventsShowOptions optionSettings={optionSettings} />
                    </Box>
                    {viewMode === 'list' ? (
                        <DisplayEventList events={events} onSort={handleSort} />
                    ) : (
                        <DisplayEventTable events={events} sortOrder={sortOrder} sortField={sortField} onSort={handleSort} />
                    )}
                </Box>
            )
            }
        </>
    );
}