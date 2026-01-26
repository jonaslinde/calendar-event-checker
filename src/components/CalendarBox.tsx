import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import type { CalendarType } from "./../hooks/useCalendars";
import type { CalendarEventType } from "./../hooks/useCalendars";
import { CalendarDetailsPanel } from "./CalendarDetailsPanel";
import { CalendarList } from "./CalendarList";

export interface Props {
    calendars: CalendarType[]
    onUpdateCalendar: (name: string, updatedCalendar: CalendarType) => (void)
    onDeleteCalendar: (name: string) => (void)
    onAddEvent: (calendarName: string, newEvent: CalendarEventType) => void
    onUpdateEvent: (calendarName: string, eventIndex: number, updatedEvent: Partial<CalendarEventType>) => void
    onDeleteEvent: (calendarName: string, eventIndex: number) => void
}

const toInputValue = (date: Date) => {
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromInputValue = (value: string) => new Date(value);

export function CalendarBox({
    calendars,
    onUpdateCalendar,
    onDeleteCalendar,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
}: Props) {
    const [activeCalendarName, setActiveCalendarName] = useState<string | null>(null);
    const activeCalendar = useMemo(
        () => calendars.find((cal) => cal.name === activeCalendarName) ?? null,
        [activeCalendarName, calendars]
    );

    const [draftName, setDraftName] = useState('');
    const [addSummary, setAddSummary] = useState('');
    const [addStart, setAddStart] = useState('');
    const [addEnd, setAddEnd] = useState('');
    const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);
    const [editSummary, setEditSummary] = useState('');
    const [editStart, setEditStart] = useState('');
    const [editEnd, setEditEnd] = useState('');

    useEffect(() => {
        if (!activeCalendar) return;
        setDraftName(activeCalendar.name);
    }, [activeCalendar]);

    useEffect(() => {
        if (editingEventIndex === null || !activeCalendar) return;
        const ev = activeCalendar.events[editingEventIndex];
        if (!ev) return;
        setEditSummary(ev.summary);
        setEditStart(toInputValue(ev.start));
        setEditEnd(toInputValue(ev.end));
    }, [activeCalendar, editingEventIndex]);

    const handleSaveCalendar = () => {
        if (!activeCalendar) return;
        const next = draftName.trim();
        if (!next || next === activeCalendar.name) return;
        if (calendars.some((c) => c.name === next)) return;

        const updatedCalendar = {
            ...activeCalendar,
            name: next,
            events: activeCalendar.events.map(event => ({ ...event, name: next })),
        };
        onUpdateCalendar(activeCalendar.name, updatedCalendar);
        setActiveCalendarName(next);
    };

    const handleToggleVisibility = (calendar: CalendarType) => {
        onUpdateCalendar(calendar.name, { ...calendar, visible: !calendar.visible });
    };

    const handleColorChange = (calendar: CalendarType, next: string) => {
        if (next === calendar.color) return;
        onUpdateCalendar(calendar.name, { ...calendar, color: next });
    };

    const handleAddEvent = () => {
        if (!activeCalendar) return;
        const summary = addSummary.trim();
        if (!summary || !addStart || !addEnd) return;
        onAddEvent(activeCalendar.name, {
            summary,
            description: "",
            location: "",
            start: fromInputValue(addStart),
            end: fromInputValue(addEnd),
            name: activeCalendar.name,
        });
        setAddSummary('');
        setAddStart('');
        setAddEnd('');
    };

    const handleSaveEvent = (eventIndex: number) => {
        if (!activeCalendar) return;
        onUpdateEvent(activeCalendar.name, eventIndex, {
            summary: editSummary.trim(),
            start: fromInputValue(editStart),
            end: fromInputValue(editEnd),
        });
        setEditingEventIndex(null);
    };

    return (
        calendars.length > 0 && (
            <Box mt={4}>
                <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>Kalendrar</Typography>
                <CalendarList
                    calendars={calendars}
                    onToggleVisibility={handleToggleVisibility}
                    onEdit={(calendar) => setActiveCalendarName(calendar.name)}
                    onDelete={(calendar) => onDeleteCalendar(calendar.name)}
                />

                {activeCalendar && (
                    <CalendarDetailsPanel
                        calendar={activeCalendar}
                        draftName={draftName}
                        onDraftNameChange={setDraftName}
                        onSaveCalendar={handleSaveCalendar}
                        onClose={() => setActiveCalendarName(null)}
                        onColorChange={(value) => handleColorChange(activeCalendar, value)}
                        onToggleVisibility={() => handleToggleVisibility(activeCalendar)}
                        addSummary={addSummary}
                        addStart={addStart}
                        addEnd={addEnd}
                        onAddSummaryChange={setAddSummary}
                        onAddStartChange={setAddStart}
                        onAddEndChange={setAddEnd}
                        onAddEvent={handleAddEvent}
                        editingEventIndex={editingEventIndex}
                        editSummary={editSummary}
                        editStart={editStart}
                        editEnd={editEnd}
                        onEditEventStart={setEditingEventIndex}
                        onEditSummaryChange={setEditSummary}
                        onEditStartChange={setEditStart}
                        onEditEndChange={setEditEnd}
                        onSaveEvent={handleSaveEvent}
                        onDeleteEvent={(index) => onDeleteEvent(activeCalendar.name, index)}
                        formatDateTime={toInputValue}
                    />
                )}
            </Box>)

    )
}
