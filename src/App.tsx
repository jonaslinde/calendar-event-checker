import { useState, useCallback } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

import type {
  CalendarType,
} from './hooks/useCalendars';

import { Calendars } from "./components/Calendars";
import { DisplayEvents } from "./components/DisplayEvents";
import { convertAll as toDisplayEvents } from "./utils/convertToDisplayEvents";
import { setEventStatuses } from './hooks/useDisplayEvents/utils';
import type { DisplayEvent } from './hooks/useDisplayEvents';

function App() {
  const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([])

  // TODO #1: Wire up conflict detection - Apply setEventStatuses to events
  // TODO #4: Fix event status assignment - Call setEventStatuses on events
  const handleCalendarsUpdate = useCallback((calendars: CalendarType[]) => {
    const events = toDisplayEvents(calendars);
    const withStatus = setEventStatuses(events);
    setDisplayEvents(withStatus);
  }, []);

  // TODO #1: Wire up conflict detection - Implement filtering logic when showConflictsOnly is true
  const handleShowConflictsOnly = useCallback((value: boolean) => {
    console.log(value);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', py: 4 }}>
      <Container maxWidth="lg" disableGutters>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Kalenderhanterare
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
            Jämför dina kalendrar, hitta krockar eller lediga tider
          </Typography>
          <Calendars onUpdate={handleCalendarsUpdate} />
          <DisplayEvents events={displayEvents} onShowConflictsOnly={handleShowConflictsOnly} />
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
