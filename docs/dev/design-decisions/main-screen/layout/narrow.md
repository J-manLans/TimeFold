# Main screen: a narrow window

How the screen stacks in a narrow window, the window's minimum size, and how the whole app is made larger or smaller.
Each decision follows the template in `../../README.md`, and is cited by its title.

## A narrow window stacks the dashboard over the controls (2026-11-18)

**Decision:** the main screen is responsive to the window's size. Wide enough, the two sides sit side by side; below a
set width, they stack, the dashboard on top and the controls side under it, each the window's full width. The window has
a minimum size, small enough to stand as a strip beside another window. The sides stack once the controls side, beside
the dashboard, would be narrower than the button block with its room on both sides (`--controls-block-room`, 24 px), so
the switch follows the block's own size; judged by the window, not by the layout it gives, it never flips back and
forth. The main screen measures the block and marks the page stacked, and each part's stacked look keys on that mark.
Stacked, each side takes its own height and the two scroll together as one page, only once they no longer fit the
window; neither scrolls inside itself. The dashboard fills the width and is never narrower than side by side. The window
is at least the dashboard's width, 440 px, and 660 px tall, its height at launch, set in `tauri.conf.json`, so the
window is made at that size before the page loads; the token for the dashboard's width points to it. In a narrow window
the menu button sits in the controls side's lower left corner instead of the top left; the bottom row keeps its room,
and the top row the same, so the button block, the status line and the pause row sit evenly between. The panel grows
from that corner, and its heading takes the top row.

**Why:** the owner keeps the app on a second screen, often squeezed beside another window: tall and thin, the screen's
full height but little of its width. There it is mostly looked at, and the figures are what is looked at, so they come
first; the app is also something the owner likes to see, as one would a diploma on the wall. The minimum size keeps the
dashboard as wide as side by side; stacked, a short window may scroll the start button out of view, which the owner
accepts. The menu button moves down in a narrow window because there is more room for it at the bottom, beside the prune
line, than at the top.

**Rejected:** a fixed width to stack at, 640 px: a number kept in step with the button block by hand, in every part that
stacks. The width worked out from the tokens in CSS: a media query cannot read a custom property, and `@custom-media` is
in no engine the app runs in. A window narrower than the dashboard, at 400 px: stacked, the dashboard was then thinner
than side by side and its rows re-flowed. The minimum set by the app from the tokens as it starts, so the dashboard's
width lived in one place: it came only after the page had loaded, and needed a permission of its own. The stacked screen
exactly the window's height, the dashboard scrolling inside itself: the page scrolling as one reads as one screen, and
the inner scroll drew a stray line. The menu covering the whole window in a narrow window: it would hide the dashboard
the colour picker, the onboarding and the recovery screen are judged against. The menu button centred on the prune line:
their heights differ, so it never sat true; side by side in the corner is an edge case the owner accepts. the controls
on top when stacked, as the prototype first had it; tried against the dashboard on top: it puts what is pressed over
what is read. A minimum width that never lets the sides stack: the strip beside another window is how the app is used.
Shrinking side by side instead of stacking: in a tall, thin window both sides would be cramped while the height went
unused.

**Revisit if:** the strip is used wider than the stacking width.

- A narrow window: the menu button in the lower left corner, a row above the button block as tall as its row below;
  opened, the panel grows from that corner and "Meny" sits at the top left.

## The app is zoomed as a whole (2026-11-28)

**Built by:** nothing on the roadmap yet; it waits on a phase to take it.

**Decision:** the whole app is made larger or smaller only by the webview's zoom (Tauri's `setZoom`), never by a root
font size. Zoom changes how many screen pixels a CSS pixel takes and lays the page out again, so text and shapes are
drawn sharp at the new size, px included, and the layout sees a wider or narrower window, which stacks the sides as a
resize would. As it starts, the app picks a zoom that fits the screen; the owner changes it with Ctrl+/−, in steps
inside a range, and the app keeps it between runs. Tauri's own zoom keys (`zoomHotkeysEnabled`) stay off, since they
have no limits; the app catches the keys itself. The window's minimum size follows the zoom: the dashboard's width and
the launch height times the factor. The steps and the range are picked when it is built, whole steps such as 90% or
110%, where 1 px lines land cleanly.

**Why:** someone on a small screen or with poor sight can make the app fit or grow, while the layout never meets
extremes. Zoom scales everything at once, so the look stays in px, as it is tuned by eye, and no value has to remember
to follow a root.

**Rejected:** a root font size with every value in rem: on the web rem follows the reader's browser text size, which a
window app has none of, and a value left in px would not follow. Free zoom with Tauri's own keys: the layout would have
to hold at any size.

**Revisit if:** `setZoom` does not run on WebKitGTK, or 1 px lines look soft at the chosen steps.
