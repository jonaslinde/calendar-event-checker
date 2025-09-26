import { useState } from 'react';
import { Typography, Box, Button, Tabs, Tab, FormControlLabel, Checkbox } from '@mui/material';
import { DisplayEventTable } from "./DisplayEventTable";
import { DisplayEventList } from "./DisplayEventList";

import type { DisplayEvent, DisplayEventSortField, DisplayEventSortOrder } from "./../hooks/useDisplayEvents";
type ViewModeType = "list" | "table" | "calendar";

export type Props = {
    events: DisplayEvent[]
}

export function DisplayEvents({ events }: Props) {
    const [viewMode, setViewMode] = useState<ViewModeType>('list');
    const [showFreeWeekdays, setshowFreeWeekdays] = useState(false);
    const [showFreeHolidays, setshowFreeHolidays] = useState(false);
    const [showConflictsOnly, setShowConflictsOnly] = useState(false);
    const [mergeDuplicates, setMergeDuplicates] = useState(false);
    const [tableSortField, setTableSortField] = useState<DisplayEventSortField>("date");
    const [sortOrder, setSortOrder] = useState<DisplayEventSortOrder>("asc");
    const viewToIndex = (mode: ViewModeType): number => (mode === "list") ? 0 : (mode === "table") ? 1 : 2
    const indexToView = (idx: number): ViewModeType => (idx === 0) ? "list" : (idx === 1) ? "table" : "calendar";

    const handleSort = (field: DisplayEventSortField) => {
        const newOrder: DisplayEventSortOrder = (sortOrder === "asc") ? "desc" : "asc"
        setSortOrder(newOrder);
        setTableSortField(field);
    };

    return (
        <>
            {events.length > 0 && (
                <Box mt={6}>
                    <Tabs value={viewToIndex(viewMode)} onChange={(_, idx) => setViewMode(indexToView(idx))} centered sx={{ mb: 4 }}>
                        <Tab label="Listvy" />
                        <Tab label="Tabellvy" />
                        <Tab label="Kalendervy" disabled />
                    </Tabs>
                    <Box alignItems="center">
                        <Button
                            variant={viewMode === 'list' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('list')}
                        >
                            Lista
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('table')}
                        >
                            Tabell
                        </Button>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box alignItems="center">
                            <Typography variant="h5">Alla händelser</Typography>
                            {events.filter(ev => ev.status === "conflict").length > 0 && (
                                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                                    ⚠️ {events.filter(ev => ev.status === "conflict").length} händelse(er) spelas samma tid och dag!
                                </Typography>
                            )}
                            {events.filter(ev => ev.status === "same-day").length > 0 && (
                                <Typography variant="body2" color="warning" sx={{ mt: 0.5 }}>
                                    ⚠️ {events.filter(ev => ev.status === "same-day").length} händelse(er) spelas samma dag men inte samma tid!
                                </Typography>
                            )}
                            {events.filter(ev => ev.status === "ok") && (
                                <Typography variant="body2" color="info" sx={{ mt: 0.5 }}>
                                    {events.filter(ev => ev.status === "ok").length} händelse(er) är ok!
                                </Typography>
                            )}
                            <Typography variant="body2" color="info" sx={{ mt: 0.5 }}>
                                Totalt {events.length} händelse(er).
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                            {viewMode === 'table' && (
                                <div>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showFreeWeekdays}
                                                onChange={(e) => setshowFreeWeekdays(e.target.checked)}
                                            />
                                        }
                                        label="Visa lediga vardagar"
                                        sx={{ ml: 1 }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showFreeHolidays}
                                                onChange={(e) => setshowFreeHolidays(e.target.checked)}
                                            />
                                        }
                                        label="Visa lediga helgdagar"
                                        sx={{ ml: 1 }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showConflictsOnly}
                                                onChange={(e) => setShowConflictsOnly(e.target.checked)}
                                            />
                                        }
                                        label="Visa bara konflikter"
                                        sx={{ ml: 1 }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={mergeDuplicates}
                                                onChange={(e) => setMergeDuplicates(e.target.checked)}
                                            />
                                        }
                                        label="Slå ihop dubbletter"
                                        sx={{ ml: 1 }}
                                    />
                                </div>

                            )}
                            {viewMode === 'list' && (
                                <Button
                                    variant="outlined"
                                    onClick={() => handleSort('date')}
                                >
                                    {sortOrder === 'asc' && 'Tidigast först'}
                                    {sortOrder === 'desc' && 'Senast först'}
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {viewMode === 'list' ? (
                        <DisplayEventList events={events} />
                    ) : (
                        <DisplayEventTable events={events} sortOrder={sortOrder} sortField={tableSortField} onSort={handleSort} />
                    )}
                </Box>
            )
            }
        </>
    );
}