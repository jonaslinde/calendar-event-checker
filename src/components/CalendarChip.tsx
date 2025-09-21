import { Chip } from "@mui/material";

export interface Props {
    label: string;
    color: string;
}

export function CalendarChip({ label, color }: Props) {
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                backgroundColor: color,
                color: 'white',
            }}
        />
    )
}