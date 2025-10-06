import { Box, TableCell, TableRow } from '@mui/material';
import { WarningBox } from "./WarningBox";
import { formatDate, formatTime, formatWeekday } from "./../utils/dateStringHelpers";
import { CalendarChipList } from "./CalendarChipList";

import type { DisplayEvent, DisplayEventType } from "../hooks/useDisplayEvents"

export type Props = {
    event: DisplayEvent,
    id: string
}

const backgroundColor = (event: DisplayEvent) => (event.type != "event") ? 'rgba(76, 175, 80, 0.1)' : event.status != "ok" ? 'rgba(244, 67, 54, 0.1)' : 'inherit';
const border = (event: DisplayEvent) => event.status != "ok" ? '2px solid #f44336' : 'none';
const borderLeft = (event: DisplayEvent) => event.type == "free-day" ? '4px solid #4caf50' : `4px solid black`;

export function DisplayEventTableRow({ event }: Props) {

    return (
        <TableRow
            hover
            sx={{
                borderLeft: borderLeft(event),
                backgroundColor: backgroundColor(event),
                border: border(event)
            }}
        >
            <TableCell>{formatDate(event.start)}</TableCell>
            <TableCell>{formatWeekday(event.start)}</TableCell>
            <TableCell>{formatTime(event.start)}</TableCell>
            <TableCell>{formatTime(event.end)}</TableCell>
            <TableCell>{event.summary}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                    {(event.type === 'event') ?
                        (
                            <>
                                <CalendarChipList calendars={event.calendars} />
                                {event.status != "ok" && (
                                    <WarningBox />
                                )}
                            </>
                        )
                        :
                        (
                            <Chip
                                label="Ledig"
                                size="small"
                                sx={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                }}
                            />
                        )
                    }
                </Box>
            </TableCell>
        </TableRow>
    )
}
