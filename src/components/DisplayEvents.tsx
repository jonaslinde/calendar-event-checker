import { useEffect, useState } from 'react';
import { Box, Tab, Tabs, TextField } from '@mui/material';
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
    onNameFilterChange?: (value: string) => void;
};

export function DisplayEvents({ events, onShowChange, onMergeChange, onNameFilterChange }: Props) {
    const [showConflictsOnly, setShowConflictsOnly] = useState(false);
    const [statusFilters, setStatusFilters] = useState<DisplayEventStatus[]>([]);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
    const [agendaDays, setAgendaDays] = useState(30);
    const [nameFilter, setNameFilter] = useState("");

    const handleShowConflictsOnly = (value: boolean) => {
        setShowConflictsOnly(value);
        setStatusFilters(value ? ['overlapping', 'sameDay'] : []);
    };

    const handleMergeDuplicates = (value: boolean) => {
        setMergeDuplicates(value);
        onMergeChange?.(value);
    }

    const toggleStatus = (status: DisplayEventStatus) => {
        setShowConflictsOnly(false);
        setStatusFilters((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (!checked) return;
        setShowConflictsOnly(false);
        setStatusFilters([]);
    };

    useEffect(() => {
        onShowChange?.(statusFilters);
    }, [onShowChange, statusFilters]);

    useEffect(() => {
        onNameFilterChange?.(nameFilter.trim());
    }, [nameFilter, onNameFilterChange]);

    const statusOptions: OptionCheckBoxProps[] = [
        {
            label: 'Alla',
            checked: statusFilters.length === 0,
            onChange: handleSelectAll
        },
        {
            label: 'Ok',
            checked: statusFilters.includes('ok'),
            onChange: () => toggleStatus('ok')
        },
        {
            label: 'Överlappande',
            checked: statusFilters.includes('overlapping'),
            onChange: () => toggleStatus('overlapping')
        },
        {
            label: 'Samma dag',
            checked: statusFilters.includes('sameDay'),
            onChange: () => toggleStatus('sameDay')
        },
        {
            label: 'Dubletter',
            checked: statusFilters.includes('duplicate'),
            onChange: () => toggleStatus('duplicate')
        },
        {
            label: 'Sammanslagna',
            checked: statusFilters.includes('merged'),
            onChange: () => toggleStatus('merged')
        },
    ];

    const mergeOptions: OptionCheckBoxProps[] = [
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
                <DisplayEventsShowOptions statusOptions={statusOptions} mergeOptions={mergeOptions} />
            </Box>
            <Box mb={2} maxWidth={360}>
                <TextField
                    label="Filtrera på namn"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    fullWidth
                    size="small"
                />
            </Box>
            <AgendaDaysContext.Provider value={{ agendaDays, setAgendaDays }}>
                {viewMode === "list"
                    ? <DisplayEventsList events={events} />
                    : <BigCalendar events={events} agendaLength={agendaDays} />}
            </AgendaDaysContext.Provider>
        </Box>
    );
}
