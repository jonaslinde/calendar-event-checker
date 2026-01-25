// src/components/AgendaWithStatus.tsx
import { format, addDays, startOfDay } from "date-fns";
import { sv } from "date-fns/locale/sv";
import type { DisplayEvent } from "../hooks/useDisplayEvents";
import { DisplayEventStatusIcon } from "./DisplayEventStatusIcon";

// En liten hjälptyp för RBC custom view props (vi håller den enkel)
type AgendaComponents = {
    event?: (props: { event: DisplayEvent }) => JSX.Element;
};

type AgendaWithStatusProps = {
    events: DisplayEvent[];
    date: Date;
    length?: number;
    components?: AgendaComponents; // react-big-calendar's components bag
};

type AgendaRangeOptions = {
    length?: number;
};

type AgendaWithStatusComponent = ((props: AgendaWithStatusProps) => JSX.Element) & {
    range: (date: Date, options: AgendaRangeOptions) => Date[];
    navigate: (date: Date, action: "PREV" | "NEXT" | "DATE", options: AgendaRangeOptions) => Date;
    title: (date: Date, options: AgendaRangeOptions) => string;
};

/**
 * Custom Agenda view with an extra "Status" column.
 * Built-in Agenda has fixed columns, so we render our own table.
 */
export const AgendaWithStatus = ((props: AgendaWithStatusProps) => {
    const { events, date, length = 30, components } = props;

    const rangeStart = startOfDay(date);
    const rangeEnd = addDays(rangeStart, length);

    const inRange = (e: DisplayEvent) => {
        const start = e.start instanceof Date ? e.start : new Date(e.start);
        return start >= rangeStart && start < rangeEnd;
    };

    const items = (events || [])
        .filter(inRange)
        .slice()
        .sort((a, b) => {
            const sa = (a.start instanceof Date ? a.start : new Date(a.start)).getTime();
            const sb = (b.start instanceof Date ? b.start : new Date(b.start)).getTime();
            return sa - sb;
        });

    return (
        <div className="rbc-agenda-view">
            <table className="rbc-agenda-table">
                <thead>
                    <tr>
                        <th className="rbc-header">Datum</th>
                        <th className="rbc-header">Tid</th>
                        <th className="rbc-header">Händelse</th>
                        <th className="rbc-header">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((event, idx) => {
                        const start = event.start instanceof Date ? event.start : new Date(event.start);
                        const end = event.end instanceof Date ? event.end : new Date(event.end);

                        const day = format(start, "yyyy-MM-dd", { locale: sv });
                        const time = event.allDay
                            ? "Heldag"
                            : `${format(start, "HH:mm", { locale: sv })} – ${format(end, "HH:mm", { locale: sv })}`;
                        return (
                            <tr key={`${event.title ?? ""}-${idx}`} className="rbc-agenda-row">
                                <td className="rbc-agenda-date-cell">{day}</td>
                                <td className="rbc-agenda-time-cell">{time}</td>
                                <td className="rbc-agenda-event-cell">
                                    {components?.event
                                        ? components.event({ event })
                                        : <span>{event.title}</span>}
                                </td>
                                <td className="rbc-agenda-event-cell">
                                    <DisplayEventStatusIcon status={event.status ?? "ok"} fontSize="1.5rem" />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}) as AgendaWithStatusComponent;

// RBC kräver dessa statics för custom views
AgendaWithStatus.range = (date: Date, { length = 30 }: AgendaRangeOptions) => {
    const start = startOfDay(date);
    const end = addDays(start, length);
    return [start, end];
};

AgendaWithStatus.navigate = (date: Date, action: "PREV" | "NEXT" | "DATE", { length = 30 }: AgendaRangeOptions) => {
    switch (action) {
        case "PREV":
            return addDays(date, -length);
        case "NEXT":
            return addDays(date, length);
        default:
            return date;
    }
};

AgendaWithStatus.title = (date: Date, { length = 30 }: AgendaRangeOptions) => {
    const start = startOfDay(date);
    const end = addDays(start, length - 1);
    return `${format(start, "yyyy-MM-dd", { locale: sv })} – ${format(end, "yyyy-MM-dd", { locale: sv })}`;
};
