# Main screen: look

How the app looks: type, colour, surfaces and buttons, and the light or dark theme. Each decision follows the template
in `../README.md`, and is cited by its title.

## The look: a fresh display face, mono text and soft buttons (2026-11-15)

**Built by:** Profiles, for its popups.

**Decision:** the app's look, from the owner's art direction references (kept locally, not in git) and settled on the
prototype:

- **Type:** Bricolage Grotesque, bold and at its narrowest width (75%), for the big things: "Starta jobb", the profile
  letter, the balance and the hours inside the ceiling wheel. JetBrains Mono for all other text on both sides, in normal
  case. The quiet lines, what runs, the offer to prune and the short messages after an action (such as "Rensar efter en
  kopia"), share one small size (10.5 px) in the muted colour. Both fonts are bundled with the app from their
  `@fontsource-variable` npm packages, so it needs no internet to show them.
- **Colour:** flat fields with one hot accent, which the neon already is. Each theme colour is set once, with its light
  and dark value side by side. The dashboard is near-black in the dark theme and slate blue in the light theme, each a
  tinted family of panel, rows, lines and text ("The main screen has a controls side and a dashboard"). Contrast is
  balanced across the themes, a little stronger in the light one, where faint lines read weaker at the same ratio, and
  stronger still on its blue-tinted frost: in the menu, text stands at about 13.8:1 and quiet text 8.8:1 (light), lines
  at about 1.95:1 (light) and 1.5:1 (dark) against the frost, and the borders of fields and small buttons at about 2.7:1
  and 2.0:1, as measured on the prototype.
- **Buttons:** flat, in the theme's button colour (in the light theme the dashboard's blue, a step deeper, `#4f688e`,
  with near-white text at 5.2:1, hovered `#40577b` at 6.8:1; in the dark theme a dark grey with light text; a little
  bolder text on the smaller buttons), with no border and no shading: corners of 5 px and a soft, quiet shadow offset
  down and to the right (2 by 3 px, 12 px blur, 14% black). Hovered, a little lighter; pressed, a faint shade from the
  top. Small controls and fields have 6 px corners, panels and popups 12 px. Around them, the light theme's controls
  side is in cool greys (the page `#f2f4f7`, quiet text `#556070` at 5.8:1), so it sits with the blue; fields are white
  and the colour picker `#e6ecf4`. The profile popup takes the button colour, with the chosen or hovered profile a
  lighter step (`#5f789e` in the light theme), as in the dark theme.
- **Profile circle:** a raised disc in the button's own colour, lit by a soft round glow toward its top, its letter in
  the colour of where the profile stands ("Each profile carries its colours"; if a colour reads poorly on the button,
  the owner changes it with the picker), trimmed to its capital so it sits dead centre, sitting in a soft dent 6 px wide
  around it, after a CodePen pen (bthehuman, MIT); the dent is see-through in both themes, so it is always a soft shade
  of the button's own colour, whatever that colour is. In the light theme its highlights and shadows are tinted blue,
  not white or black, so they sit with the blue button. The glow has the same shape in both themes; only its colours
  change. The theme button's disc is in the buttons' own colour too, with a light icon; it catches the pointer light
  like the other discs.
- **Motion:** every transition in the interface takes the same 0.2 seconds, one setting for all: hover and press, the
  start button's ring and label, the status line, buttons waking and dimming, the menu, tabs and rows, the warning
  label, the profile letter's colour, and a change of theme. A text that changes swaps at once. Animations that tell
  something over longer, such as the numbers counting at stop or the undo's fade, keep their own length.
- **Light:** a soft, matte light follows the pointer over the controls side: one light shared by all buttons, reaching
  about 70 px from the pointer (far enough to flow across buttons, near enough that a button visibly lights up as the
  pointer enters it), so it lies only on button surfaces and flows across them, faint and tinted (stronger on the light
  theme's blue than on the dark grey), fading in and out with the pointer. The discs catch it too, at full strength,
  except the profile disc, which catches 0.7 of it and so stays a little apart; on the undo disc it lies over the
  coloured afterglow, under the arrow. While the menu is open, the light leaves the buttons under its frost, which it
  would seem to shine through, and lies only on what is in the menu. The small text buttons in the menu ("Ändra", "OK",
  "Ny profil", "Använd default", "Arkivera") stay plain, without the light: it marks the main controls and the discs,
  the theme disc among them. A disabled button reacts to nothing: no light, no hover, no press; and every unavailable
  button fades by the same amount (to 40%), so "Lägg till paus" and the undo match side by side.
- **Ornament:** micro labels, registration marks and barcode strips only where they carry meaning; none for decoration
  alone.
- In code, these values are named variables in one place, so the look is tuned there.

**Why:** the owner likes the references' printed, technical feel, with something fresher and more modern for the big
type. A mono for the rest ties the controls to the dashboard. Flat buttons with one soft shadow keep the surfaces calm;
the indented disc gives the profile button a physical touch.

**Rejected:** a flat saturated colour field for the dashboard: the dark panel stays. Rounder condensed faces (Saira
Extra Condensed, Big Shoulders Display, Teko): too round. Tektur, condensed: square and technical, but not fresh enough
for the big type; tried for all text, it was too much. Matte plastic buttons with grain, edge highlights and a deeper
shadow: they looked like 1990s 3D. Shaded or glossy buttons. A white profile circle: the button's own colour reads
better. Decorative micro labels: they say nothing. Light grey buttons in the light theme: they barely stood off the page
(1.08:1, later 1.29:1); the blue ties the controls side to the dashboard. An outline around the profile letter: it
looked silly. No light on the discs: it set them apart, but less naturally; the profile disc's weaker share keeps a
little of both. A fine grain over the panels: tried, it added nothing. A near-white theme disc in the light theme: the
blue one sits better with the other buttons. A top-down gradient on the disc in the light theme, beside the glow in the
dark: the glow looks better, and one shape keeps the theme a matter of colours. Loading the fonts from Google Fonts: the
app works offline. A changing text fading out, swapping and fading back in: the owner prefers the snappier change at
once.

**Revisit if:** the mono is hard to read at small sizes, or the pointer light repaints too slowly there.

## A light or dark theme, following the system (2026-11-18)

**Decision:** the app has a theme: light or dark. A fresh install follows the computer's light or dark mode, and goes on
following it until the theme button is first clicked; from then on the app keeps the theme chosen. The button is round,
beside the menu's heading, drawn like the profile button's disc in its dent: a sun for Ljust, a moon for Mörkt, always
showing the theme in force, with a label naming it. Each click switches to the other. The dashboard follows it too, as a
near-black panel in the dark theme and a slate-blue one in the light theme ("The main screen has a controls side and a
dashboard"). The theme belongs to each machine and is not carried by the handover.

**Why:** the owner's two computers may be set differently, and following the system at first needs no choice at all.
Once the owner has picked a theme, a third state to come back to the system is one more click in every round for
something rarely wanted; two states make the button a plain switch.

**Rejected:** three buttons in a tab of their own: one round button in the heading is enough. One fixed theme: the
controls side should sit well beside the rest of the owner's desktop. The theme in the handover: each machine is set up
for its own screen and room. "System" as a third state on the button, with a half-filled circle: a three-way cycle for a
choice made once.

**Revisit if:** the dashboard should follow the theme after all.

**Cases:**

- A fresh install on a dark system: the controls side is dark, and the button shows the moon.
- The system turns light before the button is ever clicked: the app turns light, and the button shows the sun.
- One click on a dark system: Ljust; the controls side is light and the dashboard slate blue, and the system turning
  dark later changes nothing.
- The theme changed while the tip or the undo's afterglow shows: both take the new theme's colours, and nothing
  restarts.

## Motion can be switched off in the app (2026-11-19)

**Built by:** Corrections, as a patch.

**Decision:** the app has a switch for its motion, **Animerat** or **Stilla**, that takes effect at once, with no
restart. A fresh install follows the system's reduced-motion setting, and goes on following it until the switch is first
clicked; from then on the app keeps the state chosen, overriding the system for this app only and leaving the system's
setting as it is. The state belongs to each machine and is not carried by the handover.

The switch is a round button in the menu's heading, after the theme button and drawn the same way, with a label naming
the state in force. Its icon is three staggered speed lines for Animerat, which fold into one flat line for Stilla. Each
label (the theme's too) is as wide as its longer word, so the button after it never moves when the word swaps. Going to
Animerat, the lines spread out over the interface's short transition time; going to Stilla, they fold at once, since
Stilla takes the transitions away in the same moment. Its disc always catches the pointer light, in Stilla too, as a
hint of what Animerat brings.

In Stilla nothing moves: no transition, animation or delay, the pointer light on every other button, the flex bar's and
the ceiling wheel's counts land at once, and the onboarding's and the recovery screen's timed steps all land at once, in
order. The "KOPIA" label holds still in the colour it breathes into. In Animerat the app animates even where the system
asks for reduced motion.

When the app is in Stilla on a first start, the onboarding's first step shows a quiet note under "Starta nytt" and
"Importera", as wide as the two together: the switch on the left, centred on the words' height, and "Appen är i stilla
läge och fungerar precis som den ska. Vill du ha lite mer flair, slå på knappen." After the first click the sentence
gives way to the switch's label, "Animerat" or "Stilla" as in the menu, in the sentence's place and keeping its room so
nothing above moves; the rest of the onboarding follows the state chosen. On a system without reduced motion there is no
note, and the switch is only in the menu. The recovery screen's "Starta nytt", which skips the first step, shows no
note: the path is rare, and the switch is in the menu.

**Why:** the school's computers have reduced motion on by default, so a teacher would never see the app's motion without
knowing where the system setting is. A switch in the app is one click and touches nothing else on the machine. Following
the system first gives someone who set reduced motion on purpose what they asked for; the note puts the switch where it
is seen, since the menu's heading is hidden during the onboarding. Each machine keeps its own state, as with the theme.

**Rejected:** a link from the onboarding that opens the system's animation settings, with a tip per system: it changes
every app on the machine, sends the user out of TimeFold, and needs a different route on each Linux desktop; Linux users
set their own system anyway. The switch as a value in a tab: the heading is always in view when the menu opens. On from
the start: it overrides a choice someone may have made on purpose. A note on a screen of its own: a line under the first
step is enough. Pointing at the menu in words: the switch is hidden there during the onboarding.

**Revisit if:** some motion has to stay with motion off, such as a signal that cannot be shown still.

**Cases:**

- System asks for reduced motion, the switch turned on: a stop makes the flex bar and the ceiling wheel count, and the
  menu grows open.
- System does not ask for reduced motion, the switch turned off: a stop makes the numbers jump to their new values, and
  the menu opens at once.
- The switch flipped with the app open: the next animation follows it, with no restart.
- A first start with the app in Stilla, from a fresh settings file or one that chose Stilla, shows the note; one that
  chose Animerat on a system with reduced motion shows none.
- A first start on a system with reduced motion: the onboarding shows the note; the switch clicked there, the sentence
  turns to "Animerat", a second click to "Stilla", the buttons above stay put, and the ending follows the state chosen.
  On a system without it, no note.
- The switch's label swapping between Animerat and Stilla: the theme button and the switch stay where they are.
- A handover imported: the motion state stays as the machine had it.
