export interface CalendarEventType {
    summary: string;
    description: string;
    location: string;
    start: string;
    end: string;
    calendarName: string;
  }
  
  export interface CalendarType {
    name: string;
    events: CalendarEventType[];
    color: string;
    visible: boolean;
  }
  