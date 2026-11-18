# Main screen: a narrow window

How the screen stacks in a narrow window, and the window's minimum size. Each decision follows the template in
`../../README.md`, and is cited by its title.

## A narrow window stacks the dashboard over the controls (2026-11-18)

**Decision:** the main screen is responsive to the window's size. Wide enough, the two sides sit side by side; below a
set width, they stack, the dashboard on top and the controls side under it, each the window's full width. The window has
a minimum size, small enough to stand as a strip beside another window and large enough that the stacked screen fits
without scrolling, so the start button is always in view. The sides stack below 640 px; the window is at least 400 px
wide and 650 px tall, its height at launch. In a narrow window the menu button sits in the controls side's lower left
corner instead of the top left, so the row it kept at the top goes; the panel grows from that corner, and its heading
takes the top row. The width lives in the component's media query, since CSS cannot read a custom property there.

**Why:** the owner keeps the app on a second screen, often squeezed beside another window: tall and thin, the screen's
full height but little of its width. There it is mostly looked at, and the figures are what is looked at, so they come
first; the app is also something the owner likes to see, as one would a diploma on the wall. The minimum size keeps "One
click to start or stop" in a cramped window. The menu button moves down in a narrow window because the stacked controls
side is short: at the top, its row took room from the button block, the status line and today's pie.

**Rejected:** The menu covering the whole window in a narrow window: it would hide the dashboard the colour picker, the
onboarding and the recovery screen are judged against. The menu button centred on the prune line: their heights differ,
so it never sat true; side by side in the corner is an edge case the owner accepts. the controls on top when stacked, as
the prototype first had it; tried against the dashboard on top: it puts what is pressed over what is read. A minimum
width that never lets the sides stack: the strip beside another window is how the app is used. Shrinking side by side
instead of stacking: in a tall, thin window both sides would be cramped while the height went unused.

**Revisit if:** the stacked screen does not fit the minimum height, or the strip is used wider than the stacking width.

- A narrow window: the menu button in the lower left corner, no row above the button block; opened, the panel grows from
  that corner and "Meny" sits at the top left.
