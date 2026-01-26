import { Box, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CalendarChip } from "./CalendarChip";
import type { CalendarType } from "../hooks/useCalendars";

export type CalendarListProps = {
  calendars: CalendarType[];
  onToggleVisibility: (calendar: CalendarType) => void;
  onEdit: (calendar: CalendarType) => void;
  onDelete: (calendar: CalendarType) => void;
};

export function CalendarList({
  calendars,
  onToggleVisibility,
  onEdit,
  onDelete,
}: CalendarListProps) {
  return (
    <Stack spacing={2}>
      {calendars.map((cal) => (
        <Paper key={cal.id} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <CalendarChip label={cal.name} color={cal.color} />
          <Typography variant="body2" color="text.secondary">
            {cal.events.length} händelse(r)
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Tooltip title={cal.visible ? "Dölj kalender" : "Visa kalender"} arrow>
            <span>
              <IconButton
                size="small"
                aria-label={cal.visible ? `Dölj ${cal.name}` : `Visa ${cal.name}`}
                onClick={() => onToggleVisibility(cal)}
              >
                {cal.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redigera kalender" arrow>
            <span>
              <IconButton size="small" aria-label={`Redigera ${cal.name}`} onClick={() => onEdit(cal)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Ta bort kalender" arrow>
            <span>
              <IconButton size="small" aria-label={`Ta bort ${cal.name}`} onClick={() => onDelete(cal)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Paper>
      ))}
    </Stack>
  );
}
