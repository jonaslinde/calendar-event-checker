import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import type { CalendarEventType } from "../hooks/useCalendars";

export type CalendarEventsTableProps = {
  events: CalendarEventType[];
  editingEventIndex: number | null;
  editSummary: string;
  editStart: string;
  editEnd: string;
  onEditStart: (eventIndex: number) => void;
  onEditSummaryChange: (value: string) => void;
  onEditStartChange: (value: string) => void;
  onEditEndChange: (value: string) => void;
  onSaveEvent: (eventIndex: number) => void;
  onDeleteEvent: (eventIndex: number) => void;
  formatDateTime: (value: Date) => string;
};

export function CalendarEventsTable({
  events,
  editingEventIndex,
  editSummary,
  editStart,
  editEnd,
  onEditStart,
  onEditSummaryChange,
  onEditStartChange,
  onEditEndChange,
  onSaveEvent,
  onDeleteEvent,
  formatDateTime,
}: CalendarEventsTableProps) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Namn</TableCell>
          <TableCell>Start</TableCell>
          <TableCell>Slut</TableCell>
          <TableCell>Åtgärder</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((event, idx) => {
          const isEditing = editingEventIndex === idx;
          return (
            <TableRow key={`${event.summary}-${idx}`}>
              <TableCell>
                {isEditing ? (
                  <TextField
                    value={editSummary}
                    onChange={(e) => onEditSummaryChange(e.target.value)}
                    size="small"
                  />
                ) : (
                  event.summary
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <TextField
                    type="datetime-local"
                    value={editStart}
                    onChange={(e) => onEditStartChange(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  formatDateTime(event.start)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <TextField
                    type="datetime-local"
                    value={editEnd}
                    onChange={(e) => onEditEndChange(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  formatDateTime(event.end)
                )}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {isEditing ? (
                    <Button size="small" variant="contained" onClick={() => onSaveEvent(idx)}>
                      Spara
                    </Button>
                  ) : (
                    <Button size="small" variant="outlined" onClick={() => onEditStart(idx)}>
                      Redigera
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() => onDeleteEvent(idx)}
                    aria-label={`Ta bort ${event.summary}`}
                  >
                    Ta bort
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
