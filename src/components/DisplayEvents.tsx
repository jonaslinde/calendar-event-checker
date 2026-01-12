import { useState } from 'react';
import { Box } from '@mui/material';
import { DisplayEventsStatusBox } from "./DisplayEventsStatusBox";
import { DisplayEventsShowOptions } from "./DisplayEventsShowOptions";
import { BigCalendar } from './BigCalendar';
import type { DisplayEvent } from '../hooks/useDisplayEvents';

import type { OptionCheckBoxProps } from "./DisplayEventsShowOptions"

export type Props = {
    events: DisplayEvent[];
    onShowChange?: (show: DisplayEventStatus[]) => void;
    onMergeChange?: (mergeDuplicates: boolean) => void;
};

export function DisplayEvents({ events, onShowChange: onShowConflictsOnly, onMergeChange: onMergeDuplicates }: Props) {
    // TODO #1: Wire up conflict detection - Implement filtering logic when showConflictsOnly is true
    const [showConflictsOnly, setShowConflictsOnly] = useState(false);
    // TODO #2: Implement duplicate merging - Apply mergeByKey logic when mergeDuplicates is true
    const [mergeDuplicates, setMergeDuplicates] = useState(false);

    const handleShowConflictsOnly = (value: boolean) => {
        setShowConflictsOnly(value);
        onShowConflictsOnly?.(value);
    };

    const handleMergeDuplicates = (value: boolean) => {
        setMergeDuplicates(value);
        onMergeDuplicates?.(value);
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
