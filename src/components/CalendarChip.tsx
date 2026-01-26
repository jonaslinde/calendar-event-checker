import { Chip } from "@mui/material";

export interface Props {
    label: string;
    color: string;
}

export function CalendarChip({ label, color }: Props) {
    const isWhite = color.toLowerCase() === "#ffffff";
    const textColor = isWhite ? "#000000" : "#ffffff";
    const borderColor = isWhite ? "#cfcfcf" : color;

    return (
        <Chip
            component="span"
            label={label}
            size="small"
            sx={{
                backgroundColor: color,
                color: textColor,
                border: `1px solid ${borderColor}`,
            }}
        />
    )
}
