import { useState } from 'react';
import { Box } from '@mui/material';
import { DisplayEventsStatusBox } from "./DisplayEventsStatusBox";
import { DisplayEventsShowOptions } from "./DisplayEventsShowOptions";
import { BigCalendar } from './BigCalendar';
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <DisplayEventsStatusBox events={events} />
                <DisplayEventsShowOptions optionSettings={optionSettings} />
            </Box>
            <BigCalendar events={events} agendaLength={90} />
        </Box>
    );
}
