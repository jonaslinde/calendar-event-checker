import { Stack } from "@mui/material";
import { CalendarChip } from "./CalendarChip";

export type Props = {
    calendars: { name: string; color: string }[]
}
export function CalendarChipList({ calendars }: Props) {
    return (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {calendars.map((calendar, idx) => (
                <CalendarChip label={calendar.name} color={calendar.color} key={`${calendar.name}-${idx}`} />
            ))}
        </Stack>
    );
}
