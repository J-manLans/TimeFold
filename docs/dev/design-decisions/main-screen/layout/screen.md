# Main screen: the two sides

What sits where on the controls side and the dashboard. Each decision follows the template in `../../README.md`, and is
cited by its title.

## The main screen has a controls side and a dashboard (2026-11-14)

**Built by:** Handover, for export and import.

**Decision:** the main screen has two sides, the controls side on the left and the dashboard on the right, split by a
thin line. The left side holds the controls and stays still: the start/stop button ("One start/stop button and a profile
list"), "Exportera" and "Importera" side by side under it, together as wide as it, greyed out while any profile runs;
the profile button beside both, as tall as the two rows, a rectangle holding a raised disc set in a dent ("The look: a
fresh display face, mono text and soft buttons") with the profile's first letter, capitalised, in the colour of where
the profile stands ("Each profile carries its colours"), which opens a popup of the profiles, centred on the left side,
or, with only one profile not archived, a popup holding "Skapa ny profil" alone, which opens the menu on Profiler with
"Ny profil" already turned into its field; under the block, the status line naming what runs and since when, which keeps
its room even when empty; under that, centred together, "Lägg till paus" (as wide as its text) and the round undo button
("The last click can be undone for a few seconds"); "Lägg till paus" ("Time away is a gap or an added break"), a
smaller, quieter button, greyed out unless the profile on screen runs, whose length field opens in its place, text
starting at the left; the menu button at the top left, and at the bottom the line that offers pruning ("Old history is
pruned on request"), its room kept when there is nothing to offer and its line drawn only with the offer. The menu grows
out of its own button: pressed, the button's rounded rectangle expands from the top left into a panel over the controls
side, stopping at the divider, and the menu's content fades in once it is open; the three lines of the button turn into
an × in the same spot, where the menu closes, shrinking back into the button; Esc or a click anywhere outside the menu
closes it too, except "Visa alla" and its popup, which keep it open: closing the popup comes back to the menu, and Esc
there closes only the popup. The panel is frosted: slightly see-through, with the controls side lightly blurred behind
it, and in the light theme tinted a little darker than the controls side so it stands out. The figures stay sharp and in
view while settings change. New profiles are made from the menu. The right side keeps one width side by side, 440 px,
two fifths of the window at launch, and the controls side takes the rest, its figures spread down its full height; it is
the living one, changing at each stop, and looks like a modern terminal dashboard, not a retro one: a near-black panel
in the dark theme and a deep slate-blue one (#2c3e5c) in the light theme, its rows a step darker and its text light,
numbers in a monospaced font with their digits lined up, thin lines, small uppercase labels, and small, precise motion
(numbers counting to their new value, the arc sweeping). The colours come from the profiles ("Each profile carries its
colours"): the profile on screen colours the controls side and, when it is one of the others, the ceiling wheel; the
flex bar always wears the balance profile's. While the profile on screen runs, a ring in its neon surrounds the start
button. Every focus ring in the app takes the colour of where the profile on screen stands. A popup moves the focus in
as it opens and back as it closes, but the ring shows on opening only if it was opened with the keyboard, and on closing
only if it was both opened and closed with the keyboard; a click, Esc after a click, or the app opening a popup by
itself leaves none, and the next key brings it back. On the right side, from the top: the balance as a number, centred,
with no label; the flex bar; the ceiling wheel, centred under it with nothing beside it; the pay estimate as one quiet
number under the wheel, with no label, and the ceiling's trend beside it as another ("The ceiling's trend"); then the
five most recent entries and "Visa alla", which opens a popup centred on the whole window listing every entry, where
entries are edited ("Editing an entry on its line"). Its rows are the recent list's; where the list crosses into a
month, a quiet bold line names the month and its year ("november 2026"). Flex days are not in it: they are seen in the
calendar ("A flex day can be marked ahead, and the screen counts it at once"). An edited or hand-written entry shows its
reason ("Every edit carries a reason"). Both lists hold the entries newest first by start, a running one at the top,
each row its day, its times, its profile's letter in the profile's base colour, and its length; an entry that stops on a
later day than it started reads on its first day, with a small "+1" after its end time ("21:30–07:00 ⁺¹"), "+2" two days
later. A running entry shows its start alone ("11:00") and "--:--" for its length, the whole row in its profile's neon,
the colour of what is happening now; it opens as any row ("A running entry is edited at its start"), and the recent list
then holds it and the four newest stopped. The recent list always keeps five rows' room, so "Visa alla" never moves;
with no entry yet, "Inga poster ännu" sits centred in that room and "Visa alla" is greyed out. The month lines and
reasons stay in "Visa alla": the recent list and the rest of the main screen show none of it. An entry's row, as it
arrives at a stop, lights in the wheel's base colour (grey while the balance profile is on screen) and fades.

**Why:** what the owner presses and what the owner reads each have their place. The menu growing out of its button makes
the icon part of the menu rather than a separate thing over it, and closing where it opened keeps the pointer still.
With the figures in view beside the menu, a colour changed in settings shows at once on the figures. The five most
recent entries show yesterday's work on a fresh morning, where today's alone would be an empty list. The profile button
always answers: with one profile it points to where the next one is made, while the everyday popup lists only the
profiles. The break control sits with what runs and never moves; the status line's kept room sets it a little apart,
marking it as secondary. The wheel tells its story alone, so nothing beside it is needed, and the side can be narrower.
A dashboard look suits figures that are read at a glance, and a soft base colour with a vivid accent is how such
dashboards use colour. In the light theme the slate blue has about half the contrast black had against the white
controls side (9.7:1 against 17:1), so it does not glare, while its light text stays sharp on it (9.6:1); blue is also
the complement of the default orange, so the figures stand out.

**Rejected:** days grouped under headers with each day's net change: the flex bar carries the balance, the figure served
only checking against the Excel, and one row everywhere reads simpler. The month on every row of "Visa alla": longer
rows, and the two lists would no longer share one. Both days on a row across midnight ("tis–ons"): the end before the
start already says it, and a small "+1" fits the time's column. The rows' letters in the colour of where the profile
stands: up to five neon letters under the flex bar that already shows the standing; the base colour finds each profile's
rows without it. Today's entries only: empty every morning. A running entry kept out of both lists until it stops: a
forgotten start, the commonest fix, is noticed while working, and stopping, fixing and starting again would split the
entry. A small flex bar beside a large wheel: both are figures the owner reads every day. Figures beside the wheel
(ceiling, used, left): the wheel already shows them. A label on the balance: the number alone is clear. "Skapa ny
profil" always last in the profile popup: a line used a handful of times in a popup opened several times a day. A
profile button that opens nothing with one profile: the first press there, looking for where to add one, got no answer.
"Lägg till paus" at the bottom left: the prune line would push it up and down. A menu over the whole screen: it would
hide the figures it changes. A drawer with a tab holding the icon: a fine picture, but more parts than the growing
button. The icon riding to the panel's far corner as an ×: the close button would not be where the pointer is. A menu
sliding in under a separate button: the icon would stay apart from the menu. A see-through menu always present: nothing
needs it when closed. A fully light dashboard in the light theme: the dashboard look would be lost. A near-black panel
in the light theme: it glared against the white controls. A mid-grey panel: its light text had too little contrast
(2.6:1). A violet panel: also good, kept as the alternative. A gradient for the divider, fading from the controls side:
tried in the prototype, and the owner preferred the line. A retro terminal look (green on black, scan lines): the owner
wants the direction, not the costume.

**Revisit if:** the frosted blur is slow on WebKitGTK (then the panel is more opaque, without blur).

**Cases:**

- One profile: the profile button opens a popup of "Skapa ny profil" alone; pressed, the menu opens on Profiler with the
  name field open. Three profiles: a popup of the three, centred on the left side.
- Two profiles, one archived: the profile button opens "Skapa ny profil" alone.
- Menu open: the figures are still in view, and a profile's new colour shows on them at once.
- Menu open, "Visa alla" pressed: the popup opens over it; Esc closes the popup and the menu is still open; Esc again
  closes the menu.
- No entry yet: "Inga poster ännu" centred in five rows' room, "Visa alla" greyed out. Two entries: the same room, "Visa
  alla" where it always is.
- "Visa alla" with entries from September to November: "november 2026" above November's rows, then "oktober 2026", then
  "september 2026"; the recent list has no month line.
- A flex day with nothing worked: not in "Visa alla".
- A stop with the balance profile on screen: the new row lights grey and fades.
- An entry from Tuesday 21:30 to Wednesday 07:00: its row reads "tis 17", "21:30–07:00" with a small "+1", and the
  letter in its profile's base colour.
- Janitor work running since 11:00: both lists head with a row "11:00", "--:--", in janitor work's neon; the recent list
  shows it and the four newest stopped.

## An info button shows the version (2026-11-27)

**Built by:** Handover.

**Decision:** the controls side has a small info button, a circled "i" drawn as an SVG icon, that opens a small popup in
the popups' frame showing the app's version and one short line about what TimeFold is for. Nothing else: no about or
help pages. Where the button sits and the popup's line are drawn in the prototype first.

**Why:** the version is wanted at a glance, as when a fault is reported, and one click reaches it. A small app that does
one job needs no about page, and there is nothing yet to put in one.

**Rejected:** an "Om" tab in the menu: two clicks for something looked at once, and the menu holds settings. "Om" and
"Hjälp" buttons in the popup: nothing to write in them; how the app works would be long and soon out of date.

**Revisit if:** the app gets something to say beyond its version, such as a changelog with the updater.
