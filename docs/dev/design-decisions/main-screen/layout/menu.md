# Main screen: the menu

The menu's tabs and its values locked behind "Ändra". Each decision follows the template in `../../README.md`, and is
cited by its title.

## The menu has tabs, with every value locked behind "Ändra" (2026-11-17)

**Built by:** Profiles, for the Profiler tab and the working time in Tid.

**Decision:** the menu has two tabs across its top: **Profiler** and **Tid**. Profiler is selected when the menu opens,
and one tab's content shows at a time; switching fades from one to the next. The head ("Meny", the theme and motion
buttons, and the × the menu button became) sits close on the tabs, and both stay put: only the tab's content scrolls, up
to the tabs' line, so nothing passes under the × and the tabs are always in reach. Beside the "Meny" heading sits the
theme button ("A light or dark theme, following the system").

- **Profiler:** first, one row of the settings for every profile, set apart from the profiles by a line: "Efter skatt",
  a checkbox drawn as the app's own, so every engine shows it alike (checked, the neon of the profile on screen with a
  white mark), and "Skatt och avgifter", its percentage as a tag ("A pay estimate per profile"); then each profile is a
  row (a small circle with its letter, its pair of colours swapping with where it stands ("Each profile carries its
  colours"), and its name). A row unfolds in place, its height growing and its content fading in, and folds back the
  same way; opening one folds any other. It shows its colour first, compact on one line, the pair with "Ändra" beside it
  ("Each profile carries its colours"), then its name, pay (a monthly salary for the profile with the balance, a rate
  per hour for the others), and "Arkivera" or "Ta bort" ("A profile with hours is archived, one without is deleted").
  "Ny profil" is under the rows, a button that turns into the name field in its own place, as "Ändra" does; Enter makes
  the profile and unfolds its row, its colours by the largest gap, and Esc or a click outside turns the field back into
  the button. Under it, "Arkiverade" folds the archived profiles away.
- **Tid:** "Heltid", full time, entered as a week and shown with the day it gives after it in the muted colour ("38h
  15min / vecka", then "7h 39min / dag"), with no divider, so "|" in the menu only ever means a split; "Fördelning", the
  slider that splits the week between janitor's expected hours and the ceiling, in quarter hours, with the week's
  numbers as its value ("30h | 8h 15min"), following the slider as it moves, and no day, since Heltid shows it; and
  "Flexledig", labelled as they are, the calendar where flex days are marked ("A flex day can be marked ahead, and the
  screen counts it at once"). Nothing else: the tab says what each value means by its numbers. The reasons an edit can
  be given are kept in the edit's own list, not in the menu ("Every edit carries a reason").

Every value is locked: its label, then its text, with "Ändra" under the text. "Ändra" turns into the value's field in
its own place, and the text above stays as it was, so the old value reads while the new one is typed; the text changes
only when the value is saved. Enter confirms, and Esc or a click anywhere outside the open value aborts; Enter on a
value as it opened does what Esc does, nothing saved and no date asked. Esc closes only the open value, wherever the
focus is, and the next Esc closes the menu. The flex-day calendar is not a value and has no "Ändra". Values that change
the counting (full time, the split, a salary or rate) then ask "Gäller från": on Enter the field turns, in the same
place, into what waits and its date ("38h 30min från", a date field opening on the first of next month for full time and
the split and on today for pay, which the owner may move to any day, "Settings change from a date"), and a second Enter
saves it. Under each, "Tidigare värden" with a count opens its earlier values and the dates they held from. The split's
slider has no "Ändra": it can always be moved, and its first move folds open "från", the date and "Spara" and "Avbryt"
under it, as a profile row unfolds; moved back to the saved value, they fold shut again, as if nothing was moved;
"Spara" or Enter saves, and "Avbryt", Esc or a click outside drops the move, the slider and its numbers going back, and
folds it shut. A value saved from a date that would not fit beside another setting on some day from that date is
refused, its date left open with the reason in the warning red ("The other profiles share a ceiling"); changing the date
clears it. A name is saved at once on Enter, with no date and no history, since no count depends on them. Closing the
menu drops anything left open in it. Only one value is open for editing at a time: "Ändra" on another aborts the open
one, and saving one value never resets another or moves the focus away from where the owner is. Colours and the theme
change at once, from their pickers and button. "Efter skatt" changes at once too. "Skatt och avgifter" is a tag drawn as
an edit's "paus" tag, in its size and border, lighting under the pointer, that opens a field in its own border, as the
"paus" tag does ("An edited entry's break"): Enter keeps it, and Esc or a click outside drops it; a value out of 0 to
under 100 is refused, its field red and open.

**Why:** tabs keep the names in a fixed place while the content swaps calmly below them. A value that changes past and
future counts should not move by a stray click, and Enter, Esc and a click outside work as they do everywhere else
("Entering a length of time"). The earlier values let the owner check what was in force when a month looks odd. "Ändra"
turning into its field in its place is what "Lägg till paus" does, and nothing in the row moves; the text staying says
what is being changed. A slider is grabbed on purpose and a move saves nothing, so the lock would only add a click; with
the mouse in hand after a drag, buttons are nearer than Enter, and the move is the first step, so the date comes with
them.

**Rejected:** "Efter skatt" and "Skatt och avgifter" as two locked values on lines of their own: two rows for one small
setting, read rarely; the tag keeps them on one line, and nothing is counted from the percentage but the estimate. The
whole menu scrolling, the × floating over the content as it passed under it; or scrolling with it, the tabs scrolled
away too, so another tab meant scrolling back first. An empty name field always waiting at the bottom of Profiler: the
one field in the menu not behind its button. The value's text swapped for its field: the old value was gone while
typing, which read as cryptic, and the row jumped at each step. "Gäller från" on a line of its own under the field: the
same place changing once more keeps the row still. A dot between Heltid's week and day: two marks for two meanings, and
the day reads as a quieter note without one. The split's slider behind "Ändra", and its "Spara" first and the date
after: a click and a step more for a move that saves nothing. A legend under the slider: the numbers as its value
already say it. "Profilfördelning": too long for the label's column. A tab for colours and the theme: the colours went
to the profiles and the theme to the heading. The flex-day calendar behind "Ändra": a day off is marked on purpose and
shows at once on the flex bar, so a lock would only add a click. A line under the split explaining the ceiling: the
slider's numbers already say it. The name edited directly: every field behaves the same. Headings that expand: opening
one pushes the others down, and one is always open anyway. One long menu to scroll. Counting values edited directly. A
"saldo" tag on the profile with the balance: it named a concept without showing it, and even the owner did not read it
right; the colour ring ties every profile to its figures instead.

**Revisit if:** the menu needs more than three or four sections.

**Cases:**

- Menu opened: the Profiler tab shows.
- Profiler scrolled down: the head and the tabs stay, and the content slides up to the tabs' line.
- "Ny profil", "Städ", Enter: the profile is made and its row unfolds, and "Ny profil" is a button again. "Ny profil",
  Esc: the button again, nothing made; an empty Enter: nothing happens.
- A value open, then the menu closed and opened: the value is locked again, as it was.
- A profile's name: "Ändra", a new name, Enter: saved at once, with no "Gäller från".
- Split 30h | 8h 15min, the slider moved to 25h | 13h 15min: the numbers follow, and "från", today's date, "Spara" and
  "Avbryt" fold open under it; the date set to 1 September, "Spara": from then on janitor owes 5 h a weekday, and the
  row folds shut.
- The slider moved, then "Avbryt", Esc or a click outside: the slider and its numbers go back to 30h | 8h 15min, and the
  row folds shut.
- Heltid "Ändra": the text "38h 15min / vecka" stays, and a field opens where "Ändra" was; 38:30, Enter: the field turns
  into "38h 30min från" and today's date, and the text still reads 38h 15min; Enter: it reads 38h 30min.
- "Ändra" on full time, a new value typed, Esc: full time is unchanged, and the menu stays open; Esc again: it closes.
- The split's slider moved, then a click on the menu's empty space: the move is dropped.
- After that change, "Tidigare värden (1)": 30h | 8h 15min until 31 August.
- The split's slider moved, then "Ändra" on full time: the split's move is dropped; full time saved: the split shows the
  new total, and nothing else changes.
