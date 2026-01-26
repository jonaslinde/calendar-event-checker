import { Button, Stack, TextField } from "@mui/material";

export type CalendarEventFormProps = {
  summary: string;
  start: string;
  end: string;
  onSummaryChange: (value: string) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onAdd: () => void;
};

export function CalendarEventForm({
  summary,
  start,
  end,
  onSummaryChange,
  onStartChange,
  onEndChange,
  onAdd,
}: CalendarEventFormProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        label="Händelsenamn"
        value={summary}
        onChange={(e) => onSummaryChange(e.target.value)}
        fullWidth
      />
      <TextField
        label="Starttid"
        type="datetime-local"
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Sluttid"
        type="datetime-local"
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={onAdd}>
        Lägg till event
      </Button>
    </Stack>
  );
}
