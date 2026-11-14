# Design decisions

The template, the principles most decisions follow, and every decision's title by area, each area linking the file
that holds its decisions. Read this index before a design opinion, and the area files the opinion touches. Present
tense: what is true now. Open questions stay out (`../open-questions.md`); so does state (`../roadmap.md`). Cite a
decision by its title, "in `design-decisions/`"; a split then changes only this index.

## Template

```
## Title (date last settled)

**Built by:** only while some of it is not built: the phase that builds it (before the roadmap is agreed, the part),
or "nothing on the roadmap yet" and what it waits on. The line goes when it is built. An entry without it is taken as
built.

**Decision:** what is true.
**Why:** the reason.
**Rejected:** alternatives worth not suggesting again, each with its reason.
**Revisit if:** the condition that would reopen it.
**Cases:** only while some are not yet tests: concrete examples, given this, expect that. Each case leaves when its
test is written.
```

When a decision changes, rewrite the entry to say what is true now; a reversal that still matters becomes a
rejected alternative. **Rejected** pays off most: an agent will suggest the elegant alternative that was turned down
for a reason it cannot see, and one line there stops it. **Built by** exists because a present-tense decision
written before its code reads as a description of the code. **Cases** keeps what was agreed in talk until its part
is built ("Tests come first, from the owner's rules"); a case that checks two decisions goes under the one it mainly
checks and names the other by title.

## Principles

- **One click to start or stop.** Anything that slows the click down needs a strong reason.
- **The record is the owner's and stays on their own machines.**
- **Work time is time present minus errands.** Every total in the app and in reports is counted this way.

## Decisions by area

### [Scope](scope.md)

- One user, offline, on the owner's machines
- Handover between machines
- A first install starts fresh or imports
- The app is in Swedish
- Old history is pruned on request
- A plain window app
- What the app does

### [Stack](stack.md)

- Tauri, desktop on Windows and Linux
- Svelte with TypeScript for the interface
- The record is one JSON file

### [Code](code.md)

- Tests come first, from the owner's rules

### [Recording](recording.md)

- One start/stop button and a profile list
- The last click can be undone for a minute
- A running entry from an earlier day asks
- Time away is a gap or an added break
- Entering a length of time

### [Profiles](profiles.md)

- Profiles label the hours
- The other profiles share a ceiling
- A pay estimate per profile
- Settings change from a date

### [Time](time.md)

- Expected hours: 6 a day, Monday to Friday
- Time counts on the day it was worked
- A day owes its expected hours only when work started on it
- A month starts on a set day

### [Corrections](corrections.md)

- Editing an entry on its line
- Entries remember how they were made

### [Main screen](main-screen.md)

- The main screen has a control side and a figures side
- The menu has two tabs, with every value locked behind "Ändra"

### [Look](look.md)

- The look: a fresh display face, mono text, grain and soft buttons
- A light or dark theme, following the system

### [Figures](figures.md)

- The balance bar
- The ceiling wheel
- Each profile carries its colours

### [Reports](reports.md)

- The report is a PDF
- A report covers one month
