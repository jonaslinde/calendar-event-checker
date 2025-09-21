import React, { useState } from 'react';
import { Container, Typography, Box, Button, Paper, Chip, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, FormControlLabel, Checkbox } from '@mui/material';
import { useCalendars } from './hooks/useCalendars';
import type { CalendarType, CalendarEventType } from './hooks/useCalendars';

import { useDisplayEvents } from './hooks/useDisplayEvents';
import type { DisplayEvent, DisplayEventSortOrder, DisplayEventSortField, DisplayEventType, DisplayEventStatus, DisplayCalendar } from './hooks/useDisplayEvents'

import { formatDate, formatTime, formatWeekday } from './utils/dateStringHelpers';

import { WarningBox } from "./components/WarningBox";
import { AddCalendars } from "./components/AddCalenders";
import { CalendarBox } from "./components/CalendarBox";
import { DisplayEventTable } from "./components/DisplayEventTable";
import { DisplayEventList } from "./components/DisplayEventList";

function App() {
  const {
    calendars,
    addCalendarFromIcs,
    removeCalendar,
    updateCalendar,
    getCalendarColor
  } = useCalendars();
  const {
    findConflictingEvents,
    getFreeDays,
    mergeByKey,
    setEventStatuses
  } = useDisplayEvents();

  type ViewModeType = "list" | "table" | "calendar";
  const [sortOrder, setSortOrder] = useState<DisplayEventSortOrder>("asc");
  const [viewMode, setViewMode] = useState<ViewModeType>('list');

  const [tableSortField, setTableSortField] = useState<DisplayEventSortField>("date");

  const [showFreeWeekdays, setshowFreeWeekdays] = useState(false);
  const [showFreeHolidays, setshowFreeHolidays] = useState(false);
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);
  const [mergeDuplicates, setMergeDuplicates] = useState(false);

  const handleViewTabChange = (_: React.SyntheticEvent, newValue: number) => {
    console.log(newValue)
    if (newValue == 1) { setViewMode('table') }
    else { setViewMode('list') }
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleTableSort = (field: DisplayEventSortField) => {
    if (tableSortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setTableSortField(field);
      setSortOrder('asc');
    }
  };
  const toDisplayEvent = (calendarEvent: CalendarEventType, calendar: CalendarType): DisplayEvent => {
    const displayEventType: DisplayEventType = "event";
    const displayEventStatus: DisplayEventStatus = "ok";

    const displayCalendar: DisplayCalendar = {
      name: calendar.name,
      color: calendar.color
    }

    const displayEvent: DisplayEvent = {
      date: calendarEvent.start,
      type: displayEventType,
      weekday: formatWeekday(calendarEvent.start),
      summary: calendarEvent.summary,
      description: calendarEvent.description,
      status: displayEventStatus,
      location: calendarEvent.location,
      startDate: calendarEvent.start,
      endDate: calendarEvent.end,
      calendars: [displayCalendar],   // gör om till array
    }

    return displayEvent
  };

  const flattenAll = (calendars: CalendarType[]): DisplayEvent[] => calendars.flatMap(cal => cal.events.map((event) => toDisplayEvent(event, cal)));

  // Slå ihop alla events från alla kalendrar
  //Flatten calendars
  let allEvents: DisplayEvent[] = flattenAll(calendars)
  allEvents = setEventStatuses(allEvents)
  //Merge events (if enabled)
  if (mergeDuplicates) {
    console.log("merging...")
    allEvents = mergeByKey(allEvents)
  }


  //Add free weekdays (if enabled)
  //Add free hollidays (if enabled)
  //Sort by date & time

  // Sortera events baserat på vald sortering
  if (viewMode === 'list') {
    allEvents = [...allEvents].sort((a, b) => {
      // Försök parsa datum från start-strängen
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      // Om datum inte kan parsas, använd summary som fallback
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return sortOrder === 'asc' ? a.summary.localeCompare(b.summary) : b.summary.localeCompare(a.summary);
      }

      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  } else if (viewMode === 'table' && tableSortField) {
    allEvents = [...allEvents].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (tableSortField) {
        case 'date':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
          break;
        case 'start':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
          break;
        case 'end':
          aValue = new Date(a.endDate);
          bValue = new Date(b.endDate);
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
          break;
        case 'summary':
          aValue = a.summary || '';
          bValue = b.summary || '';
          break;
        case 'location':
          aValue = a.location || '';
          bValue = b.location || '';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });
  }

  // Hitta konflikter EFTER sortering
  const { conflictingEventIndices, sameDayEventIndices } = findConflictingEvents(allEvents);
  console.log("conflicts: " + conflictingEventIndices)
  console.log("same day: " + sameDayEventIndices)

  if (showConflictsOnly) {

    console.log("showing only conflicts")
    console.log("All events used to be " + allEvents.length)
    allEvents = allEvents.filter(ev => ev.status === "conflict");
    console.log("All events are now " + allEvents.length)
  }
  // Hitta lediga dagar
  const freeDays = getFreeDays(allEvents, showFreeHolidays, showFreeWeekdays);

  // Kombinera events och lediga dagar för tabellvyn
  const getTableData = () => {
    if (!(showFreeWeekdays || showFreeHolidays)) {
      return allEvents.map((event, idx) => ({
        type: 'event' as const,
        data: event,
        index: idx,
        isConflicting: conflictingEventIndices.includes(idx),
        isSameDay: sameDayEventIndices.includes(idx)
      }));
    }

    // Kombinera events och lediga dagar
    const combinedData: DisplayEvent[] = [];

    // Lägg till events
    allEvents.forEach((event, idx) => {
      combinedData.push({
        type: 'event' as const,
        data: event,
        index: idx,
        isConflicting: conflictingEventIndices.includes(idx),
        hasSameDayEvent: false
      });
    });

    // Lägg till lediga dagar
    freeDays.forEach((day, idx) => {
      combinedData.push({
        type: 'free-day' as const,
        data: day,
        index: idx,
        isConflicting: false
      });
    });

    // Sortera kombinerad data efter datum
    return combinedData.sort((a, b) => {
      const dateA = a.type === 'event' ? new Date(a.startDate) : a;
      const dateB = b.type === 'event' ? new Date(b.startDate) : b;
      return dateA.getTime() - dateB.getTime();
    });
  };

  const viewToIndex = (mode: ViewModeType): number => (mode === "list") ? 0 : (mode === "table") ? 1 : 2
  const indexToView = (idx: number): ViewModeType => (idx === 0) ? "list" : (idx === 1) ? "table" : "calendar";
  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', py: 4 }}>
      <Container maxWidth="lg" disableGutters>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Kalenderhanterare
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
            Jämnför dina kalendrar, hitta krockar eller lediga tider
          </Typography>
          <AddCalendars onNewIcsText={addCalendarFromIcs} />
          <CalendarBox calendars={calendars} onDeleteCalendar={removeCalendar} onUpdateCalendar={updateCalendar} />
          {
            allEvents.length > 0 && (
              <Box mt={6}>
                <Tabs value={viewToIndex(viewMode)} onChange={(_, idx) => setViewMode(indexToView(idx))} centered sx={{ mb: 4 }}>
                  <Tab label="Tabellvy" />
                  <Tab label="Listvy" />
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
                    {allEvents.filter(ev => ev.status === "conflict").length > 0 && (
                      <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                        ⚠️ {allEvents.filter(ev => ev.status === "conflict").length} händelse(er) spelas samma tid och dag!
                      </Typography>
                    )}
                    {allEvents.filter(ev => ev.status === "same-day").length > 0 && (
                      <Typography variant="body2" color="warning" sx={{ mt: 0.5 }}>
                        ⚠️ {allEvents.filter(ev => ev.status === "same-day").length} händelse(er) spelas samma dag men inte samma tid!
                      </Typography>
                    )}
                    {allEvents.filter(ev => ev.status === "ok") && (
                      <Typography variant="body2" color="info" sx={{ mt: 0.5 }}>
                        {allEvents.filter(ev => ev.status === "ok").length} händelse(er) är ok!
                      </Typography>
                    )}
                    <Typography variant="body2" color="info" sx={{ mt: 0.5 }}>
                      Totalt {allEvents.length} händelse(er).
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
                        onClick={handleSortToggle}
                      >
                        {sortOrder === 'none' && 'Sortera'}
                        {sortOrder === 'asc' && '↑ Tidigast först'}
                        {sortOrder === 'desc' && '↓ Senast först'}
                      </Button>
                    )}
                  </Box>
                </Box>

                {viewMode === 'list' ? (
                  <DisplayEventList events={allEvents} />
                ) : (
                  <>
                    <DisplayEventTable events={allEvents} sortField={tableSortField} sortOrder={sortOrder} onSortChange={() => handleTableSort('date')} />
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: '70vh' }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <TableSortLabel
                                active={tableSortField === 'date'}
                                direction={tableSortField === 'date' ? sortOrder : 'asc'}
                                onClick={() => handleTableSort('date')}
                              >
                                Datum
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>Veckodag</TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={tableSortField === 'start'}
                                direction={tableSortField === 'start' ? sortOrder : 'asc'}
                                onClick={() => handleTableSort('start')}
                              >
                                Starttid
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={tableSortField === 'end'}
                                direction={tableSortField === 'end' ? sortOrder : 'asc'}
                                onClick={() => handleTableSort('end')}
                              >
                                Sluttid
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={tableSortField === 'summary'}
                                direction={tableSortField === 'summary' ? sortOrder : 'asc'}
                                onClick={() => handleTableSort('summary')}
                              >
                                Beskrivning
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={tableSortField === 'location'}
                                direction={tableSortField === 'location' ? sortOrder : 'asc'}
                                onClick={() => handleTableSort('location')}
                              >
                                Plats
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>Kalender</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getTableData().map((item, idx) => {
                            if (item.type === 'event') {
                              const event: DisplayEvent = item.data;
                              return (
                                <TableRow
                                  key={`event-${item.index}`}
                                  hover
                                  sx={{
                                    borderLeft: `4px solid ${getCalendarColor(event.calendars[0])}`,
                                    backgroundColor: item.isConflicting ? 'rgba(244, 67, 54, 0.1)' : 'inherit',
                                    border: item.isConflicting ? '2px solid #f44336' : 'none',
                                  }}
                                >
                                  <TableCell>{formatDate(event.startDate)}</TableCell>
                                  <TableCell>
                                    {new Date(event.startDate).toLocaleDateString('sv-SE', { weekday: 'long' })}
                                  </TableCell>
                                  <TableCell>{formatTime(event.startDate)}</TableCell>
                                  <TableCell>{formatTime(event.endDate)}</TableCell>
                                  <TableCell>{event.summary}</TableCell>
                                  <TableCell>{event.location || '-'}</TableCell>
                                  <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      {event.calendars.map(name => (
                                        <Chip
                                          label={name}
                                          size="small"
                                          sx={{
                                            backgroundColor: getCalendarColor(name),
                                            color: 'white',
                                          }}
                                        />
                                      ))
                                      }
                                      {item.isConflicting && (
                                        <WarningBox />
                                      )}
                                    </Box>

                                  </TableCell>
                                </TableRow>
                              );
                            } else {
                              // Ledig dag
                              const day = item.data;
                              return (
                                <TableRow
                                  key={`freeday-${item.index}`}
                                  hover
                                  sx={{
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    borderLeft: '4px solid #4caf50',
                                  }}
                                >
                                  <TableCell>{formatDate(day.toISOString())}</TableCell>
                                  <TableCell>
                                    {day.toLocaleDateString('sv-SE', { weekday: 'long' })}
                                  </TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>Ledig dag</TableCell>
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
                    </TableContainer>
                  </>
                )}
              </Box>
            )
          }
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
