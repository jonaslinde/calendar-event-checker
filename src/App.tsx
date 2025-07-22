import React, { useState } from 'react';
import { Container, Typography, Box, Button, Input, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import ical from 'ical.js';

// Typ för kalenderhändelse
interface EventType {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
}

function App() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError(null);
      try {
        const text = await file.text();
        const jcalData = ical.parse(text);
        const comp = new ical.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent') as any[];
        const parsedEvents: EventType[] = vevents.map((vevent) => {
          const e = new ical.Event(vevent);
          return {
            summary: e.summary,
            description: e.description,
            location: e.location,
            start: e.startDate ? e.startDate.toString() : '',
            end: e.endDate ? e.endDate.toString() : '',
          };
        });
        setEvents(parsedEvents);
      } catch {
        setError('Kunde inte läsa/parsa filen. Kontrollera att det är en giltig .ics-fil.');
        setEvents([]);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm" disableGutters>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Ladda upp kalender (.ics)
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
            {fileName && (
              <Typography variant="body1">Vald fil: {fileName}</Typography>
            )}
            {error && (
              <Typography color="error">{error}</Typography>
            )}
          </Box>
          {events.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom align="center">Händelser i kalendern:</Typography>
              <List>
                {events.map((event, idx) => (
                  <React.Fragment key={idx}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={event.summary}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">{event.start} - {event.end}</Typography><br />
                            {event.location && <><b>Plats:</b> {event.location}<br /></>}
                            {event.description && <><b>Beskrivning:</b> {event.description}</>}
                          </>
                        }
                      />
                    </ListItem>
                    {idx < events.length - 1 && <Divider component="li" />}
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
