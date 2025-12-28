import { List } from '@mui/material';
import type { DisplayEvent } from "../hooks/useDisplayEvents"
import { DisplayEventItem } from "./DisplayEventListItem";

// TODO #5: Integrate alternative views - This component exists but is not used. Integrate into DisplayEvents or remove if not needed.
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
