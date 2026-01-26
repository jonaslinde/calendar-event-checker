import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Calendars } from "../Calendars";

const calendarsData = [
  { id: 1, name: "Visible", color: "#1976d2", visible: true, events: [] },
  { id: 2, name: "Hidden", color: "#000000", visible: false, events: [] },
];

vi.mock("../AddCalendars", () => ({
  AddCalendars: () => null,
}));

vi.mock("../CalendarBox", () => ({
  CalendarBox: () => null,
}));

vi.mock("../../hooks/useCalendars", () => ({
  useCalendars: () => ({
    calendars: calendarsData,
    addCalendarFromIcs: vi.fn(),
    removeCalendar: vi.fn(),
    updateCalendar: vi.fn(),
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
  }),
}));

describe("Calendars", () => {
  it("filters out invisible calendars before calling onUpdate", () => {
    const onUpdate = vi.fn();

    render(<Calendars onUpdate={onUpdate} />);

    expect(onUpdate).toHaveBeenCalledWith([calendarsData[0]]);
  });
});
