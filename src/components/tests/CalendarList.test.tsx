import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CalendarList } from "../CalendarList";
import type { CalendarType } from "../../hooks/useCalendars";

const calendar: CalendarType = {
  id: 1,
  name: "Test",
  color: "#1976d2",
  visible: true,
  events: [],
};

describe("CalendarList", () => {
  it("calls handlers for edit, delete, and toggle visibility", () => {
    const onToggleVisibility = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CalendarList
        calendars={[calendar]}
        onToggleVisibility={onToggleVisibility}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Dölj Test/i }));
    fireEvent.click(screen.getByRole("button", { name: /Redigera Test/i }));
    fireEvent.click(screen.getByRole("button", { name: /Ta bort Test/i }));

    expect(onToggleVisibility).toHaveBeenCalledWith(calendar);
    expect(onEdit).toHaveBeenCalledWith(calendar);
    expect(onDelete).toHaveBeenCalledWith(calendar);
  });
});
