import ical from 'ical.js';

import { describe, it, expect, beforeEach } from 'vitest';

describe('iCal.js tests', () => {
    it("parse returns empty array", () => {
        const jcal = ical.parse('')
        expect(jcal).toEqual([]);
    })
    it("finds one calendar", () => {
        const s = "BEGIN:VCALENDAR\nEND:VCALENDAR";
        const expected =
            [
                "vcalendar", [], []
            ];
        const jcal = ical.parse(s)
        expect(jcal).toEqual(expected);
    })
    it("finds one calendar (w period)", () => {
        const s = "BEGIN:VCALENDAR\nPRODID: -//xyz Corp//NONSGML PDA Calendar Version 1.0//EN\nEND:VCALENDAR";
        const expected =
            [
                "vcalendar",
                [
                    [
                        "prodid",
                        {},
                        "text",
                        " -//xyz Corp//NONSGML PDA Calendar Version 1.0//EN",
                    ],
                ],
                [],
            ];
        const jcal = ical.parse(s)
        expect(jcal).toEqual(expected);
    })
    it("finds one calendar (w version)", () => {
        const s = "BEGIN:VCALENDAR\nVERSION: 2.0\nEND:VCALENDAR";
        const expected =
            [
                "vcalendar",
                [
                    [
                        "version",
                        {},
                        "text",
                        " 2.0",
                    ],
                ],
                [],
            ];
        const jcal = ical.parse(s)
        expect(jcal).toEqual(expected);
    })
    it("something", () => {
        const jcal = ical.parse('')
        expect(true).toBe(true);
    })
})