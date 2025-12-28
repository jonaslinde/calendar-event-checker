/* import type { RbcEvent } from "../types";
// Hjälpare för datum
const addHours = (d: Date, h: number) => new Date(d.getTime() + h * 60 * 60 * 1000);
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

export function demoEvents(): RbcEvent[] {
    const now = new Date();
    const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
    const d4 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const d2 = addDays(d0, 2);

    return [
        {
            title: 'En match som spelades igår',
            start: addDays(d0, -1),
            end: addDays(addHours(d0, 1.5), -1),
            resource: {
                location: 'Idrottsplats A',
                calendars: [
                    {
                        name: "Lag A",
                        color: "gold"
                    }
                ]
            },
        },
        {
            title: 'Match A vs B (not merged)',
            start: d0,
            end: addHours(d0, 1.5),
            resource: {
                location: 'Idrottsplats A',
                calendars: [
                    {
                        name: "Lag A",
                        color: "white"
                    }
                ]
            },
        },
        {
            title: 'Match A vs B (not merged)',
            start: d0,
            end: addHours(d0, 1.5),
            resource: {
                location: 'Idrottsplats A',
                calendars: [
                    {
                        name: "Lag B",
                        color: "blue"
                    }
                ]
            },
        },
        {
            title: 'Match A vs B (merged)',
            start: addDays(d0, 1),
            end: addDays(addHours(d0, 1.5), 1),
            resource: {
                location: 'Idrottsplats A',
                calendars: [
                    {
                        name: "Lag A",
                        color: "lightblue"
                    },
                    {
                        name: "Lag B",
                        color: "lightred"
                    },
                ]
            },
        },
        {
            title: 'Match A vs C',
            start: addDays(addHours(d0, 7), 2),
            end: addDays(addHours(d0, 9), 2),
            resource: {
                location: 'Arena B',
                status: "sameDay",
                calendars: [
                    {
                        name: "Lag A",
                        color: "gray"
                    }
                ]
            },
        },
        {
            title: 'Träning',
            start: addDays(addHours(d0, 3), 2),
            end: addDays(addHours(d0, 5), 2),
            resource: {
                location: 'Idrottsplats A',
                calendars: [
                    {
                        name: "Lag A",
                        color: "white"
                    }
                ]
            },
        },
        {
            title: 'Träning',
            start: addDays(addHours(d0, 3), 3),
            end: addDays(addHours(d0, 5), 3),
            resource: {
                location: 'Idrottsplats C',
                status: "conflict",
                calendars: [
                    {
                        name: "Lag A",
                        color: "yellow",
                    }
                ]
            },
        },
        {
            title: 'Fri dag',
            start: addDays(d4, 4),
            end: addDays(d4, 5), // heldag = start till nästa dags midnatt
            allDay: true,
            resource: {
                type: "free-day"
            },
        },
        {
            title: 'Event som spänner över midnatt (ej heldag)',
            start: addDays(addHours(d4, 20), 8),
            end: addDays(addHours(d4, 4), 9), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'All-day',
            start: addDays(d4, 10),
            end: addDays(d4, 11), // heldag = start till nästa dags midnatt
            allDay: true,
            resource: {},
        },
        {
            title: 'All-day + timed samma dag',
            start: addDays(addHours(d4, 14), 10),
            end: addDays(addHours(d4, 16), 10), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flera event samma dag - event 1',
            start: addDays(addHours(d4, 14), 11),
            end: addDays(addHours(d4, 16), 11), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flera event samma dag - event 2',
            start: addDays(addHours(d4, 14), 11),
            end: addDays(addHours(d4, 16), 11), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flera event samma dag - event 3',
            start: addDays(addHours(d4, 14), 11),
            end: addDays(addHours(d4, 16), 11), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flera event samma dag - event 4',
            start: addDays(addHours(d4, 14), 11),
            end: addDays(addHours(d4, 16), 11), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flera event samma dag - event 5',
            start: addDays(addHours(d4, 14), 11),
            end: addDays(addHours(d4, 16), 11), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flera event samma dag - event 6',
            start: addDays(addHours(d4, 14), 11),
            end: addDays(addHours(d4, 16), 11), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flera event samma dag - event 7',
            start: addDays(addHours(d4, 14), 11),
            end: addDays(addHours(d4, 16), 11), // heldag = start till nästa dags midnatt
            resource: {},
        },
        {
            title: 'Flerdagars Cup',
            start: addDays(d2, 3),
            end: addDays(d2, 5), // heldag = start till nästa dags midnatt
            allDay: true,
            resource: {
                location: 'Idrottsplats A',
                calendars: [
                    {
                        name: "Lag A",
                        color: "white"
                    }
                ]
            },
        },
    ];
};
 */