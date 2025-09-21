import type { CalendarType } from "./../hooks/useCalendars";
import { CalendarChip } from "./CalendarChip";

export type Props = {
    calendars: CalendarType[]
}
export function CalendarChipList({ calendars }: Props) {
    return (
        <>
            {calendars.map((calendar, idx) => (
                <CalendarChip label={calendar.name} color={calendar.color} />
            ))
            }
        </>
    );
}
