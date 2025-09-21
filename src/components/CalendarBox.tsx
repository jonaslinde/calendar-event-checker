import { useState } from 'react';
import { Typography, Box, Button, Chip, Stack, TextField, IconButton } from '@mui/material';
import { useCalendars } from './../hooks/useCalendars';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// Todo implement visibility, i.e. to be included or not in the displayed list of events
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
        if (newName.trim() && newName !== oldName) {
            const calendar = calendars.find(cal => cal.name === oldName);
            if (calendar) {
                const updatedCalendar = {
                    ...calendar,
                    name: newName.trim(),
                    events: calendar.events.map(event => ({
                        ...event,
                        calendarName: newName.trim()
                    }))
                };
                onUpdateCalendar(oldName, updatedCalendar);
            }
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
                        <Box key={cal.name} sx={{ m: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {editingCalendar === cal.name ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <TextField
                                        value={newCalendarName}
                                        onChange={(e) => setNewCalendarName(e.target.value)}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'white',
                                                color: 'black',
                                            }
                                        }}
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