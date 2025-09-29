export type DisplayEventSortOrder = "asc" | "desc";
export type DisplayEventSortField = "start" | "end" | "location" | "summary";
export type DisplayEventStatus = "ok" | "conflict" | "same-day";
export type DisplayEventType = "event" | "free-day";

export interface DisplayCalendar {
  name: string;
  color: string;
}
export interface DisplayEvent {
  summary: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  calendars: DisplayCalendar[];
  type: DisplayEventType;
  status: DisplayEventStatus;
}