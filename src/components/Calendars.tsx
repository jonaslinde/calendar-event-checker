import { useEffect } from 'react';

import { AddCalendars } from "./AddCalendars";
import { CalendarBox } from "./CalendarBox";
import { useCalendars } from './../hooks/useCalendars';
import type { CalendarType } from "./../hooks/useCalendars";

export interface Props {
    onUpdate: (calendars: CalendarType[]) => void;
}

export function Calendars({ onUpdate }: Props) {
    const {
        calendars,
        addCalendarFromIcs,
        removeCalendar,
        updateCalendar } = useCalendars();


    useEffect(() => {
        onUpdate(calendars)
    }, [calendars, onUpdate]);

    return (
        <>
            <AddCalendars onNewIcsText={addCalendarFromIcs} />
            <CalendarBox calendars={calendars} onDeleteCalendar={removeCalendar} onUpdateCalendar={updateCalendar} />
        </>
    )
}