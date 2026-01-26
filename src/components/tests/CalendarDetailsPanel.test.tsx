import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CalendarDetailsPanel } from "../CalendarDetailsPanel";
import type { CalendarType } from "../../hooks/useCalendars";

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

describe("CalendarDetailsPanel", () => {
  it("triggers calendar actions and event actions", () => {
    const onDraftNameChange = vi.fn();
    const onSaveCalendar = vi.fn();
    const onClose = vi.fn();
    const onColorChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onAddEvent = vi.fn();
    const onEditEventStart = vi.fn();
    const onSaveEvent = vi.fn();
    const onDeleteEvent = vi.fn();

    render(
      <CalendarDetailsPanel
        calendar={calendar}
        draftName={calendar.name}
        onDraftNameChange={onDraftNameChange}
        onSaveCalendar={onSaveCalendar}
        onClose={onClose}
        onColorChange={onColorChange}
        onToggleVisibility={onToggleVisibility}
        addSummary=""
        addStart=""
        addEnd=""
        onAddSummaryChange={vi.fn()}
        onAddStartChange={vi.fn()}
        onAddEndChange={vi.fn()}
        onAddEvent={onAddEvent}
        editingEventIndex={null}
        editSummary=""
        editStart=""
        editEnd=""
        onEditEventStart={onEditEventStart}
        onEditSummaryChange={vi.fn()}
        onEditStartChange={vi.fn()}
        onEditEndChange={vi.fn()}
        onSaveEvent={onSaveEvent}
        onDeleteEvent={onDeleteEvent}
        formatDateTime={(date) => date.toISOString()}
      />
    );

    fireEvent.change(screen.getByLabelText(/Kalendernamn/i), {
      target: { value: "Nytt namn" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Spara kalender/i }));
    fireEvent.click(screen.getByRole("button", { name: /Stäng/i }));

    fireEvent.change(screen.getByLabelText(/Färg/i), {
      target: { value: "#000000" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /Synlig Test/i }));

    fireEvent.click(screen.getByRole("button", { name: /Lägg till event/i }));
    fireEvent.click(screen.getByRole("button", { name: /Redigera/i }));
    fireEvent.click(screen.getByRole("button", { name: /Ta bort Träning/i }));

    expect(onDraftNameChange).toHaveBeenCalled();
    expect(onSaveCalendar).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(onColorChange).toHaveBeenCalledWith("#000000");
    expect(onToggleVisibility).toHaveBeenCalled();
    expect(onAddEvent).toHaveBeenCalled();
    expect(onEditEventStart).toHaveBeenCalledWith(0);
    expect(onDeleteEvent).toHaveBeenCalledWith(0);
  });
});
