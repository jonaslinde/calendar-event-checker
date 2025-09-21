import React from 'react';
import { Typography, Box, ListItem, ListItemText, Divider } from '@mui/material';
import { WarningBox } from "./WarningBox";
import { CalendarChipList } from "./CalendarChipList";
import { CalendarChip } from "./CalendarChip";
import { formatDate, formatTime } from "./../utils/dateStringHelpers";
import type { DisplayEvent } from "../hooks/useDisplayEvents"


export type Props = {
    event: DisplayEvent,
    id: number,
    color: string,
    divider: boolean
}
export function DisplayEventItem({ event, id, color, divider = false }: Props) {
    const borderLeft = `4px solid ${color}`;
    const backgroundColor = event.status != "ok" ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 0, 0, 0.02)';
    const border = event.status != "ok" ? '2px solid #f44336' : 'none'
    return (
        <React.Fragment key={id}>
            <ListItem
                key={'event-' + id}
                alignItems="flex-start"
                sx={{
                    borderLeft: borderLeft,
                    pl: 2,
                    mb: 1,
                    backgroundColor: backgroundColor,
                    borderRadius: 1,
                    border: border,
                    position: 'relative',
                }}
            >
                {event.status != "ok" && (
                    <WarningBox />
                )}
                <ListItemText
                    primary={event.summary}
                    secondary={
                        <>
                            <Typography component="span" variant="body2">
                                {formatDate(event.startDate)} {formatTime(event.startDate)} - {formatDate(event.endDate)} {formatTime(event.endDate)}
                            </Typography><br />
                            {event.location && <><b>Plats:</b> {event.location}<br /></>}
                            {event.description && <><b>Beskrivning:</b> {event.description}<br /></>}
                            <Box component="span" sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                <CalendarChipList calendars={event.calendars} key={'calListItem-' + id} />
                            </Box>
                        </>
                    }
                />
            </ListItem>
            {divider && <Divider component="li" />}
        </React.Fragment>

    );
}
