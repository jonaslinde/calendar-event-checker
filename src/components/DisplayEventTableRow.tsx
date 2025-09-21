import { Box, TableCell, TableRow } from '@mui/material';
import { CalendarChip } from './CalendarChip';
import { WarningBox } from "./WarningBox";
import { formatDate, formatTime, formatWeekday } from "./../utils/dateStringHelpers";
import { CalendarChipList } from "./CalendarChipList";

import type { DisplayEvent } from "../hooks/useDisplayEvents"

export type Props = {
    event: DisplayEvent,
    id: string
}

const backgroundColor = (event: DisplayEvent) => {
    if (event.type == "event")
        return event.status != "ok" ? 'rgba(244, 67, 54, 0.1)' : 'inherit';
    // must be a freeday
    return 'rgba(76, 175, 80, 0.1)'
};

const border = (event: DisplayEvent) => event.status != "ok" ? '2px solid #f44336' : 'none';
const borderLeft = (event: DisplayEvent) => event.type == "free-day" ? '4px solid #4caf50' : `4px solid black`;

export function DisplayEventTableRow({ event, id }: Props) {
    const key = "event-" + event.type + id

    return (
        <TableRow
            key={key}
            hover
            sx={{
                borderLeft: borderLeft(event),
                backgroundColor: backgroundColor(event),
                border: border(event),
            }}
        >
            <TableCell>{formatDate(event.date)}</TableCell>
            <TableCell>{formatWeekday(event.startDate)}</TableCell>
            <TableCell>{formatTime(event.startDate)}</TableCell>
            <TableCell>{formatTime(event.endDate)}</TableCell>
            <TableCell>{event.summary}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                    <CalendarChipList calendars={event.calendars} />
                    {event.calendars.map((calendar, idx) => (
                        <CalendarChip label={calendar.name} color={calendar.color} />
                    ))
                    }
                    {event.status != "ok" && (
                        <WarningBox />
                    )}
                </Box>
            </TableCell>
        </TableRow>
    )

}
