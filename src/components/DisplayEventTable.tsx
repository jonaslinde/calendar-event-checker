import { Container, Typography, Box, Button, Input, Paper, List, ListItem, ListItemText, Divider, Chip, Stack, TextField, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { WarningBox } from "./WarningBox";
import { DisplayEventTableRow } from "./DisplayEventTableRow";

import type { DisplayEvent, DisplayEventSortOrder, DisplayEventSortField } from "../hooks/useDisplayEvents"
import { CalendarChip } from './CalendarChip';

export type Props = {
    events: DisplayEvent[],
    sortOrder: DisplayEventSortOrder,
    sortField: DisplayEventSortField,
    onSortChange: (field: DisplayEventSortField, order: DisplayEventSortOrder) => void;
}

export function DisplayEventTable({ events, onSortChange, sortField, sortOrder }: Props) {

    const handleTableSortClick = (field: DisplayEventSortField, order: DisplayEventSortOrder) => {
        const newOrder: DisplayEventSortOrder = (order === "asc") ? "desc" : "asc"
        onSortChange(field, order);
    };

    function getDirection(field: DisplayEventSortField = "date"): DisplayEventSortOrder {
        return field === sortField ? sortOrder : "asc"
    }

    function isActiveSortField(field: DisplayEventSortField): boolean {
        return field === sortField;
    }

    console.log("Active sort field: " + sortField);
    console.log("Active sort order: " + sortOrder);

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: '70vh' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("date")}
                                direction={getDirection("date")}
                                onClick={() => handleTableSortClick("date", sortOrder)}
                            >
                                Datum
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Veckodag</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("start")}
                                direction={getDirection('start')}
                                onClick={() => handleTableSortClick('start', sortOrder)}
                            >
                                Starttid
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("end")}
                                direction={getDirection('end')}
                                onClick={() => handleTableSortClick('end', sortOrder)}
                            >
                                Sluttid
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("summary")}
                                direction={getDirection('summary')}
                                onClick={() => handleTableSortClick('summary', sortOrder)}
                            >
                                Beskrivning
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("location")}
                                direction={getDirection('location')}
                                onClick={() => handleTableSortClick('location', sortOrder)}
                            >
                                Plats
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Kalender</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, idx) => {
                        if (event.type === 'event') {
                            return (
                                <>
                                    <DisplayEventTableRow event={event} id={`event-${idx}`} />
                                </>
                            );
                        } else {
                            // Ledig dag
                            const day = event.date;
                            return (
                                <TableRow
                                    key={`freeday-${idx}`}
                                    hover
                                    sx={{
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        borderLeft: '4px solid #4caf50',
                                    }}
                                >
                                    <TableCell>{event.date}</TableCell>
                                    <TableCell>{event.weekday}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>{event.summary}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Ledig"
                                            size="small"
                                            sx={{
                                                backgroundColor: '#4caf50',
                                                color: 'white',
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer >
    );
}