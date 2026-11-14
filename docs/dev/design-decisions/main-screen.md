# Main screen

What the owner sees: the layout of the main screen, and how its two figures, the balance bar and the ceiling wheel,
are drawn and coloured. Each decision follows the template in `README.md`, and is cited by its title.

## The main screen has a control side and a figures side (2026-11-14)

**Built by:** Clocking for the screen, the button, the balance bar and the list; Profiles for the profile button, the
ceiling wheel and the pay estimate; Handover for export and import.

**Decision:** the main screen has two sides, split by a divider (a sharp line or a gradient, settled when built). The
left side holds the controls and stays still: the start/stop button ("One start/stop button and a profile list"),
"Exportera" and "Importera" side by side under it, together as wide as it; the profile button beside both, as tall as
the two rows, a rectangle holding a raised disc set in a dent ("The look: a fresh display face, mono text, grain and
soft buttons") with the profile's first letter, capitalised, in the profile's colour, which with more than one profile
opens a popup of the profiles, centred on the left side; under the block, the status line naming what runs and since
when, which keeps its room even when empty; under that, centred and as wide as its text, "Lägg till paus" ("Time away is
a gap or an added break"), a smaller, quieter button, greyed out unless the profile on screen runs, whose length field
opens in its place, text starting at the left; the menu button at the top left, and at the bottom the line that offers
pruning ("Old history is pruned on request"). The menu grows out of its own button: pressed, the button's rounded
rectangle expands from the top left into a panel over the control side, stopping at the divider, and the menu's content
fades in once it is open; the three lines of the button turn into an × in the same spot, where the menu closes,
shrinking back into the button; Esc or a click anywhere outside the menu closes it too. The panel is frosted: slightly
see-through, with the control side lightly blurred behind it, and in the light theme tinted a little darker than the
control side so it stands out. The figures stay sharp and in view while settings change. New profiles are made from the
menu. The right side is narrower, about two fifths of the window, and is the living one, changing at each stop, and
looks like a modern terminal dashboard, not a retro one: a near-black panel in the dark theme and a deep slate-blue one
(#2c3e5c) in the light theme, its rows a step darker and its text light, numbers in a monospaced font with their digits
lined up, thin lines, small uppercase labels, and small, precise motion (numbers counting to their new value, the arc
sweeping). The colours come from the profiles ("Each profile carries its colours"): the profile on screen colours the
control side and, when it is one of the others, the ceiling wheel; the balance bar always wears the balance profile's.
While the profile on screen runs, a ring in its colour surrounds the start button. Every focus ring in the app takes the
colour of the profile on screen. On the right side, from the top: the balance as a number, centred, with no label; the
balance bar; the ceiling wheel, centred under it with nothing beside it; the pay estimate as one quiet number under the
wheel, with no label; then the five most recent entries and "Visa alla", which opens a popup centred on the whole window
listing every entry, where entries are edited ("Editing an entry on its line").
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

## The look: a fresh display face, mono text, grain and soft buttons (2026-11-14)

**Built by:** Clocking, with the first screen.

**Decision:** the app's look, from the owner's art direction references (kept locally, not in git) and settled on the
main screen sketch:
- **Type:** Bricolage Grotesque, bold and at its narrowest width (75%), for the big things: "Starta jobb", the profile
  letter, the balance and the hours inside the ceiling wheel. JetBrains Mono for all other text on both sides, in
  normal case. The quiet lines, what runs, the offer to prune and the short messages after an action (such as
  "Rensar efter en kopia"), share one small size (10.5 px) in the muted colour.
- **Colour:** flat fields with one hot accent, which the over colour already is. Each theme colour is set once, with its
  light and dark value side by side. The figures side is near-black in the dark theme and slate blue in the light theme,
  each a tinted family of panel, rows, lines and text ("The main screen has a control side and a figures side").
  Contrast is balanced across the themes, a little stronger in the light one, where faint lines read weaker at the same
  ratio: in the menu, lines stand at about 1.6:1 (light) and 1.5:1 (dark) against its frost, and the borders of fields
  and small buttons at about 2.2:1 and 2.0:1, as measured on the sketch.
- **Grain:** a fine noise over both panels, stronger on the figures side, so surfaces read as printed rather than
  glassy.
- **Buttons:** flat, in the theme's button colour (in the light theme a light cool grey, `#d3d8de`, 1.29:1 against the
  page and the same as the profile popup, hovered a step darker, `#c3c9d1`; the text on buttons near-black, 13.3:1, and
  11.4:1 hovered, and a little bolder on the smaller buttons), with no border and no shading: corners of 5 px and a
  soft, quiet shadow offset down and to the right (2 by 3 px, 12 px blur, 14% black). Hovered, a little lighter;
  pressed, a faint shade from the top. Small controls and fields have 6 px corners, panels and popups 12 px.
- **Profile circle:** a raised disc in the button's own colour, lit from the top, sitting in a soft dent 6 px wide
  around it, after a CodePen pen (bthehuman, MIT); the dent is see-through in both themes, so it is always a soft shade
  of the button's own colour, whatever that colour is.
- **Ornament:** micro labels, registration marks and barcode strips only where they carry meaning; none for
  decoration alone.
- In code, these values are named variables in one place, so the look is tuned there.
**Why:** the owner likes the references' printed, technical feel, with something fresher and more modern for the big
type. A mono for the rest ties the controls to the dashboard. Flat buttons with one soft shadow keep the surfaces
calm; the indented disc gives the profile button a physical touch.
**Rejected:** a flat saturated colour field for the figures side: the dark panel stays. Rounder condensed faces
(Saira Extra Condensed, Big Shoulders Display, Teko): too round. Tektur, condensed: square and technical, but not
fresh enough for the big type; tried for all text, it was too much. Matte plastic buttons with grain, edge highlights
and a deeper shadow: they looked like 1990s 3D. Shaded or glossy buttons. A white profile circle: the button's own
colour reads better. Decorative micro labels: they say nothing.
**Revisit if:** the mono is hard to read at small sizes, or the grain costs too much on WebKitGTK.

## A light or dark theme, following the system (2026-11-14)

**Built by:** Clocking.

**Decision:** the app has a theme setting: "System" (the default, following the computer's light or dark mode), "Ljust"
or "Mörkt". It is a round button beside the menu's heading, drawn like the profile button's disc in its dent: a sun for
Ljust, a moon for Mörkt, a half-filled circle for System; each click moves to the next, and a label names the one in
force. The figures side follows it too, as a near-black panel in the dark theme and a slate-blue one in the light theme
("The main screen has a control side and a figures side"). Like the colours, the theme belongs to each machine and is
not carried by the handover.
**Why:** the owner's two computers may be set differently, and following the system needs no choice at all; the
setting is there for when the app should differ from the system.
**Rejected:** three buttons in a tab of their own: one round button in the heading is enough. One fixed theme: the
control side should sit well beside the rest of the owner's desktop. The theme in the handover: each machine is set up
for its own screen and room.
**Revisit if:** the figures side should follow the theme after all.
**Cases:**
- System in dark mode, theme "System": the control side is dark.
- Theme "Ljust" on a dark system: the control side is light, and the figures panel slate blue.

## The balance bar (2026-11-14)

**Built by:** Clocking; its colours from the balance profile in Profiles.

**Decision:** the janitor balance shows as a horizontal bar from a 0 line, minus to the left and plus to the right, with
the balance as a number above it. The bar is only its active part, with no track behind it, and is rounded only at its
outer end, square against the 0 line. It takes the colours of the profile with the balance ("Each profile carries its
colours"): minus (hours to work in) in its base colour; plus (hours to take out) in its over colour; exactly 0 a marker
centred on the 0 line, a little wider than a thin mark, in the base colour dimmed, slowly and slightly growing and
shrinking; the motion stops when the system asks for reduced motion. The bar's full width is one of four scales, ±10,
±20, ±40 or ±80 h, with ten small marks on each side from the 0 line to the scale's end, the end mark taller and
labelled in small text: the smallest whose 90% holds the balance. Crossing into a larger scale changes it with a short
animation; it goes back down only once the balance is within 80% of the smaller scale, so it does not flicker at a
boundary. Beyond ±80 h the bar stays full at its end. A large minus gets no warning.
**Why:** one meaning per colour: the over colour is "more than expected", which a plus balance is; minus is work still
to do, in the calm base colour; dimmed is "nothing either way". The bar is always janitor work, so it always wears the
balance profile's colours. With no track, the dimmed marker at 0 stands on its own, and its slow pulse reads as at
rest. Fixed scales keep the bar's length meaningful (half the bar is half the labelled amount) while a balance saved up
for a holiday week still fits.
**Rejected:** a track behind the bar in the dimmed colour: the 0 marker would vanish into it. Minus in the over colour:
the over colour means hours beyond what is owed, which minus is not. Colours of the bar's own, shared with the wheel
through a "Förena färger" switch: the colours belong to the profiles. A warning for a large minus: the owner does not
want one. One fixed width cut off at its end: past it, the length means nothing. A scale always fitted to the balance:
the bar would always look full.
**Revisit if:** the scale changes feel jumpy in daily use (a compressed far end, linear near 0, was the alternative).
**Cases:**
- Balance 0: the dimmed marker sits centred on the 0 line.
- Balance −3:00: a bar to the left in Vaktmästare's base colour.
- Balance +5:00: a bar to the right in Vaktmästare's over colour.
- Balance +12:00: the scale is ±20 h, and the bar reaches 60% of its side.
- Balance +21:00: the scale grows to ±40 h with a short animation; back at +17:00 it stays ±40 h; at +15:00 (within
  80% of 20) it returns to ±20 h.
- Utveckling on screen: the bar keeps Vaktmästare's colours.

## The ceiling wheel (2026-11-14)

**Built by:** Profiles.

**Decision:** the ceiling shows as a ring, the ceiling wheel, with the month's used hours as a number in its centre. A
full ring is the month's ceiling. It takes the colours of the profile on screen when that is one of the other profiles,
and greys while the profile with the balance is on screen: base `#9aa3ae`, over a light grey `#e2e6eb` (not the red the
colour rule would suggest), so the dimmed rest, the base and the over lap are three clearly different greys, dark,
middle and light, ("Each profile carries its colours"); a report draws it in the grey. Used hours fill the ring
clockwise from 12 o'clock in the base colour; the unused rest is dimmed. Hours over the ceiling are in the over colour:
a second lap from 12 o'clock, drawn over the base colour on the same ring. That lap is what carries into the next month,
where those hours show in the base colour. From 90% of the ceiling the centre number takes the over colour; the ring
keeps its colours. The wheel's numbers never depend on its colours: switching profile changes only how it looks.
**Why:** the over lap shows the excess the moment it happens, and a full ring always means the ceiling; one ring reads
at a glance. The number warns in the colour that is coming. The wheel sums all the other profiles, so its colour says
which of them is on screen; with the balance profile on screen, none is, hence greys that sit on both themes' panels;
the light grey keeps "over" readable without a colour that belongs to no profile.
**Rejected:** the excess as a thinner second ring inside: two rings to read for one figure. Shrinking the ring so the
used and the excess share it: a full ring would stop meaning the ceiling. An amber number at 90%: the over colour says
the same and needs no third colour. Colours of the wheel's own, set per machine: the colours belong to the profiles.
The wheel in segments, one per profile: more than the owner needs. Keeping the last other profile's colours while the
balance profile is on screen: the wheel would seem to belong to a profile that is not chosen.
**Revisit if:** a month goes more than a whole ceiling over, which one lap cannot show.
**Cases:**
- Ceiling 42 h, 21 h used: half the ring in the base colour, half dimmed; the number in the base colour.
- Ceiling 42 h, 38 h used: the number in the over colour (90% is 37.8 h); the ring has no over lap.
- Ceiling 42 h, 46 h used: the ring full, with the over colour over 4/42 of it from 12 o'clock; the next month starts
  with 4 h in the base colour.
- Utveckling (blue) on screen: the wheel is blue; Vaktmästare on screen: the wheel is grey `#9aa3ae` with a light grey
  `#e2e6eb` over the ceiling; the hours are the same in both.

## Each profile carries its colours (2026-11-14)

**Built by:** Profiles.

**Decision:** each profile has a base colour and an over colour, set in its row in the menu, each with the system's
colour picker; they change at once, not from a date, since no count depends on them, and they travel with the profile
in the handover. The profile with the balance starts with the base `#d78951`, a soft orange; the first start asks for
its colours ("A first install starts fresh or imports"). A new profile's base is the colour farthest from the others:
in OKLCH, the hue in the middle of the largest gap between the existing profiles' base hues on the colour circle (a
random pick between gaps of equal size), at their average lightness and vividness. The colours go to:
- the control side, for the profile on screen: its letter (in the over colour), the ring around the start button, the
  warning label, the focus rings, the status line's mark;
- the balance bar, always the balance profile's ("The balance bar");
- the ceiling wheel, the profile on screen's when it is one of the others ("The ceiling wheel").
The over colour starts as a suggestion worked out from the base, and a new base brings a new suggestion; the owner may
pick another, and go back to the suggestion with one click. Nothing warns when a picked over colour is close to the
base: it is the owner's choice. The suggestion, in OKLCH: the base's hue turned 55° toward red (hue 29°), stopping at
red, going down through yellow for hues up to 170° and up through violet above; a grey base (chroma under 0.04) turns
to red. The turned hue is taken at the lightness where it is most vivid (the most chroma sRGB allows, sought between
lightness 0.2 and 0.98), and as vivid as sRGB allows at that lightness, but at least 0.15 lighter or darker than the
base: lighter only when the hue turned at least 10°, its most vivid lightness is at least 0.15 above the base and the
base is at most 0.75, or when darker would fall under 0.3. The dimmed colour is the base mixed 70% toward the panel's
background, in OKLab; when that leaves it within 0.15 lightness of the base, it sits 0.15 past the background instead,
on the side away from the base, in the base's hue at 30% of its chroma, if that lands between lightness 0.05 and 0.98.
**Why:** a colour per profile tells the profiles apart where they are chosen and run, and the figures follow the
profile they belong to; the largest gap keeps every new colour as far as possible from its neighbours. Turning toward
red reads as "too much" in any colour family. Where two colours meet edge to edge the eye parts them by lightness, and
two strong colours of equal lightness flicker, hence the gap. No formula suits every base, so the suggestion can be
overridden. A profile's colours are part of the profile, so they look the same on both machines.
**Rejected:** colours of the figures' own, with a switch to unify them: the profiles now carry them. Colours derived
from the figures: every profile but the balance one shared the wheel's colour. Random colours for new profiles: two
could land side by side. Colours per machine, out of the handover: a profile would look different at work and at home.
The over colour always red: a red base would hide it. Turning 30°: blue, cyan, yellow and pink stayed too close to
their base. Always darker: green went olive and orange brown. The rule's numbers as settings: they could undo the
contrast; they are tuned once, by eye, on a sketch. Example swatches, or a grid of options for the over colour: the
owner picks once and knows what they want. A picker built into the app: the system dialog costs nothing.
**Revisit if:** the suggestion is often overridden, or the system colour dialog is awkward on one of the machines.
**Cases:**
- Profiles at base hues 29° and 210°: the gaps are 181° and 179°, so a new profile gets about 120°.
- A third profile added to two opposite ones: it lands in the middle of one of the two equal gaps.
- Suggestions: orange `#f28c28` gives red `#e80003`; green `#3aa655` gives golden yellow `#fcd000`; purple `#8e5bd6`
  gives deep magenta `#940056`; blue `#3b7be0` gives deep violet `#7d00a5`; cyan `#1fb5c4` gives blue `#0064fc`;
  yellow `#e8c22a` gives red-orange `#fd5300`; pink `#e35d9c` gives crimson `#c50001`; red `#d93a3a` gives dark red
  `#9e0001`; grey `#8a8a8a` gives dark red `#b40001`; black and white give red `#ff0a0a`; the soft orange `#d78951`
  gives red `#d60002`.
- Black on a dark panel: the dimmed colour is a dark grey, lighter than the panel.
- A profile's base changed from orange to blue after picking an over colour: the over colour returns to the
  suggestion for blue.
- Utveckling made blue at work: after a handover it is blue at home too.

