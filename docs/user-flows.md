# User Flows

This document captures expected user behavior so UX and product choices
stay aligned as the app evolves.

## Primary goals

- Import one or more calendars to visualize conflicts and overlaps.
- Compare events across calendars in a clear overview.
- Identify scheduling risks quickly.

## Scenarios

### Scenario: Add calendars and view overview (primary)

1) User opens the app.
2) User adds one or more calendars by URL or by uploading a file.
3) App parses calendars and shows an overview.
4) User reviews conflicts, overlaps, and busy days.
5) User optionally applies filters to focus the view.

### Scenario: Update calendars and review overview

1) User opens the app, which remembers calendars from previous session.
2) User selects a calender that should be updated and provides a source to the updated calendar
3) The app parses the new information and the user reviews the changes

## Requirements

### General

- When an error occurs then a error message should be displayed to the user describing the error.
- The language should by default be Swedish.
- It should be possible to select another language (future)
- The local should by default be Sweden.
- It should be possible to select another local (future)


### Calendar and events

- It should be possible to create, update and remove calendars.
- Each calendar should have a color.
- The following colors should always be easily selected (pre-defined):
  - #1976d2 (blue)
  - #388e3c (green)
  - #f57c00 (orange)
  - #7b1fa2 (purple)
  - #c2185b (pink)
  - #00796b (teal)
  - #5d4037 (brown)
  - #455a64 (blue-grey)
  - #e91e63 (magenta)
  - #ff5722 (red-orange)
- It should be possible for the user to select any other color using a color picker.
- It should be possibel to create, update and remove events from a calendar.
- Is should be possible to add events to a calendar by:
  - providing a URL
  - uploading a file
  - or manually
- When importing a calendar using a URL, the URL should be validated.
- URL and file references should be remembered so they can be reused.
- Each event should have the following properties
  - Date
  - Start time
  - End time
  - Name
  - Location
  - Description (optional)

### Overview

- The following views should exist
  - List view
  - Week view
  - Month view
- Regardless of view, each event should be colored using its calendar color

#### Functionality

- The overview should be able to identify conflicting events that
  - Occur one same day
  - Are overlapping
  - Are duplicates of events in another calendar
- It should be possible enable to merge events that are duplicates into one event. By default this should be disabled.

#### Filters

- It should be possible to show events based on their status, e.g. only conflicting or duplicate. When selecting which statuses to show it should be possible to select multiple statuses.
- It should be possible to filter events based on their name. E.g. to be able to find games or praticies only.

#### List view

- It should contain all events from all calendar.
- It should be sorted by date and time by default, but all columns should be sortable
- The list shold display the following data
  - Date
  - Time of day (start and end)
  - Event name
  - Event status, indicated by an icon.

  #### Week view

  #### Month view

## Data storage

- Calendars, and their events, should be stored between sessions.

## Inputs and sources

- Calendar URL (ICS).
- File upload:
  - text-based calendar file (ICS)
  - Excel/CSV (future).
- Manual event entry (less common; optional).

## Assumptions

- First-time users primarily focus on importing calendars.
- Manual event creation is a secondary path.
- Overview/analysis is the main destination after import.

## Open questions

- Which filters are most important (calendar, date range, conflict type)?
- How should manual entry be presented without distracting from imports?
- Should the overview be a separate page or a modal/drawer from import?

## Success indicators

- User can import calendars without confusion.
- Conflicts/overlaps are visible within seconds after import.
- Filters reduce noise without hiding critical conflicts.
