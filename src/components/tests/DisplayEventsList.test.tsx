import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DisplayEventsList } from "../DisplayEventsList";
import type { DisplayEvent } from "../../hooks/useDisplayEvents";

const ev = (partial: Partial<DisplayEvent>): DisplayEvent => ({
  title: "Event",
  summary: "Event",
  description: "",
  location: "",
  start: new Date("2025-01-01T09:00:00Z"),
  end: new Date("2025-01-01T10:00:00Z"),
  calendars: [{ name: "Cal", color: "#000000" }],
  status: "ok",
  ...partial,
});

describe("DisplayEventsList", () => {
  it("sorts by date/time by default and toggles name sorting", () => {
    const events: DisplayEvent[] = [
      ev({
        title: "Alpha",
        start: new Date("2025-01-02T10:00:00Z"),
        end: new Date("2025-01-02T11:00:00Z"),
        status: "ok",
      }),
      ev({
        title: "Beta",
        start: new Date("2025-01-01T09:00:00Z"),
        end: new Date("2025-01-01T10:00:00Z"),
        status: "overlapping",
      }),
      ev({
        title: "Gamma",
        start: new Date("2025-01-01T08:00:00Z"),
        end: new Date("2025-01-01T09:00:00Z"),
        status: "sameDay",
      }),
    ];

    render(<DisplayEventsList events={events} />);

    const getNames = () =>
      screen.getAllByTestId("event-name").map((cell) => cell.textContent);

    expect(getNames()).toEqual(["Gamma", "Beta", "Alpha"]);

    fireEvent.click(screen.getByRole("button", { name: /Namn/i }));
    expect(getNames()).toEqual(["Alpha", "Beta", "Gamma"]);

    fireEvent.click(screen.getByRole("button", { name: /Namn/i }));
    expect(getNames()).toEqual(["Gamma", "Beta", "Alpha"]);
  });

  it("filters to the agenda range when date and length are provided", () => {
    const events: DisplayEvent[] = [
      ev({
        title: "Inside",
        start: new Date("2025-01-05T10:00:00Z"),
        end: new Date("2025-01-05T11:00:00Z"),
      }),
      ev({
        title: "Outside",
        start: new Date("2025-02-01T10:00:00Z"),
        end: new Date("2025-02-01T11:00:00Z"),
      }),
    ];

    render(
      <DisplayEventsList
        events={events}
        date={new Date("2025-01-01T00:00:00Z")}
        length={10}
      />
    );

    const names = screen.getAllByTestId("event-name").map((cell) => cell.textContent);
    expect(names).toEqual(["Inside"]);
  });
});
