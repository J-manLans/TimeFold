# Main screen: the two sides

What sits where on the controls side and the dashboard. Each decision follows the template in `../../README.md`, and is
cited by its title.

## The main screen has a controls side and a dashboard (2026-11-14)

**Built by:** Profiles for the profile button; Handover for export and import; Corrections for editing from the lists;
Breaks and flex days for the days in "Visa alla".

**Decision:** the main screen has two sides, the controls side on the left and the dashboard on the right, split by a
thin line. The left side holds the controls and stays still: the start/stop button ("One start/stop button and a profile
list"), "Exportera" and "Importera" side by side under it, together as wide as it, greyed out while any profile runs;
the profile button beside both, as tall as the two rows, a rectangle holding a raised disc set in a dent ("The look: a
fresh display face, mono text and soft buttons") with the profile's first letter, capitalised, in the colour of where
the profile stands ("Each profile carries its colours"), which with more than one profile opens a popup of the profiles,
centred on the left side; under the block, the status line naming what runs and since when, which keeps its room even
when empty; under that, centred together, "Lägg till paus" (as wide as its text) and the round undo button ("The last
click can be undone for a few seconds"); "Lägg till paus" ("Time away is a gap or an added break"), a smaller, quieter
button, greyed out unless the profile on screen runs, whose length field opens in its place, text starting at the left;
the menu button at the top left, and at the bottom the line that offers pruning ("Old history is pruned on request"),
its room kept when there is nothing to offer and its line drawn only with the offer. The menu grows out of its own
button: pressed, the button's rounded rectangle expands from the top left into a panel over the controls side, stopping
at the divider, and the menu's content fades in once it is open; the three lines of the button turn into an × in the
same spot, where the menu closes, shrinking back into the button; Esc or a click anywhere outside the menu closes it
too. The panel is frosted: slightly see-through, with the controls side lightly blurred behind it, and in the light
theme tinted a little darker than the controls side so it stands out. The figures stay sharp and in view while settings
change. New profiles are made from the menu. The right side is narrower, two fifths of the window up to its launch width
of 440 px, beyond which the controls side takes the extra room, its figures spread down its full height; it is the
living one, changing at each stop, and looks like a modern terminal dashboard, not a retro one: a near-black panel in
the dark theme and a deep slate-blue one (#2c3e5c) in the light theme, its rows a step darker and its text light,
numbers in a monospaced font with their digits lined up, thin lines, small uppercase labels, and small, precise motion
(numbers counting to their new value, the arc sweeping). The colours come from the profiles ("Each profile carries its
colours"): the profile on screen colours the controls side and, when it is one of the others, the ceiling wheel; the
flex bar always wears the balance profile's. While the profile on screen runs, a ring in its neon surrounds the start
button. Every focus ring in the app takes the colour of where the profile on screen stands. On the right side, from the
top: the balance as a number, centred, with no label; the flex bar; the ceiling wheel, centred under it with nothing
beside it; the pay estimate as one quiet number under the wheel, with no label; then the five most recent entries and
"Visa alla", which opens a popup centred on the whole window listing every entry, grouped by day, where entries are
edited ("Editing an entry on its line"). Above the days, flex days marked ahead show as "Flexledig" rows, to move or
unmark ("A flex day can be marked ahead, and the screen counts it at once"). Each day opens with a header holding its
date and the day's net change to the janitor balance in whole minutes, however small, or "Flexledig" and its hours on a
flex day; an edited or hand-written entry shows its reason ("Every edit carries a reason"). Both lists hold stopped
entries, newest first by start, each row its day, its times, its profile's letter in the profile's base colour, and its
length; an entry that stops on a later day than it started reads on its first day, with a small "+1" after its end time
("21:30–07:00 ⁺¹"), "+2" two days later; one that runs shows in neither until it stops. The recent list always keeps
five rows' room, so "Visa alla" never moves; with no entry yet, "Inga poster ännu" sits centred in that room and "Visa
alla" is greyed out. The day headers and reasons stay in "Visa alla": the recent list and the rest of the main screen
show none of it. An entry's row, as it arrives at a stop, lights in the wheel's base colour (grey while the balance
profile is on screen) and fades.

**Why:** what the owner presses and what the owner reads each have their place. The menu growing out of its button makes
the icon part of the menu rather than a separate thing over it, and closing where it opened keeps the pointer still.
With the figures in view beside the menu, a colour changed in settings shows at once on the figures. The five most
recent entries show yesterday's work on a fresh morning, where today's alone would be an empty list. The break control
sits with what runs and never moves; the status line's kept room sets it a little apart, marking it as secondary. The
wheel tells its story alone, so nothing beside it is needed, and the side can be narrower. A dashboard look suits
figures that are read at a glance, and a soft base colour with a vivid accent is how such dashboards use colour. In the
light theme the slate blue has about half the contrast black had against the white controls side (9.7:1 against 17:1),
so it does not glare, while its light text stays sharp on it (9.6:1); blue is also the complement of the default orange,
so the figures stand out.

**Rejected:** Both days on a row across midnight ("tis–ons"): the end before the start already says it, and a small "+1"
fits the time's column. The rows' letters in the colour of where the profile stands: up to five neon letters under the
flex bar that already shows the standing; the base colour finds each profile's rows without it. Today's entries only:
empty every morning. A small flex bar beside a large wheel: both are figures the owner reads every day. Figures beside
the wheel (ceiling, used, left, carried): the wheel already shows them. A label on the balance: the number alone is
clear. "Lägg till paus" at the bottom left: the prune line would push it up and down. A menu over the whole screen: it
would hide the figures it changes. A drawer with a tab holding the icon: a fine picture, but more parts than the growing
button. The icon riding to the panel's far corner as an ×: the close button would not be where the pointer is. A menu
sliding in under a separate button: the icon would stay apart from the menu. A see-through menu always present: nothing
needs it when closed. A fully light dashboard in the light theme: the dashboard look would be lost. A near-black panel
in the light theme: it glared against the white controls. A mid-grey panel: its light text had too little contrast
(2.6:1). A violet panel: also good, kept as the alternative. A gradient for the divider, fading from the controls side:
tried in the prototype, and the owner preferred the line. A retro terminal look (green on black, scan lines): the owner
wants the direction, not the costume.

**Revisit if:** the frosted blur is slow on WebKitGTK (then the panel is more opaque, without blur).

**Cases:**

- One profile: the profile button opens nothing. Three profiles: a popup of the three, centred on the left side.
- Menu open: the figures are still in view, and a profile's new colour shows on them at once.
- No entry yet: "Inga poster ännu" centred in five rows' room, "Visa alla" greyed out. Two entries: the same room, "Visa
  alla" where it always is.
- A stop with the balance profile on screen: the new row lights grey and fades.
- An entry from Tuesday 21:30 to Wednesday 07:00: its row reads "tis 17", "21:30–07:00" with a small "+1", and the
  letter in its profile's base colour.
