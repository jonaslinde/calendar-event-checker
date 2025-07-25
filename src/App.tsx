import React, { useState } from 'react';
import { Container, Typography, Box, Button, Input, Paper, List, ListItem, ListItemText, Divider, Chip, Stack } from '@mui/material';
import ical from 'ical.js';
import DeleteIcon from '@mui/icons-material/Delete';

// Typ för kalenderhändelse
interface EventType {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
  calendarName: string;
}

interface CalendarFile {
  name: string; // Visningsnamn för kalendern
  events: EventType[];
}

function App() {
  const [calendars, setCalendars] = useState<CalendarFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      try {
        const text = await file.text();
        const jcalData = ical.parse(text);
        const comp = new ical.Component(jcalData);
        // Hämta kalendernamn från VCALENDAR (X-WR-CALNAME eller NAME)
        let calName = comp.getFirstPropertyValue('x-wr-calname') || comp.getFirstPropertyValue('name') || file.name;
        if (typeof calName !== 'string') calName = file.name;
        // ical.js saknar TS-typer för getAllSubcomponents, därför any[]
        const vevents = comp.getAllSubcomponents('vevent') as any[];
        const parsedEvents: EventType[] = vevents.map((vevent) => {
          const e = new ical.Event(vevent);
          return {
            summary: e.summary,
            description: e.description,
            location: e.location,
            start: e.startDate ? e.startDate.toString() : '',
            end: e.endDate ? e.endDate.toString() : '',
            calendarName: calName,
          };
        });
        setCalendars((prev) => [...prev, { name: calName, events: parsedEvents }]);
      } catch {
        setError('Kunde inte läsa/parsa filen. Kontrollera att det är en giltig .ics-fil.');
      }
    }
    // Återställ input så att samma fil kan laddas upp igen om man vill
    event.target.value = '';
  };

  const handleRemoveCalendar = (name: string) => {
    setCalendars((prev) => prev.filter((cal) => cal.name !== name));
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
                    onDelete={() => handleRemoveCalendar(cal.name)}
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
