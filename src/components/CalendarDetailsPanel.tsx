import { Box, Button, Divider, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import type { CalendarType } from "../hooks/useCalendars";
import { CalendarEventForm } from "./CalendarEventForm";
import { CalendarEventsTable } from "./CalendarEventsTable";

export type CalendarDetailsPanelProps = {
  calendar: CalendarType;
  draftName: string;
  onDraftNameChange: (value: string) => void;
  onSaveCalendar: () => void;
  onClose: () => void;
  onColorChange: (value: string) => void;
  onToggleVisibility: () => void;
  addSummary: string;
  addStart: string;
  addEnd: string;
  onAddSummaryChange: (value: string) => void;
  onAddStartChange: (value: string) => void;
  onAddEndChange: (value: string) => void;
  onAddEvent: () => void;
  editingEventIndex: number | null;
  editSummary: string;
  editStart: string;
  editEnd: string;
  onEditEventStart: (index: number) => void;
  onEditSummaryChange: (value: string) => void;
  onEditStartChange: (value: string) => void;
  onEditEndChange: (value: string) => void;
  onSaveEvent: (index: number) => void;
  onDeleteEvent: (index: number) => void;
  formatDateTime: (value: Date) => string;
};

export function CalendarDetailsPanel({
  calendar,
  draftName,
  onDraftNameChange,
  onSaveCalendar,
  onClose,
  onColorChange,
  onToggleVisibility,
  addSummary,
  addStart,
  addEnd,
  onAddSummaryChange,
  onAddStartChange,
  onAddEndChange,
  onAddEvent,
  editingEventIndex,
  editSummary,
  editStart,
  editEnd,
  onEditEventStart,
  onEditSummaryChange,
  onEditStartChange,
  onEditEndChange,
  onSaveEvent,
  onDeleteEvent,
  formatDateTime,
}: CalendarDetailsPanelProps) {
  return (
    <Paper sx={{ mt: 3, p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6">Redigera kalender</Typography>
        <Box sx={{ flex: 1 }} />
        <Button variant="text" onClick={onClose}>
          Stäng
        </Button>
      </Stack>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Kalendernamn"
          value={draftName}
          onChange={(e) => onDraftNameChange(e.target.value)}
          fullWidth
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Färg"
            type="color"
            value={calendar.color}
            onChange={(e) => onColorChange(e.target.value)}
            inputProps={{ "aria-label": `Färg ${calendar.name}` }}
            sx={{ width: 120 }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Switch
              checked={calendar.visible}
              onChange={onToggleVisibility}
              inputProps={{ "aria-label": `Synlig ${calendar.name}` }}
            />
            <Typography variant="body2">Synlig</Typography>
          </Stack>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={onSaveCalendar}>
            Spara kalender
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Händelser
      </Typography>
      <CalendarEventForm
        summary={addSummary}
        start={addStart}
        end={addEnd}
        onSummaryChange={onAddSummaryChange}
        onStartChange={onAddStartChange}
        onEndChange={onAddEndChange}
        onAdd={onAddEvent}
      />
      <CalendarEventsTable
        events={calendar.events}
        editingEventIndex={editingEventIndex}
        editSummary={editSummary}
        editStart={editStart}
        editEnd={editEnd}
        onEditStart={onEditEventStart}
        onEditSummaryChange={onEditSummaryChange}
        onEditStartChange={onEditStartChange}
        onEditEndChange={onEditEndChange}
        onSaveEvent={onSaveEvent}
        onDeleteEvent={onDeleteEvent}
        formatDateTime={formatDateTime}
      />
    </Paper>
  );
}
