import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CalendarBox } from "../CalendarBox";
import type { CalendarType } from "../../hooks/useCalendars";

describe("CalendarBox", () => {
  const calendar: CalendarType = {
    id: 1,
    name: "Test",
    color: "#1976d2",
    visible: true,
    events: [
      {
        summary: "Träning",
        description: "",
        location: "",
        start: new Date("2025-01-01T10:00:00Z"),
        end: new Date("2025-01-01T11:00:00Z"),
        name: "Test",
      },
    ],
  };

  it("opens details and updates calendar name", () => {
    const onUpdateCalendar = vi.fn();
    const onDeleteCalendar = vi.fn();

    render(
      <CalendarBox
        calendars={[calendar]}
        onUpdateCalendar={onUpdateCalendar}
        onDeleteCalendar={onDeleteCalendar}
        onAddEvent={vi.fn()}
        onUpdateEvent={vi.fn()}
        onDeleteEvent={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Redigera Test/i }));

    const nameInput = screen.getByLabelText(/Kalendernamn/i);
    fireEvent.change(nameInput, { target: { value: "Nytt namn" } });
    fireEvent.click(screen.getByRole("button", { name: /Spara kalender/i }));

    expect(onUpdateCalendar).toHaveBeenCalledWith("Test", {
      ...calendar,
      name: "Nytt namn",
      events: calendar.events.map((event) => ({ ...event, name: "Nytt namn" })),
    });
    expect(onDeleteCalendar).not.toHaveBeenCalled();
  });

  it("toggles visibility from the list", () => {
    const onUpdateCalendar = vi.fn();
    const onDeleteCalendar = vi.fn();

    render(
      <CalendarBox
        calendars={[calendar]}
        onUpdateCalendar={onUpdateCalendar}
        onDeleteCalendar={onDeleteCalendar}
        onAddEvent={vi.fn()}
        onUpdateEvent={vi.fn()}
        onDeleteEvent={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Dölj Test/i }));

    expect(onUpdateCalendar).toHaveBeenCalledWith("Test", {
      ...calendar,
      visible: false,
    });
  });

  it("adds a new event from the details panel", () => {
    const onAddEvent = vi.fn();

    render(
      <CalendarBox
        calendars={[calendar]}
        onUpdateCalendar={vi.fn()}
        onDeleteCalendar={vi.fn()}
        onAddEvent={onAddEvent}
        onUpdateEvent={vi.fn()}
        onDeleteEvent={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Redigera Test/i }));

    fireEvent.change(screen.getByLabelText(/Händelsenamn/i), {
      target: { value: "Match" },
    });
    fireEvent.change(screen.getByLabelText(/Starttid/i), {
      target: { value: "2025-01-02T12:00" },
    });
    fireEvent.change(screen.getByLabelText(/Sluttid/i), {
      target: { value: "2025-01-02T13:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Lägg till event/i }));

    expect(onAddEvent).toHaveBeenCalledTimes(1);
    expect(onAddEvent).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({
        summary: "Match",
      })
    );
  });

  it("deletes an event from the details panel", () => {
    const onDeleteEvent = vi.fn();

    render(
      <CalendarBox
        calendars={[calendar]}
        onUpdateCalendar={vi.fn()}
        onDeleteCalendar={vi.fn()}
        onAddEvent={vi.fn()}
        onUpdateEvent={vi.fn()}
        onDeleteEvent={onDeleteEvent}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Redigera Test/i }));

    fireEvent.click(screen.getByRole("button", { name: /Ta bort Träning/i }));

    expect(onDeleteEvent).toHaveBeenCalledWith("Test", 0);
  });
  it("updates calendar color in details", () => {
    const onUpdateCalendar = vi.fn();

    render(
      <CalendarBox
        calendars={[calendar]}
        onUpdateCalendar={onUpdateCalendar}
        onDeleteCalendar={vi.fn()}
        onAddEvent={vi.fn()}
        onUpdateEvent={vi.fn()}
        onDeleteEvent={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Redigera Test/i }));
    fireEvent.change(screen.getByLabelText(/Färg/i), { target: { value: "#000000" } });

    expect(onUpdateCalendar).toHaveBeenCalledWith("Test", {
      ...calendar,
      color: "#000000",
    });
  });
});
