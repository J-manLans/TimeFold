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
- What the app does

### [Stack](stack.md)

- Tauri, desktop on Windows and Linux

### [Code](code.md)

- Tests come first, from the owner's rules

### [Recording](recording.md)

- One start/stop button and a profile list
- A running entry from an earlier day asks
- Time away is a gap or an added break
- Entering a length of time

### [Profiles](profiles.md)

- Profiles label the hours
- The other profiles share a ceiling

### [Time](time.md)

- Expected hours: 6 a day, Monday to Friday
- Time counts on the day it was worked
- A day owes its expected hours only when work started on it

### [Reports](reports.md)

- The report is a PDF
