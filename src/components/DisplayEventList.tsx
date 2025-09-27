import { List, Button } from '@mui/material';
import type { DisplayEvent, DisplayEventSortField, DisplayEventSortOrder } from "../hooks/useDisplayEvents"
import { DisplayEventItem } from "./DisplayEventListItem";

export type Props = {
    events: DisplayEvent[]
}

export function DisplayEventList({ events }: Props) {
    return (
        <List>
            {events.map((event, idx) => {
                return (
                    <DisplayEventItem
                        event={event}
                        id={idx + 10000}
                        color={event.calendars[0].color}
                        divider={false}
                        key={'event-' + idx}
                    />
                );
            })}
        </List>
    );
}
