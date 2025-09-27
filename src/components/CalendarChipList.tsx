import { CalendarChip } from "./CalendarChip";

export type Props = {
    calendars: { name: string; color: string }[]
}
export function CalendarChipList({ calendars }: Props) {
    return (
        <>
            {calendars.map((calendar, idx) => (
                <CalendarChip label={calendar.name} color={calendar.color} key={`${calendar.name}-${idx}`} />
            ))
            }
        </>
    );
}
