import { Typography, Box } from '@mui/material';
import type { DisplayEvent, DisplayEventStatus } from "../hooks/useDisplayEvents";
import { DisplayEventStatusIcon } from "./DisplayEventStatusIcon";

export interface Props {
    events: DisplayEvent[];
}

const getStatusCounters = (events: DisplayEvent[]) => {
    return events.reduce(
        (acc, event) => {
            const status: DisplayEventStatus = event.status ?? "ok";
            acc[status] += 1;
            return acc;
        },
        { ok: 0, conflict: 0, sameDay: 0 } as Record<DisplayEventStatus, number>
    );
};

export function DisplayEventsStatusBox({ events }: Props) {
    const counts = getStatusCounters(events);

    return (
        <Box alignItems="center">
            <Typography variant="h5">Alla händelser</Typography>
            <Typography variant="body2" color="info" sx={{ mt: 0.5 }}>
                <DisplayEventStatusIcon status="ok" /> {counts.ok} händelse(er) är ok!
            </Typography>
            {counts.sameDay > 0 && (
                <Typography variant="body2" color="warning" sx={{ mt: 0.5 }}>
                    <DisplayEventStatusIcon status="sameDay" /> {counts.sameDay} händelse(er) spelas samma dag men inte samma tid!
                </Typography>
            )}
            {counts.conflict > 0 && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                    <DisplayEventStatusIcon status="overlapping" /> {counts["conflict"]} händelse(er) spelas samma tid och dag!
                </Typography>
            )}
        </Box>
    );
}
