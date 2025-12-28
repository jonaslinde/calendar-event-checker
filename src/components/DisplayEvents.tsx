import { useState } from 'react';
import { Box } from '@mui/material';
import { DisplayEventsStatusBox } from "./DisplayEventsStatusBox";
import { DisplayEventsShowOptions } from "./DisplayEventsShowOptions";
import { BigCalendar } from './BigCalendar';
import type { DisplayEvent } from '../hooks/useDisplayEvents';

import type { OptionCheckBoxProps } from "./DisplayEventsShowOptions"

export type Props = {
    events: DisplayEvent[];
    onShowConflictsOnly?: (showConflictsOnly: boolean) => void;
    onMergeDuplicates?: (mergeDuplicates: boolean) => void;
};

export function DisplayEvents({ events, onShowConflictsOnly, onMergeDuplicates }: Props) {
    // TODO #3: Integrate free days calculation - Uncomment and wire up free weekdays/holidays display options
    // const [showFreeWeekdays, setshowFreeWeekdays] = useState(false);
    // const [showFreeHolidays, setshowFreeHolidays] = useState(false);
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
        // TODO #3: Integrate free days calculation - Uncomment these options when implementing free days
        // {
        //     label: 'Visa lediga vardagar',
        //     checked: showFreeWeekdays,
        //     onChange: setshowFreeWeekdays
        // },
        // {
        //     label: 'Visa lediga helgdagar',
        //     checked: showFreeHolidays,
        //     onChange: setshowFreeHolidays
        // },
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
            {/* TODO #1: Wire up conflict detection - Filter events based on showConflictsOnly state */}
            {/* TODO #2: Implement duplicate merging - Apply mergeByKey when mergeDuplicates is true */}
            {/* TODO #5: Integrate alternative views - Consider using DisplayEventTable or DisplayEventList components */}
            <BigCalendar events={events} agendaLength={90} />
        </Box>
    );
}
