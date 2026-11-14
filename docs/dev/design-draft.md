# Design draft

The first drafts of the app, kept as written: the owner's design concept, and the agent's first draft of the
vision. Parts move out as they are talked through: decisions to `design-decisions.md`, questions to
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

---

## Vision, first draft

### Who it is for

The owner is a janitor at a Swedish-language school in Finland, with admin roles beside it (keys, surveys,
security systems) and a seat in the school's development group. Today they keep their hours in an Excel file: the
start time when they arrive and turn on the work computer, and at the end of the day the stop time and any time away
on errands. The file sums each day, and its front page shows whether the owner has hours to take out or hours to
work in. The app replaces that file.

### Where it is heading

A personal time clock for the owner's work day. One click when work starts, one click when it stops, and the app
keeps an honest record of the hours worked.

- **Clicking is the main way in.** Starting and stopping is a single action, quick enough to never be skipped.
- **The record can be fixed.** A forgotten click is written in by hand, and a clicked entry can be edited.
- **Errands come off the total.** Time away during the work day (an errand) is taken off, so the day's total is
  the time actually worked.
- **The balance is always in view:** hours to take out, or hours to work in, as the Excel front page shows today.
  Days off paid for with it are marked in one action, not typed in as zero days.
- **The record leaves the app as a report** the owner can send to their boss as it is.
- **It is the owner's alone.** One user, on the owner's own device, with no online connection and no account.

### What it is not

A team tool, a task tracker, a payroll or invoicing system, or anything that needs the internet. Profiles label
the hours (janitor work, the development group, work from home); the app counts hours per profile and never money.
Janitor work carries the balance; the other work shares a ceiling up to full time.

### Questions to ask of a new idea

1. Does starting and stopping stay one click?
2. Does it work with no connection, with the data kept only on the owner's device?
3. Does it make the record more trustworthy, or easier to correct?
4. Would the boss understand the report without the owner explaining it?
5. Does it add something the owner must think about every day? If so, it needs a strong reason.
