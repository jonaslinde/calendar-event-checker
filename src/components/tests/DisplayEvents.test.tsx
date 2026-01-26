import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DisplayEvents } from "../DisplayEvents";

vi.mock("../BigCalendar", () => ({
  BigCalendar: (props: { agendaLength: number }) => (
    <div data-testid="big-calendar" data-agenda-length={props.agendaLength} />
  ),
}));

vi.mock("../DisplayEventsStatusBox", () => ({
  DisplayEventsStatusBox: () => null,
}));

vi.mock("../DisplayEventsShowOptions", () => ({
  DisplayEventsShowOptions: () => null,
}));

describe("DisplayEvents", () => {
  it("uses 30 days by default and allows changing agenda length", () => {
    render(<DisplayEvents events={[]} />);

    const calendar = screen.getByTestId("big-calendar");
    expect(calendar).toHaveAttribute("data-agenda-length", "30");

    fireEvent.click(screen.getByRole("tab", { name: /Lista/i }));
    const input = screen.getByLabelText(/Dagar i agenda/i);
    fireEvent.change(input, { target: { value: "14" } });

    fireEvent.click(screen.getByRole("tab", { name: /Kalender/i }));
    const updatedCalendar = screen.getByTestId("big-calendar");
    expect(updatedCalendar).toHaveAttribute("data-agenda-length", "14");
  });
});
