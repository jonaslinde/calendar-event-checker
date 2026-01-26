import { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { addDays, startOfDay } from "date-fns";
import type { DisplayEvent, DisplayEventStatus } from "../hooks/useDisplayEvents";
import { formatDate, formatTime } from "../hooks/useDisplayEvents/utils";
import { DisplayEventStatusIcon } from "./DisplayEventStatusIcon";
import { CalendarChipList } from "./CalendarChipList";

type SortKey = "date" | "time" | "name" | "status";
type SortDirection = "asc" | "desc";

const statusLabel: Record<DisplayEventStatus, string> = {
  ok: "Ok",
  overlapping: "Overlappande",
  sameDay: "Samma dag",
  duplicate: "Dubblett",
  merged: "Sammanslagen",
};

const statusOrder: Record<DisplayEventStatus, number> = {
  ok: 0,
  sameDay: 1,
  overlapping: 2,
  duplicate: 3,
  merged: 4,
};

const compareStrings = (left: string, right: string) =>
  left.localeCompare(right, "sv-SE", { sensitivity: "base" });

const getTimeOfDayValue = (date: Date) => date.getHours() * 60 + date.getMinutes();

export type DisplayEventsListProps = {
  events: DisplayEvent[];
  date?: Date;
  length?: number;
};

type DisplayEventsListComponent = ((props: DisplayEventsListProps) => JSX.Element) & {
  range: (date: Date, options: { length?: number }) => Date[];
  navigate: (date: Date, action: "PREV" | "NEXT" | "DATE", options: { length?: number }) => Date;
  title: (date: Date, options: { length?: number }) => string;
};

export const DisplayEventsList = (({ events, date, length = 30 }: DisplayEventsListProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (nextKey: SortKey) => {
    if (nextKey === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDirection("asc");
  };

  const sortedEvents = useMemo(() => {
    const rangeStart = date ? startOfDay(date) : null;
    const rangeEnd = rangeStart ? addDays(rangeStart, length) : null;

    const inRange = (event: DisplayEvent) => {
      if (!rangeStart || !rangeEnd) return true;
      const start = event.start instanceof Date ? event.start : new Date(event.start);
      return start >= rangeStart && start < rangeEnd;
    };

    const sorted = events
      .filter(inRange)
      .sort((a, b) => {
      const aStart = a.start instanceof Date ? a.start : new Date(a.start);
      const bStart = b.start instanceof Date ? b.start : new Date(b.start);

      let cmp = 0;
      switch (sortKey) {
        case "date": {
          cmp = aStart.getTime() - bStart.getTime();
          break;
        }
        case "time": {
          cmp = getTimeOfDayValue(aStart) - getTimeOfDayValue(bStart);
          if (cmp === 0) cmp = aStart.getTime() - bStart.getTime();
          break;
        }
        case "name": {
          cmp = compareStrings(a.title ?? "", b.title ?? "");
          break;
        }
        case "status": {
          const aStatus = a.status ?? "ok";
          const bStatus = b.status ?? "ok";
          cmp = statusOrder[aStatus] - statusOrder[bStatus];
          break;
        }
        default:
          cmp = 0;
      }

      if (cmp === 0) {
        cmp = aStart.getTime() - bStart.getTime();
      }

      return sortDirection === "asc" ? cmp : -cmp;
      });

    return sorted;
  }, [date, events, length, sortDirection, sortKey]);

  return (
    <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
      <Table
        size="small"
        aria-label="Lista med händelser"
        sx={{ width: "100%", tableLayout: "fixed" }}
      >
        <TableHead>
          <TableRow>
            <TableCell sortDirection={sortKey === "date" ? sortDirection : false} sx={{ width: 120 }}>
              <TableSortLabel
                active={sortKey === "date"}
                direction={sortKey === "date" ? sortDirection : "asc"}
                onClick={() => handleSort("date")}
              >
                Datum
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortKey === "time" ? sortDirection : false} sx={{ width: 110 }}>
              <TableSortLabel
                active={sortKey === "time"}
                direction={sortKey === "time" ? sortDirection : "asc"}
                onClick={() => handleSort("time")}
              >
                Tid
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortKey === "name" ? sortDirection : false} sx={{ width: 200 }}>
              <TableSortLabel
                active={sortKey === "name"}
                direction={sortKey === "name" ? sortDirection : "asc"}
                onClick={() => handleSort("name")}
              >
                Namn
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortKey === "status" ? sortDirection : false} sx={{ width: 160 }}>
              <TableSortLabel
                active={sortKey === "status"}
                direction={sortKey === "status" ? sortDirection : "asc"}
                onClick={() => handleSort("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>Kalender</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEvents.map((event, idx) => {
            const status = event.status ?? "ok";
            const label = statusLabel[status];
            return (
              <TableRow key={`${event.title}-${idx}`} data-testid="event-row">
                <TableCell data-testid="event-date">{formatDate(event.start)}</TableCell>
                <TableCell data-testid="event-time">{formatTime(event.start)}</TableCell>
                <TableCell
                  data-testid="event-name"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {event.title}
                </TableCell>
                <TableCell data-testid="event-status">
                  <DisplayEventStatusIcon status={status} /> {label}
                </TableCell>
                <TableCell data-testid="event-calendars">
                  <CalendarChipList calendars={event.calendars} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}) as DisplayEventsListComponent;

DisplayEventsList.range = (date: Date, { length = 30 }: { length?: number }) => {
  const start = startOfDay(date);
  const end = addDays(start, length);
  return [start, end];
};

DisplayEventsList.navigate = (
  date: Date,
  action: "PREV" | "NEXT" | "DATE",
  { length = 30 }: { length?: number }
) => {
  switch (action) {
    case "PREV":
      return addDays(date, -length);
    case "NEXT":
      return addDays(date, length);
    default:
      return date;
  }
};

DisplayEventsList.title = (date: Date, { length = 30 }: { length?: number }) => {
  const start = startOfDay(date);
  const end = addDays(start, length - 1);
  return `${formatDate(start)} – ${formatDate(end)}`;
};
