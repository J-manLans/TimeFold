# Main screen: motion

Animated or still: motion switched off in the app. Each decision follows the template in `../../README.md`, and is cited
by its title.

## Motion can be switched off in the app (2026-11-19)

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
