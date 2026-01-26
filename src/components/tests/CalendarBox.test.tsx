import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CalendarBox } from "../CalendarBox";
import type { CalendarType } from "../../hooks/useCalendars";

describe("CalendarBox", () => {
  it("updates calendar color when picker changes", () => {
    const calendar: CalendarType = {
      id: 1,
      name: "Test",
      color: "#1976d2",
      visible: true,
      events: [],
    };
    const onUpdateCalendar = vi.fn();
    const onDeleteCalendar = vi.fn();

    render(
      <CalendarBox
        calendars={[calendar]}
        onUpdateCalendar={onUpdateCalendar}
        onDeleteCalendar={onDeleteCalendar}
      />
    );

    const colorInput = screen.getByLabelText("Kalenderfarg Test");
    fireEvent.change(colorInput, { target: { value: "#000000" } });

    expect(onUpdateCalendar).toHaveBeenCalledTimes(1);
    expect(onUpdateCalendar).toHaveBeenCalledWith("Test", {
      ...calendar,
      color: "#000000",
    });
    expect(onDeleteCalendar).not.toHaveBeenCalled();
  });
});
