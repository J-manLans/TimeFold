# Main screen: the menu

The menu's tabs and its values locked behind "Ändra". Each decision follows the template in `../../README.md`, and is
cited by its title.

## The menu has tabs, with every value locked behind "Ändra" (2026-11-17)

**Built by:** Breaks and flex days, for the tab row and the Tid tab with the flex-day calendar; Profiles, for the
Profiler and Orsaker tabs, the working time in Tid, and the reasons.

**Decision:** the menu has three tabs across its top: **Profiler**, **Tid** and **Orsaker**. Profiler is selected when
the menu opens, and one tab's content shows at a time; switching fades from one to the next. Beside the "Meny" heading
sits the theme button ("A light or dark theme, following the system").

- **Profiler:** each profile is a row (a small circle with its letter, its pair of colours swapping with where it stands
  ("Each profile carries its colours"), and its name). A row unfolds in place, its height growing and its content fading
  in, and folds back the same way; opening one folds any other. It shows its name, its colour ("Each profile carries its
  colours"), pay (a monthly salary or a rate per hour), pay category, and "Arkivera". "Ny profil" is at the bottom.
- **Tid:** the slider that splits full time between janitor's expected hours and the ceiling, with the numbers on it ("6
  | 2"); full time beside it; and "Flexledig", the calendar where flex days are marked ("A flex day can be marked ahead,
  and the screen counts it at once").
- **Orsaker:** the reasons an edit can be given, and the "Annan orsak" texts that keep coming up ("Every edit carries a
  reason").

Every value is locked: it shows as text with "Ändra" beside it. "Ändra" opens it; Enter confirms and Esc aborts, as in
"Entering a length of time". Values that change the counting (full time, the split, a salary or rate) then ask "Gäller
från", today unless the owner picks an earlier date ("Settings change from a date"), and under each, "Tidigare värden"
with a count opens its earlier values and the dates they held from. A name and a pay category are saved at once on
Enter, with no date and no history, since no count depends on them. Only one value is open for editing at a time:
"Ändra" on another aborts the open one, and saving one value never resets another or moves the focus away from where the
owner is. Colours and the theme change at once, from their pickers and button.

**Why:** tabs keep the names in a fixed place while the content swaps calmly below them. A value that changes past and
future counts should not move by a stray click, and Enter and Esc work as they do everywhere else. The earlier values
let the owner check what was in force when a month looks odd.

**Rejected:** a tab for colours and the theme: the colours went to the profiles and the theme to the heading. The month
start in a tab of its own: it belongs with the working time. Name and pay category edited directly: every field behaves
the same. Headings that expand: opening one pushes the others down, and one is always open anyway. One long menu to
scroll. Counting values edited directly. A "saldo" tag on the profile with the balance: it named a concept without
showing it, and even the owner did not read it right; the colour ring ties every profile to its figures instead.

**Revisit if:** the menu needs more than three or four sections.

**Cases:**

- Menu opened: the Profiler tab shows.
- A profile's name: "Ändra", a new name, Enter: saved at once, with no "Gäller från".
- Split 6 | 2, "Ändra", moved to 5 | 3, Enter, "Gäller från" 1 September: from then on janitor owes 5 h a day.
- "Ändra" on full time, a new value typed, Esc: full time is unchanged.
- After that change, "Tidigare värden (1)": 6 | 2 until 31 August.
- Split unlocked with "Ändra", then "Ändra" on full time: the split's edit is aborted; full time saved: the split shows
  the new total, and nothing else changes.
