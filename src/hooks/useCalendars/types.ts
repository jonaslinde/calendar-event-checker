export interface CalendarEventType {
  summary: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  name: string;
}

export interface CalendarType {
  id: number;
  name: string;
  events: CalendarEventType[];
  color: string;
  visible: boolean;
}
