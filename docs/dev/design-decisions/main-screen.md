# Main screen

How the main screen is laid out and what its menu holds. How it looks is in `look.md`; the two figures and the
profiles' colours are in `figures.md`. Each decision follows the template in `README.md`, and is cited by its title.

## The main screen has a control side and a figures side (2026-11-14)

**Built by:** Clocking for the screen, the button, the balance bar and the list; Profiles for the profile button, the
ceiling wheel and the pay estimate; Handover for export and import.

**Decision:** the main screen has two sides, split by a divider (a sharp line or a gradient, settled when built). The
left side holds the controls and stays still: the start/stop button ("One start/stop button and a profile list"),
"Exportera" and "Importera" side by side under it, together as wide as it; the profile button beside both, as tall as
the two rows, a rectangle holding a raised disc set in a dent ("The look: a fresh display face, mono text, grain and
soft buttons") with the profile's first letter, capitalised, in the profile's colour, which with more than one profile
opens a popup of the profiles, centred on the left side; under the block, the status line naming what runs and since
when, which keeps its room even when empty; under that, centred together, "Lägg till paus" (as wide as its text) and the
round undo button ("The last click can be undone for half a minute"); "Lägg till paus" ("Time away is a gap or an added
break"), a smaller, quieter button, greyed out unless the profile on screen runs, whose length field opens in its place,
text starting at the left; the menu button at the top left, and at the bottom the line that offers pruning ("Old history
is pruned on request"). The menu grows out of its own button: pressed, the button's rounded rectangle expands from the
top left into a panel over the control side, stopping at the divider, and the menu's content fades in once it is open;
the three lines of the button turn into an × in the same spot, where the menu closes, shrinking back into the button;
Esc or a click anywhere outside the menu closes it too. The panel is frosted: slightly see-through, with the control
side lightly blurred behind it, and in the light theme tinted a little darker than the control side so it stands out.
The figures stay sharp and in view while settings change. New profiles are made from the menu. The right side is
narrower, about two fifths of the window, and is the living one, changing at each stop, and looks like a modern terminal
dashboard, not a retro one: a near-black panel in the dark theme and a deep slate-blue one (#2c3e5c) in the light theme,
its rows a step darker and its text light, numbers in a monospaced font with their digits lined up, thin lines, small
uppercase labels, and small, precise motion (numbers counting to their new value, the arc sweeping). The colours come
from the profiles ("Each profile carries its colours"): the profile on screen colours the control side and, when it is
one of the others, the ceiling wheel; the balance bar always wears the balance profile's. While the profile on screen
runs, a ring in its colour surrounds the start button. Every focus ring in the app takes the colour of the profile on
screen. On the right side, from the top: the balance as a number, centred, with no label; the balance bar; the ceiling
wheel, centred under it with nothing beside it; the pay estimate as one quiet number under the wheel, with no label;
then the five most recent entries and "Visa alla", which opens a popup centred on the whole window listing every entry,
where entries are edited ("Editing an entry on its line").
**Why:** what the owner presses and what the owner reads each have their place. The menu growing out of its button makes
the icon part of the menu rather than a separate thing over it, and closing where it opened keeps the pointer still.
With the figures in view beside the menu, a colour changed in settings shows at once on the figures. The five most
recent entries show yesterday's work on a fresh morning, where today's alone would be an empty list. The break control
sits with what runs and never moves; the status line's kept room sets it a little apart, marking it as secondary.  The
wheel tells its story alone, so nothing beside it is needed, and the side can be narrower. A dashboard look suits
figures that are read at a glance, and a soft base colour with a neon-leaning over colour is how such dashboards use
colour. In the light theme the slate blue has about half the contrast black had against the white control side (9.7:1
against 17:1), so it does not glare, while its light text stays sharp on it (9.6:1); blue is also the complement of the
default orange, so the figures stand out.
**Rejected:** today's entries only: empty every morning. A small balance bar beside a large wheel: both are figures the
owner reads every day. Figures beside the wheel (ceiling, used, left, carried): the wheel already shows them. A label on
the balance: the number alone is clear. "Lägg till paus" at the bottom left: the prune line would push it up and down. A
menu over the whole screen: it would hide the figures it changes. A drawer with a tab holding the icon: a fine picture,
but more parts than the growing button. The icon riding to the panel's far corner as an ×: the close button would not be
where the pointer is. A menu sliding in under a separate button: the icon would stay apart from the menu. A see-through
menu always present: nothing needs it when closed. A fully light figures side in the light theme: the dashboard look
would be lost. A near-black panel in the light theme: it glared against the white controls. A mid-grey panel: its light
text had too little contrast (2.6:1). A violet panel: also good, kept as the alternative. A retro terminal look (green
on black, scan lines): the owner wants the direction, not the costume.
**Revisit if:** the window is too small for both sides, or the frosted blur is slow on WebKitGTK (then the panel is more
opaque, without blur).
**Cases:**
- One profile: the profile button opens nothing. Three profiles: a popup of the three, centred on the left side.
- Menu open: the figures are still in view, and a profile's new colour shows on them at once.
- Seven entries since yesterday: the newest five are listed, and "Visa alla" opens the rest.

## The menu has two tabs, with every value locked behind "Ändra" (2026-11-14)

**Built by:** Profiles for the profiles, the working time and the month start; Clocking for the theme.

**Decision:** the menu has two tabs across its top: **Profiler** and **Tid**. Profiler is selected when the menu opens,
and one tab's content shows at a time; switching fades from one to the next. Beside the "Meny" heading sits the theme
button ("A light or dark theme, following the system").
- **Profiler:** each profile is a row (its disc and letter, its name, a mark on the profile with the balance). A row
  unfolds in place, its height growing and its content fading in, and folds back the same way; opening one folds any
  other. It shows its name, its base and over colour ("Each profile carries its colours"), pay (a monthly salary or a
  rate per hour), pay category, and "Arkivera". "Ny profil" is at the bottom.
- **Tid:** the slider that splits full time between janitor's expected hours and the ceiling, with the numbers on it
  ("6 | 2"); full time beside it; and the day the month starts, from 1 to 28 ("A month starts on a set day").
Every value is locked: it shows as text with "Ändra" beside it. "Ändra" opens it; Enter confirms and Esc aborts, as in
"Entering a length of time". Values that change the counting (full time, the split, the month start, a salary or
rate) then ask "Gäller från", today unless the owner picks an earlier date ("Settings change from a date"), and under
each, "Tidigare värden" with a count opens its earlier values and the dates they held from. A name and a pay category
are saved at once on Enter, with no date and no history, since no count depends on them. Only one value is open for
editing at a time: "Ändra" on another aborts the open one, and saving one value never resets another or moves the
focus away from where the owner is. Colours and the theme change at once, from their pickers and button.
**Why:** tabs keep the names in a fixed place while the content swaps calmly below them. A value that changes past and
future counts should not move by a stray click, and Enter and Esc work as they do everywhere else. The earlier values
let the owner check what was in force when a month looks odd.
**Rejected:** a tab for colours and the theme: the colours went to the profiles and the theme to the heading. The month
start in a tab of its own: it belongs with the working time. Name and pay category edited directly: every field behaves
the same. Headings that expand: opening one pushes the others down, and one is always open anyway. One long menu to
scroll. Counting values edited directly.
**Revisit if:** the menu needs more than three or four sections.
**Cases:**
- Menu opened: the Profiler tab shows.
- A profile's name: "Ändra", a new name, Enter: saved at once, with no "Gäller från".
- Split 6 | 2, "Ändra", moved to 5 | 3, Enter, "Gäller från" 1 September: from then on janitor owes 5 h a day.
- "Ändra" on full time, a new value typed, Esc: full time is unchanged.
- After that change, "Tidigare värden (1)": 6 | 2 until 31 August.
- Split unlocked with "Ändra", then "Ändra" on full time: the split's edit is aborted; full time saved: the split
  shows the new total, and nothing else changes.
