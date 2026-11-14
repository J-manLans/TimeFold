# Design draft

The owner's first draft of the app, kept as written. The agent's first draft of the vision is settled in
`docs/vision.md`. Parts move out as they are talked through: decisions to `design-decisions/`, questions to
`open-questions.md`, the direction to `vision.md` at the end of Phase 0. Where these drafts and those files disagree,
those files win. This file goes once nothing in it is left to move.

---

## Work Hours — Design Concept

### Purpose

A small, self-contained desktop application for tracking working hours across multiple work profiles. It should work entirely offline, with a simple interface and a little visual flair.

### 1. Profiles

Profiles can be added through an **Add Profile** action, with relevant metadata supplied when creating them.

There are two types of profiles:

**Balancing profile — Janitor**

- Daily baseline of 6 working hours.
- Hours above 6 add to a positive time balance.
- Hours below 6 create a deficit.
- Surplus and deficit accumulate in an independent time bank.
- Surplus hours can be taken out whenever desired.

**Additional profiles**

- Used for other types of hourly work.
- No daily target or balancing mechanism.
- All additional profiles contribute to one shared monthly total.
- A monthly maximum serves as a workload reference, not an obligation.
- Hours exceeding the monthly maximum carry over to the next month. Otherwise, the counter resets to zero.

### 2. Time tracking

Both profile types use the same basic interaction.

For the active profile:

- Start day
- End day
- Start break
- End break

Each action records a timestamp. Paused time is excluded from working hours.

The primary interaction should be immediate: clicking a button records the event without requiring further input.

All timestamps can also be edited manually, including entering forgotten or correcting incorrectly recorded sessions.

### 3. Main interface

The interface has two primary areas.

**Left side — Time tracking**

Simple controls for starting, stopping and pausing work, with the active profile clearly indicated.

**Right side — Dashboard**

Two prominent visual indicators.

**Janitor balance**

A horizontal bar with a central zero reference line.

- Left represents a negative balance.
- Right represents a positive balance.
- Colour reinforces the direction.
- A numerical figure displays the exact balance.
- The bar always remains visible, even at zero, where a small indicator sits centred on the line.

When a workday ends, an animation summarizes the day's result and moves the bar to its new position.

**Additional work**

A large circular monthly progress indicator.

- The centre displays accumulated hours.
- The filled portion uses the selected colour.
- The unfilled portion uses a dimmed version of that colour.
- The circle fills as hours accumulate across all additional profiles.

At the beginning of a new month, excess hours carry forward; otherwise, the counter resets.

### 4. Manual time editing

Manual time entry uses a minimalist analogue clock picker.

Inspired by the dual-ring 24-hour clock interface:

- Inner and outer rings represent the 24 hours.
- Minutes are selected in a subsequent step.
- No AM/PM indicators or separate digital time fields.
- Clean, minimal visual styling.

The same clock component is used when editing start, end and break timestamps.

This is exclusively for manual entry and corrections. Normal time tracking always uses the four primary buttons.

### 5. Data persistence and synchronization

All application data is stored locally. No internet connection or online service is required.

The application provides:

- **Export:** Creates a single file containing all profiles, settings, work sessions and accounting data.
- **Import:** Loads an exported file and brings the local installation up to date.

Intended workflow: export at work, email the file to yourself, import it at home and continue using the application.

Importing must preserve data integrity and avoid accidental loss or duplication of recorded hours.

### 6. Design philosophy

Keep it small, contained and straightforward.

A personal utility rather than a full employment-management system. Prioritize quick interactions, clear information and reliable accounting.

The visual design should be minimal, modern and polished, with restrained use of colour, typography and animation. A little personality without unnecessary decoration.
