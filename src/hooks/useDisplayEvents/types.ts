export type DisplayEventSortOrder = "asc" | "desc";
export type DisplayEventSortField = "start" | "end" | "location" | "summary";
export type DisplayEventStatus = "ok" | "conflict" | "sameDay";
export type DisplayEventType = "event" | "free-day";

export interface DisplayCalendar {
  name: string;
  color: string;
}
export interface DisplayEvent {
  // For react-big-calendar compatibility
  title: string;              // Alias for summary (required by react-big-calendar)
  start: Date;
  end: Date;
  allDay?: boolean;           // Optional for react-big-calendar (derived from ICS DATE vs DATETIME)

  // For processing/analysis (original fields)
  summary: string;            // Keep for backward compatibility and ICS mapping
  description: string;
  location: string;
  calendars: DisplayCalendar[];
  type: DisplayEventType;
  status: DisplayEventStatus;
}
