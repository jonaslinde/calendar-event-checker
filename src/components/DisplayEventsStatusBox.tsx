import { Typography, Box } from '@mui/material';

import type { DisplayEvent } from "./../hooks/useDisplayEvents";

export interface Props {
    events: DisplayEvent[]
}

export function DisplayEventsStatusBox({ events }: Props) {
    return (
        <Box alignItems="center">
            <Typography variant="h5">Alla händelser</Typography>
            {events.filter(ev => ev.status === "conflict").length > 0 && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                    ⚠️ {events.filter(ev => ev.status === "conflict").length} händelse(er) spelas samma tid och dag!
                </Typography>
            )}
            {events.filter(ev => ev.status === "same-day").length > 0 && (
                <Typography variant="body2" color="warning" sx={{ mt: 0.5 }}>
                    ⚠️ {events.filter(ev => ev.status === "same-day").length} händelse(er) spelas samma dag men inte samma tid!
                </Typography>
            )}
            {events.filter(ev => ev.status === "ok") && (
                <Typography variant="body2" color="info" sx={{ mt: 0.5 }}>
                    {events.filter(ev => ev.status === "ok").length} händelse(er) är ok!
                </Typography>
            )}
            <Typography variant="body2" color="info" sx={{ mt: 0.5 }}>
                Totalt {events.length} händelse(er).
            </Typography>
        </Box>
    );
}