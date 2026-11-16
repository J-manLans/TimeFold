# The prototype

How the prototype is built, and when it is done. Read before building or tuning it, and in any design pass. The values
stay out (they live in the prototype), and so do the decisions behind them (`design-decisions/`). What happens to the
prototype once screens are built, and what vibe mode does with it, is in `AGENTS.md`.

## Why it comes first

A finished prototype lets the owner try the product's look and feel before any real code exists, when a change costs a
minute and not a refactor. Clicking through it brings up the cases the tests need, such as an empty state, a double
click or a day that crosses midnight, so the tests come from the owner's experience and not from guesses. During the
build it answers most questions before they are asked: the agent builds without stopping, and the owner reviews without
surprises. The time spent on it comes back many times over.

## Complete means every screen

- **Every screen and state the finished product will have,** the rare ones too: the first start, errors and recovery,
  editing, empty states, popups and menus, and anything exported, such as a report with its settings. A screen used once
  a month is still a screen.
- **Clickable, not only painted:** each screen behaves as it will, with its transitions and times, so the owner can feel
  it and the cases show themselves.
- **Done when the owner says so,** after tuning every screen. The design phase ends then.
- **A screen found missing later** gets a design pass before it is built: drawn and tuned in the prototype, its
  decisions written, then built.

## Every value is a knob

- Every value worth tuning (colour, size, radius, shadow, time, easing, text) is a named variable at the top of the
  file: CSS custom properties for the look, named constants for times and behaviour.
- The owner tunes alone, so a knob must be easy to find: knobs are grouped by screen, and within a screen by the part
  they touch (the button, the bar, the popup), each group under its own banner, and each knob with a short comment
  naming what it changes. A knob the owner has to ask the agent to find is a knob in the wrong place.
- A value that follows from others is worked out from them, not written twice.
- Controls that exist only for trying the prototype (a toolbar, a theme switch) sit apart and are labelled as such.

## Clicking through gives the cases

Each walk through the prototype is also a hunt for cases: what happens on an empty day, a double click, a long name, a
narrow window. A case the owner agrees goes to the **Cases** line of the decision it checks ("Tests come first, from the
owner's rules", in `design-decisions/`), and becomes a test when its part is built.

## The file is the reference

No screenshots or exported copies: a picture goes stale at the first tweak, and the HTML already holds every value. The
agent reads the values from the file, through the decision that holds their numbers.
