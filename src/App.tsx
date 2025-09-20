import React, { useState } from 'react';
import { Container, Typography, Box, Button, Input, Paper, List, ListItem, ListItemText, Divider, Chip, Stack, TextField, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// Visibility & VisibilityOff
import EditIcon from '@mui/icons-material/Edit';
import { useCalendars } from './hooks/useCalendars';
import type { CalendarType, CalendarEventType } from './hooks/useCalendars';

import { useDisplayEvents } from './hooks/useDisplayEvents';
import type { DisplayEvent, DisplayEventSortOrder, DisplayEventSortField, DisplayEventType, DisplayEventStatus } from './hooks/useDisplayEvents'
import { useIcsUrls } from "./hooks/useIcsUrls";

import { formatDate, formatTime } from './utils/dateStringHelpers';

import { CalendarChip } from "./components/CalendarChip";
import { WarningBox } from "./components/WarningBox";
import { AddCalendars } from "./components/AddCalenders";

function App() {
  const { 
    calendars, 
    error, 
    addCalendarFromIcs, 
    removeCalendar,
    updateCalendar,
    getCalendarColor
  } = useCalendars();
  const {
    onlyConflictingEvents,
    findConflictingEvents,
    getFreeDays,
    mergeByKey,
    setEventStatuses
  } = useDisplayEvents();
  const {
    addToRecentUrls,
    urls
  } = useIcsUrls();


  const [icsText, setIcsText] = useState('');
  const [icsUrl, setIcsUrl] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [viewTabValue, setViewTabValue] = useState(0);

  const defaultSortOrder: DisplayEventSortOrder = "asc"
  const [sortOrder, setSortOrder] = useState<DisplayEventSortOrder>(defaultSortOrder);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  const defaultortField: DisplayEventSortField = "day"
  const [tableSortField, setTableSortField] = useState<DisplayEventSortField>(defaultortField);

  const [showFreeWeekdays, setshowFreeWeekdays] = useState(false);
  const [showFreeHolidays, setshowFreeHolidays] = useState(false);
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);
  const [mergeDuplicates, setMergeDuplicates] = useState(false);

  // const [recentUrls, setRecentUrls] = useState<string[]>([]);
  const [editingCalendar, setEditingCalendar] = useState<string | null>(null);
  const [newCalendarName, setNewCalendarName] = useState('');

  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const text = await file.text();
  //     addCalendarFromIcs(text, file.name);
  //   }
  //   event.target.value = '';
  // };
  // const handleSelectedUrlChange = (event: SelectChangeEvent<string>) => {
  //   const selectedUrl = event.target.value;
  //   setIcsUrl(selectedUrl);
  // };
  // const handleIcsTextSubmit = () => {
  //   console.log("handleIcsTextSubmit")
  //   if (icsText.trim()) {
  //     addCalendarFromIcs(icsText, 'Manuell kalender');
  //     setIcsText('');
  //   }
  // };

  // const handleUrlSubmit = async () => {
  //   if (icsUrl.trim()) {
  //     try {
  //       let response;
        
  //       // Försök först direkt fetch
  //       try {
  //         response = await fetch(icsUrl, {
  //           method: 'GET',
  //           headers: {
  //             'Accept': 'text/calendar, text/plain, */*',
  //           },
  //           mode: 'cors',
  //         });
  //       } catch (corsError) {
  //         // Om CORS misslyckas, använd en CORS-proxy
  //         console.log('CORS-fel, försöker med proxy...');
  //         console.log(corsError)
  //         const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(icsUrl)}`;
  //         response = await fetch(proxyUrl);
  //       }

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
  //       }
        
  //       const text = await response.text();
  //       const urlParts = new URL(icsUrl);
  //       const fallbackName = urlParts.pathname.split('/').pop() || 'Nedladdad kalender';
  //       addCalendarFromIcs(text, fallbackName);
        
  //       // Lägg till URL till senaste listan
  //       addToRecentUrls(icsUrl);
  //     } catch (err) {
  //       console.error('Fel vid nedladdning:', err);
  //       // Visa felmeddelandet till användaren
  //       if (err instanceof Error) {
  //         alert(`Fel vid nedladdning: ${err.message}`);
  //       } else {
  //         alert('Okänt fel vid nedladdning av kalendern');
  //       }
  //     }
  //   }
  // };

  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue);
  // };

  const handleViewTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue)
    if (newValue = 1)
      {setViewMode('table')}
    else 
      {setViewMode('list')}
  };

  const handleEditCalendar = (calendarName: string) => {
    setEditingCalendar(calendarName);
    setNewCalendarName(calendarName);
  };

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
        updateCalendar(oldName, updatedCalendar);
      }
    }
    setEditingCalendar(null);
  };

  const handleSortToggle = () => {
    if (sortOrder === 'none') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('none');
    }
  };

  const handleTableSort = (field: SortOrder) => {
    if (sortOrder === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setTableSortField(field);
      setSortOrder('asc');
    }
  };
  const toDisplayEvent = (calendarEvent: CalendarEventType): DisplayEvent => {
    const displayEventType: DisplayEventType = "event";
    const displayEventStatus: DisplayEventStatus = "ok";

    const displayEvent: DisplayEvent = {
      day: formatDate(calendarEvent.start),
      type: displayEventType,
      summary: calendarEvent.summary,
      description: calendarEvent.description,
      status: displayEventStatus,
      location: calendarEvent.location,
      start: formatTime(calendarEvent.start),
      end: formatTime(calendarEvent.end),
      calendarNames: [calendarEvent.calendarName],   // gör om till array
    }

    return displayEvent
  };

  const flattenAll = (calendars: CalendarType[]): DisplayEvent[] => calendars.flatMap(cal => cal.events.map(toDisplayEvent));

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
  if (viewMode === 'list' && sortOrder !== 'none') {
    allEvents = [...allEvents].sort((a, b) => {
      // Försök parsa datum från start-strängen
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      
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
          aValue = new Date(a.start);
          bValue = new Date(b.start);
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
          break;
        case 'start':
          aValue = new Date(a.start);
          bValue = new Date(b.start);
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
          break;
        case 'end':
          aValue = new Date(a.end);
          bValue = new Date(b.end);
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
console.log("same day: " +sameDayEventIndices )

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
    if (!(showFreeWeekdays||showFreeHolidays)) {
      return allEvents.map((event, idx) => ({
        type: 'event' as const,
        data: event,
        index: idx,
        isConflicting: conflictingEventIndices.includes(idx),
        isSameDay: sameDayEventIndices.includes(idx)
      }));
    }

    // Kombinera events och lediga dagar
    const combinedData = [];

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
        type: 'freeDay' as const,
        data: day,
        index: idx,
        isConflicting: false
      });
    });

    // Sortera kombinerad data efter datum
    return combinedData.sort((a, b) => {
      const dateA = a.type === 'event' ? new Date(a.data.start) : a.data;
      const dateB = b.type === 'event' ? new Date(b.data.start) : b.data;
      return dateA.getTime() - dateB.getTime();
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', py: 4 }}>
      <Container maxWidth="lg" disableGutters>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
            Kalenderhanterare
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
            Jämnför dina kalendrar, hitta krockar eller lediga tider
          </Typography>
          <AddCalendars onNewIcsText={addCalendarFromIcs} />
          
          {/* true && (
           <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 4 }}>
              <Tab label="Filuppladdning" />
              <Tab label="Klistra in text" />
              <Tab label="Ladda ner från länk" />
          </Tabs>
          
          ) */}

          {/* tabValue === 0 && ( // lägg till kalender genom att välj en fil
            <Box display="flex" flexDirection="column" alignItems="center" gap={3} sx={{ py: 2 }}>
              <Button variant="contained" component="label" size="large" sx={{ px: 4, py: 1.5 }}>
                Välj fil
                <Input
                  type="file"
                  inputProps={{ accept: '.ics,text/calendar' }}
                  onChange={handleFileChange}
                  sx={{ display: 'none' }}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" align="center">
                Välj en .ics-fil från din dator
              </Typography>
            </Box>
          ) */}

          {/*tabValue === 1 && ( // lägg till kalender genom att skriva eller klista in kalender/ics (och data från excel?!)
            <Box display="flex" flexDirection="column" gap={3} sx={{ py: 2 }}>
              <TextField
                multiline
                rows={10}
                placeholder="Klistra in .ics-innehåll här..."
                value={icsText}
                onChange={(e) => setIcsText(e.target.value)}
                variant="outlined"
                fullWidth
                label="ICS-innehåll"
              />
              <Button 
                variant="contained" 
                onClick={handleIcsTextSubmit}
                disabled={!icsText.trim()}
                fullWidth
                size="large"
                sx={{ py: 1.5 }}
              >
                Lägg till kalender
              </Button>
            </Box>
          ) */}

          {/* tabValue === 2 && ( // Lägg till kalender via url
            <Box display="flex" flexDirection="column" gap={3} sx={{ py: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Senaste länkar</InputLabel>
                  <Select
                    value=""
                    onChange={handleSelectedUrlChange}
                    label="Senaste länkar"
                  >
                    {urls.map((url, index) => (
                      <MenuItem key={index} value={url}>
                        <Box>
                          <Typography variant="body2" noWrap>
                            {url.length > 60 ? `${url.substring(0, 60)}...` : url}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              <TextField
                placeholder="https://example.com/calendar.ics"
                value={icsUrl}
                onChange={(e) => setIcsUrl(e.target.value)}
                variant="outlined"
                fullWidth
                label="Länk till kalender (URL)"
              />
              <Button 
                variant="contained" 
                onClick={handleUrlSubmit}
                disabled={!icsUrl.trim()}
                fullWidth
                size="large"
                sx={{ py: 1.5 }}
              >
                Ladda ner kalender
              </Button>
            </Box>
          )*/}

          {/* error && (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          ) */}
          
          {
            // Vy delen
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
                          onDelete={() => removeCalendar(cal.name)}
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
            </Box>
          )}
          {
            allEvents.length > 0 && (
            <Box mt={6}>
              <Tabs value={1} onChange={handleViewTabChange} centered sx={{ mb: 4 }}>
                <Tab label="Tabellvy" />
                <Tab label="Listvy" />
                <Tab label="Kalendervy" disabled/>
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
                  {allEvents.filter(ev => ev.status === "ok" > 0) && (
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
                <List>
                  {allEvents.map((event, idx) => {
                    const isConflicting = conflictingEventIndices.includes(idx);
                    return (
                    <React.Fragment key={idx}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{
                          borderLeft: `4px solid ${getCalendarColor(event.calendarNames[0])}`,
                          pl: 2,
                          mb: 1,
                          backgroundColor: isConflicting ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 0, 0, 0.02)',
                          borderRadius: 1,
                          border: isConflicting ? '2px solid #f44336' : 'none',
                          position: 'relative',
                        }}
                      >
                        {isConflicting && (
                          <WarningBox />
                        )}
                        <ListItemText
                          primary={event.summary}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">{event.start} - {event.end}</Typography><br />
                              {event.location && <><b>Plats:</b> {event.location}<br /></>}
                              {event.description && <><b>Beskrivning:</b> {event.description}<br /></>}
                              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                <>
                                  {event.calendarNames.map((calendarName, i) => (
                                    <CalendarChip calendarName={calendarName} key={i} color={getCalendarColor(calendarName)} />
                                  ))}
                                </>
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      {idx < allEvents.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                    );
                  })}
                </List>
              ) : (
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
                                borderLeft: `4px solid ${getCalendarColor(event.calendarNames[0])}`,
                                backgroundColor: item.isConflicting ? 'rgba(244, 67, 54, 0.1)' : 'inherit',
                                border: item.isConflicting ? '2px solid #f44336' : 'none',
                              }}
                            >
                              <TableCell>{formatDate(event.start)}</TableCell>
                              <TableCell>
                                {new Date(event.start).toLocaleDateString('sv-SE', { weekday: 'long' })}
                              </TableCell>
                              <TableCell>{formatTime(event.start)}</TableCell>
                              <TableCell>{formatTime(event.end)}</TableCell>
                              <TableCell>{event.summary}</TableCell>
                              <TableCell>{event.location || '-'}</TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                {event.calendarNames.map(name => (
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
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
