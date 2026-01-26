import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { DisplayEventsStatusBox } from "./DisplayEventsStatusBox";
import { DisplayEventsShowOptions } from "./DisplayEventsShowOptions";
import { BigCalendar } from './BigCalendar';
import { DisplayEventsList } from "./DisplayEventsList";
import { AgendaDaysContext } from "./agendaDaysContext";
import type { DisplayEvent, DisplayEventStatus } from '../hooks/useDisplayEvents';

import type { OptionCheckBoxProps } from "./DisplayEventsShowOptions"

export type Props = {
    events: DisplayEvent[];
    onShowChange?: (show: DisplayEventStatus[]) => void;
    onMergeChange?: (mergeDuplicates: boolean) => void;
};

export function DisplayEvents({ events, onShowChange, onMergeChange }: Props) {
    const [showConflictsOnly, setShowConflictsOnly] = useState(false);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
    const [agendaDays, setAgendaDays] = useState(30);

    const handleShowConflictsOnly = (value: boolean) => {
        setShowConflictsOnly(value);
        onShowChange?.(value ? ['overlapping', 'sameDay'] : []);
    };

    const handleMergeDuplicates = (value: boolean) => {
        setMergeDuplicates(value);
        onMergeChange?.(value);
    }

    const optionSettings: OptionCheckBoxProps[] = [
        {
            label: 'Visa bara konflikter',
            checked: showConflictsOnly,
            onChange: handleShowConflictsOnly
        },
        {
            label: 'Slå ihop dubbletter',
            checked: mergeDuplicates,
            onChange: handleMergeDuplicates
        },
    ];

    return (
        <Box mt={6}>
            <Tabs
                value={viewMode}
                onChange={(_, value: "calendar" | "list") => setViewMode(value)}
                sx={{ mb: 2 }}
            >
                <Tab label="Kalender" value="calendar" />
                <Tab label="Lista" value="list" />
            </Tabs>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <DisplayEventsStatusBox events={events} />
                <DisplayEventsShowOptions optionSettings={optionSettings} />
            </Box>
            <AgendaDaysContext.Provider value={{ agendaDays, setAgendaDays }}>
                {viewMode === "list"
                    ? <DisplayEventsList events={events} />
                    : <BigCalendar events={events} agendaLength={agendaDays} />}
            </AgendaDaysContext.Provider>
        </Box>
    );
}
