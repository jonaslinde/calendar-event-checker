import { Chip } from "@mui/material";

export interface CalendarChipsProps {
    calendarName: string;
    color: string;
    key: string;
  }

export function CalendarChip({ calendarName, color, key = "cal" }: CalendarChipsProps) {
    return (
        <Chip 
            key={key}
            label={calendarName} 
            size="small" 
            sx={{ 
            backgroundColor: color,
            color: 'white',
            }} 
        />
    )
}