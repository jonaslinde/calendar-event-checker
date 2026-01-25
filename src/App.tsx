import { useCallback } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

import type { CalendarType } from './hooks/useCalendars';

import { Calendars } from './components/Calendars';
import { DisplayEvents } from './components/DisplayEvents';
import { convertAll as toDisplayEvents } from './utils/convertToDisplayEvents';
import { useDisplayEvents } from './hooks/useDisplayEvents';
import type { DisplayEventStatus } from './hooks/useDisplayEvents';

function App() {
  const { displayEvents, setDisplayEvents, setShow, setMergeDuplicates } = useDisplayEvents();

  const handleCalendarsUpdate = useCallback(
    (calendars: CalendarType[]) => {
      const events = toDisplayEvents(calendars);
      setDisplayEvents(events);
    },
    [setDisplayEvents]
  );

  const handleShowChange = useCallback(
    (statuses: DisplayEventStatus[]) => {
      setShow(statuses);
    },
    [setShow]
  );

  const handleMergeDuplicates = (value: boolean) => {
    setMergeDuplicates(value);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Kalenderhanterare
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Jämför dina kalendrar, hitta krockar eller lediga tider
          </Typography>
          <Calendars onUpdate={handleCalendarsUpdate} />
          <DisplayEvents
            events={displayEvents}
            onShowChange={handleShowChange}
            onMergeChange={handleMergeDuplicates}
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
