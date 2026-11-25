# Noticed away from the computer

What the owner notices while away from the computer, to be dealt with when back at it: bugs seen in the app and changes
to try in the prototype. Each item says what was seen, the rule it breaks or the change agreed, and what is to be done.
It never names the mode the work is done in: the owner names it when it starts, and debug mode is for a cause still to
find. An item leaves once it is done, its decisions in their area's file in `design-decisions/` and its steps in the
roadmap. Nothing decided lives only here.

## Docking onto a running entry stops the dock back onto the original

**Seen:** on Windows. An entry moved fully off its original to the right docks back onto it with its left handle. After
its end had docked onto the running entry of its profile (its end handle going, as the joined entry ran on), it no
longer did: the start stopped at the original's edge and let go did not take it back.

**Rule it breaks:** an entry moved clear of where it started takes its original time back when let go on its edge ("Two
entries join by docking").

**To do:** the docking patch, under **Next** in the roadmap. Its new rules close the path: no entry docks onto a running
entry of its own profile ("A running entry is edited at its start"). The cause, a `!state.running` condition on the
take-back in `absorb` in `line.ts`, is then dead code and goes, so the rule reads with no exception.

## "Lägg till paus" catches no pointer light

**Seen:** the pointer light passes over the other buttons of the controls side but not "Lägg till paus".

**Rule it breaks:** every button that can be used catches the pointer light ("The look: a fresh display face, mono text
and soft buttons").

**To do:** the cause, found by reading and not yet seen in the running app: in `PauseField.svelte`, `.pause` sets
`background-attachment: fixed` and then the `background:` shorthand, which resets the attachment to `scroll`, so the
light is drawn against the button instead of the window and lands off it; the buttons that catch it set
`background-color` instead. The fix is that one property. The owner's idea alongside: the light's rules (lit, hovered,
pressed), now repeated in `ButtonBlock`, `PauseField` and `ChoiceButton`, given once to every button that catches it, as
a shared class or a rule for all, so a button cannot catch it differently.
