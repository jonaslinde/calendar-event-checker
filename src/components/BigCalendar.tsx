// src/components/BigCalendarDemo.tsx
import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, type FormatOptions, isWeekend } from 'date-fns';
import { AgendaWithStatus } from "./AgendaWithStatus";
import { sv } from 'date-fns/locale/sv';
import { DisplayEventStatusIcon } from "./DisplayEventStatusIcon";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { DisplayEvent } from "../hooks/useDisplayEvents";

// ---- Localizer (date-fns + svenska) ----
const locales = { sv };
const localizer = dateFnsLocalizer({
  format: (date: Date, fmt: string, options?: FormatOptions) => format(date, fmt, { ...(options as any), locale: sv }),
  parse: (value: string, fmt: string) => parse(value as string, fmt, new Date(), { locale: sv }),
  startOfWeek: () => startOfWeek(new Date(), { locale: sv }),
  getDay,
  locales,
});

export type Props = {
  events: DisplayEvent[];
  agendaLength: number;
}

// ---- Komponent ----
export function BigCalendar({ events, agendaLength = 90 }: Props) {
  const [view, setView] = useState<View>('agenda');
  const [date, setDate] = useState(new Date());

  // Svenska texter i UI
  const messages = {
    date: 'Datum',
    time: 'Tid',
    event: 'Händelse',
    allDay: 'Heldag',
    week: 'Vecka',
    work_week: 'Arbetsvecka',
    day: 'Dag',
    month: 'Månad',
    previous: 'Föregående',
    next: 'Nästa',
    today: 'Idag',
    agenda: 'Agenda',
    showMore: (total: number) => `+${total} till`,
    noEventsInRange: 'Inga händelser i vald period',
  };

  // Startvy & visningsintervall
  const defaultDate = useMemo(() => new Date(), []);

  const myEvent = useCallback(({ event }: { event: DisplayEvent }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <strong>{event.title}</strong>
      {event.location && <span> — {event.location}</span>}
      <DisplayEventStatusIcon status={event.status ?? "ok"} />
    </div>
  ), []);

  // TODO #8: Handle multi-calendar event coloring - Support events that appear in multiple calendars (max 2) with proper color display
  const eventPropGetter = useCallback(
    (e: DisplayEvent) => {
      // In Agenda view, let components.agenda.event (AgendaEvent) control the styling.
      // If we set backgroundColor here, it will style the agenda cell wrapper and override your custom rendering.
      if (view === 'agenda') return {};

      const bgColor = e.calendars?.[0]?.color ?? 'white'; // Todo: handle many calendars. Most probably max 2
      const style: React.CSSProperties = { backgroundColor: bgColor, color: 'white' };
      style.outline = '2px solid rgba(167, 213, 40, 0.2)';
      return { style };
    },
    [view]
  );

  const dayPropGetter = useCallback((date: Date) => {
    if (isWeekend(date)) {
      return {
        style: {
          backgroundColor: '#f7f7f7', // ljusgrå bakgrund för helger
        },
      };
    }
    return {};
  }, []);

  const onSelectEvent = useCallback((event: DisplayEvent) => {
    const when =
      event.allDay
        ? format(event.start as Date, 'yyyy-MM-dd', { locale: sv })
        : `${format(event.start as Date, 'yyyy-MM-dd HH:mm', { locale: sv })} – ${format(
          event.end as Date,
          'HH:mm',
          { locale: sv }
        )}`;
    const where = event.location || "";
    const calendarNames: string = event.calendars?.map(c => c.name).join(" | ") || "";
    alert(`${event.title}\n\n${event.description}\n\n${when}\n${where}\n${calendarNames}`);
  }, []);

  const AgendaEvent = ({ event }: { event: DisplayEvent }) => {
    const bg = event.calendars?.[0]?.color ?? "#1976d2";

    return (
      <div
        style={{
          background: bg,
          color: "white",
          padding: "4px 8px",
          borderRadius: 6,
          display: "block",
        }}
      >
        <strong>{event.title}</strong>
        {event.location ? ` — ${event.location}` : null}
      </div>
    );
  };

  const components = useMemo(() => ({
    event: myEvent,
    agenda: {
      event: AgendaEvent,
    },
  }), [myEvent]);

  const views = {
    month: true,
    week: true,
    agenda: AgendaWithStatus,
  } as const;
  const style = { background: 'white' };

  const containerHeight = view === "month" ? 700 : 1600;

  return (
    <div style={{ height: containerHeight }}>
      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        components={components}
        startAccessor="start"
        endAccessor="end"
        defaultDate={defaultDate}
        view={view}
        length={agendaLength}
        onView={setView}
        views={views}
        date={date}
        onNavigate={setDate}
        messages={messages}
        popup
        selectable
        onSelectEvent={onSelectEvent}
        style={style}
      />
    </div>
  );
}
