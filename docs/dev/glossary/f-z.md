# Glossary: F–Z

Terms F–Z, in alphabetical order. The index and the rules for terms are in `README.md`.

**Faded.** On the ceiling wheel, the tone of hours worked by another profile than the one on screen: the base or over
colour in the same hue, weaker and a little toward the panel's background. Not the dimmed colour, which is the unused
part ("The ceiling wheel", in `design-decisions/`). See **Lit**.

**Flex bar.** The main screen's figure for the balance: a horizontal bar either side of a zero line, with the balance as
a number ("The flex bar", in `design-decisions/`).

**Flex day.** A whole day off paid for with the balance: it takes the expected hours off the balance. Not annual leave,
which is left empty.

**Full time.** The hours of a full working day (8), a setting; janitor's expected hours and the ceiling divide it.

**Gap.** The time between a stop and the next start, or cut from an entry on the entry line. Not work; it counts on no
day.

**Handover.** Moving the record from one of the owner's machines to the other: export one file on the first, import it
on the second, replacing everything there.

**Hue (a profile's).** Where the hue strip of the profile's colour picker sits; the base colour is a nuance of it and
the over colour its opposite ("Each profile carries its colours", in `design-decisions/`).

**Lit.** On the ceiling wheel, hours worked by the profile on screen, in its base or over colour at full strength. See
**Faded**.

**Month.** The app's counting month: the calendar month, the 1st to the last day; the ceiling, reports, the pay estimate
and pruning count by it.

**Neon.** A hue at its most vivid: the colour on the picker's hue strip.

**Opening figures.** Figures brought over from before the app, kept in the record apart from the entries and dated the
day they start from: the janitor balance, typed in when the app starts fresh, and the ceiling hours already used, whose
asking is still open; the balance and the ceiling count from them.

**Over colour.** A profile's colour for "more than expected": hours over the ceiling, a plus balance, and the numbers
that show them; the opposite of the profile's hue at its most vivid, never picked.

**Pay category.** A label on a profile for how its hours are paid, so reports can group them. A label only.

**Pay estimate.** A rough figure of the month's pay: salaries plus hours times rates, for the owner only; never in the
report.

**Peek.** Resting the pointer on the ceiling wheel's band, which winds the over lap back so the first lap shows whole.

**Pointer light.** The soft light that follows the pointer over the controls side, lying only on the buttons and discs
that can be used ("The look: a fresh display face, mono text and soft buttons").

**Profile.** A label on an entry for the kind of work it is, such as janitor work or the development group. Profiles are
isolated; only one with expected hours has a balance.

**Prototype.** The app's screens as tuned before they are built, `docs/vision/prototype.html`: the north star for the
look beside the vision, kept until the finished app has been validated. Not a **Sketch**.

**Prune.** Removing the record's oldest whole months, past three years, on the owner's yes; the balance and ceiling
hours at the cut become opening figures.

**Release.** A version of the app built by GitHub from a version tag, such as `v0.1.0`, with installers for Windows and
Linux on the repo's releases page ("The app reaches each machine as an installer from a GitHub release", in
`design-decisions/`). Not the record's version, which numbers the file's shape.

**Report.** A period's record, exported from the app for the owner to send to their boss.

**Settings file.** Each machine's own `settings.json` beside the record, holding what belongs to that computer, such as
the theme; never in the record or the handover.

**Sketch.** A quick try of one look before it is decided, in `docs/dev/sketches/`; what it settles goes to its decision,
and it goes once that is built. Not the **Prototype**.

**Tip.** The small label that follows the pointer over a button, to its right, edged in a profile's colour: what the
undo would undo, or what the start button would stop. With keyboard focus it shows under the button.
