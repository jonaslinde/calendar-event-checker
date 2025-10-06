import { Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { DisplayEventTableRow } from "./DisplayEventTableRow";

import type { DisplayEvent, DisplayEventSortOrder, DisplayEventSortField } from "../hooks/useDisplayEvents"

export type Props = {
    events: DisplayEvent[],
    sortOrder: DisplayEventSortOrder,
    sortField: DisplayEventSortField,
    onSort: (field: DisplayEventSortField, order: DisplayEventSortOrder) => void;
}

export function DisplayEventTable({ events, onSort, sortField, sortOrder }: Props) {

    const handleTableSortClick = (field: DisplayEventSortField, order: DisplayEventSortOrder) => {
        const newOrder: DisplayEventSortOrder = (order === "asc") ? "desc" : "asc"
        onSort(field, newOrder);
    };

    function getDirection(field: DisplayEventSortField = "start"): DisplayEventSortOrder {
        return field === sortField ? sortOrder : "asc"
    }

    function isActiveSortField(field: DisplayEventSortField): boolean {
        return field === sortField;
    }

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: '70vh' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("start")}
                                direction={getDirection("start")}
                                onClick={() => handleTableSortClick("start", sortOrder)}
                            >Datum</TableSortLabel>
                        </TableCell>
                        <TableCell>Veckodag</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("start")}
                                direction={getDirection('start')}
                                onClick={() => handleTableSortClick('start', sortOrder)}
                            >Starttid</TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("end")}
                                direction={getDirection('end')}
                                onClick={() => handleTableSortClick('end', sortOrder)}
                            >Sluttid</TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("summary")}
                                direction={getDirection('summary')}
                                onClick={() => handleTableSortClick('summary', sortOrder)}
                            >Beskrivning</TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={isActiveSortField("location")}
                                direction={getDirection('location')}
                                onClick={() => handleTableSortClick('location', sortOrder)}
                            >Plats</TableSortLabel>
                        </TableCell>
                        <TableCell>Kalender</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, idx) => (<DisplayEventTableRow event={event} id={`event-${idx}`} key={`event-${idx}`} />))}
                </TableBody>
            </Table>
        </TableContainer >
    );
}