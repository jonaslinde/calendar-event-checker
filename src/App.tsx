import React from 'react';
import { Container, Typography, Box, Button, Input, Paper, List, ListItem, ListItemText, Divider, Chip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCalendars } from './hooks/useCalendars';

function App() {
  const { calendars, error, addCalendarFromIcs, removeCalendar } = useCalendars();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await file.text();
      addCalendarFromIcs(text, file.name);
    }
    event.target.value = '';
  };

  // Slå ihop alla events från alla kalendrar
  const allEvents = calendars.flatMap((cal) => cal.events);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm" disableGutters>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Ladda upp en eller flera kalendrar (.ics)
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Button variant="contained" component="label">
              Välj fil
              <Input
                type="file"
                inputProps={{ accept: '.ics,text/calendar' }}
                onChange={handleFileChange}
                sx={{ display: 'none' }}
              />
            </Button>
            {error && (
              <Typography color="error">{error}</Typography>
            )}
            {calendars.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                {calendars.map((cal) => (
                  <Chip
                    key={cal.name}
                    label={cal.name}
                    onDelete={() => removeCalendar(cal.name)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            )}
          </Box>
          {allEvents.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom align="center">Alla händelser:</Typography>
              <List>
                {allEvents.map((event, idx) => (
                  <React.Fragment key={idx}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={event.summary}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">{event.start} - {event.end}</Typography><br />
                            {event.location && <><b>Plats:</b> {event.location}<br /></>}
                            {event.description && <><b>Beskrivning:</b> {event.description}<br /></>}
                            <Chip label={event.calendarName} size="small" sx={{ mt: 1 }} />
                          </>
                        }
                      />
                    </ListItem>
                    {idx < allEvents.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
