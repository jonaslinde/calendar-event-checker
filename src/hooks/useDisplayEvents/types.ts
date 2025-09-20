export type DisplayEventSortOrder = "asc" | "desc" | "none";
export type DisplayEventSortField = "date" | "start" | "end" | "location" | "summary";
export type DisplayEventStatus = "ok" | "conflict" | "same-day";
export type DisplayEventType = "event" | "free-day";

export interface DisplayEvent {
    summary: string;
    description: string;
    location: string;
    day: string
    start: string;
    end: string;
    calendarNames: string[];
    type: DisplayEventType;
    status: DisplayEventStatus;
  }