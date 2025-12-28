import { useState } from 'react';
import { Typography, Box, Button, Chip, Stack, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// TODO #6: Implement calendar visibility toggle - Use CalendarType.visible property to filter calendars from display
// import VisibleIcon from "@mui/icons-material/Visibility";
// import VisibleOffIcon from "@mui/icons-material/VisibilityOff"


import type { CalendarType } from "./../hooks/useCalendars";

export interface Props {
    calendars: CalendarType[]
    onUpdateCalendar: (name: string, updatedCalendar: CalendarType) => (void)
    onDeleteCalendar: (name: string) => (void)
}

export function CalendarBox({ calendars, onUpdateCalendar, onDeleteCalendar }: Props) {
    const [editingCalendar, setEditingCalendar] = useState<string | null>(null);
    const [newCalendarName, setNewCalendarName] = useState('');
    const handleSaveCalendarName = (oldName: string, newName: string) => {
        const next = newName.trim();
        if (!next || next === oldName) { setEditingCalendar(null); return; }
        if (calendars.some(c => c.name === next)) { setEditingCalendar(null); return; }

        const calendar = calendars.find(cal => cal.name === oldName);
        if (calendar) {
            const updatedCalendar = {
                ...calendar,
                name: next,
                events: calendar.events.map(event => ({ ...event, calendarName: next }))
            };
            onUpdateCalendar(oldName, updatedCalendar);
        }
        setEditingCalendar(null);
    };
    const handleEditCalendar = (calendarName: string) => {
        setEditingCalendar(calendarName);
        setNewCalendarName(calendarName);
    };

    return (
        calendars.length > 0 && (
            <Box mt={4}>
                <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>Kalendrar</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                    {calendars.map((cal) => (
                        <Box key={cal.id} sx={{ m: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {editingCalendar === cal.name ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <TextField
                                        autoFocus
                                        value={newCalendarName}
                                        onChange={(e) => setNewCalendarName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveCalendarName(cal.name, newCalendarName);
                                            if (e.key === 'Escape') setEditingCalendar(null);
                                        }}
                                        size="small"
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', color: 'black' } }}
                                    />
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleSaveCalendarName(cal.name, newCalendarName)}
                                        sx={{ minWidth: 'auto', px: 1 }}
                                    >
                                        Spara
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => setEditingCalendar(null)}
                                        sx={{ minWidth: 'auto', px: 1 }}
                                    >
                                        Avbryt
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <Chip
                                        label={cal.name}
                                        onDelete={() => onDeleteCalendar(cal.name)}
                                        deleteIcon={<DeleteIcon />}
                                        sx={{
                                            backgroundColor: cal.color,
                                            color: 'white',
                                            '& .MuiChip-deleteIcon': {
                                                color: 'white',
                                                '&:hover': {
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                },
                                            },
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEditCalendar(cal.name)}
                                        sx={{
                                            color: cal.color,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                            }
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>)

    )
}