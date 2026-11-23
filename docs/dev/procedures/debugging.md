# Debugging

The order of a bug hunt and the tools for it. Read in debug mode. What debug mode is, and who commits the fix, is in
`AGENTS.md`; tools not installed yet are in `codebase-ideas.md`.

## The hunt

A fault in a rule, which a test can state and which could quietly break again, goes through the hunt as written. A fault
seen on screen (layout, look, motion) shows itself when looked at, so the eye is its check: steps 2 and 3 are the same,
the report names what to look at instead of a failing test, and the fix ends with a list of what to check by eye in the
running app; no test is written for it.

1. **Reproduce it as a test,** and see it fail for the bug's reason before any code changes. When the bug came from a
   real day, start from that day's copy of the record (in `copies/`, beside the record) and replay it in a test. The
   committed test keeps only the entries the bug needs, written with the helpers in `tests/helpers/`, since the record
   stays on the owner's machines. A bug that cannot be reproduced is reported as such, with what was tried; it is not
   fixed by a guess.
2. **Find the cause from evidence:** read the code the test runs through, add temporary logging or set breakpoints, and
   run the test again. Temporary logging is removed before the fix is done.
3. **Report and wait:** one short message with the cause, the evidence for it and the planned fix; the fix waits for the
   owner's go.
4. **Fix only what the evidence points at,** and see the test pass. Then run the checks for the change ("Commands" in
   `AGENTS.md`).
5. **The test stays,** named for the rule the bug broke, so the bug cannot come back unseen.

## When the cause will not show

Reach for these in order, the cheapest first:

1. **`git bisect run`** with the failing test, to find the commit that broke it.
2. **Property-based testing,** when the bug is "sometimes wrong": state the rule and let the tool try hundreds of inputs
   and shrink a failure to the smallest one.
3. **Coverage and mutation testing,** to find the paths no test reaches and the tests that check nothing.

A tool that is not installed is code to add, and is asked for first.

## Known traps

### The dev window loses its layout

**Seen as:** in `npm start`, the window shows every element stacked down the middle with no grid, flex or gaps, and the
terminal says `[vite-plugin-svelte:load] failed to load virtual css module …?svelte&type=style&lang.css` for the
components.

**Cause:** in dev, each component's styles are their own request. When the window asks for a component's styles before
the dev server has compiled that component, the Svelte plugin has nothing to give, and Vite sends the raw `.svelte` file
as CSS instead, and keeps that answer while the server runs. The window cannot read it, so no component styles apply.
Why the window asked in that order was not proven. The built app cannot hit it: `vite build` puts every component's
compiled styles into one CSS file.

**Fix, in order:**

1. Stop `npm start` and start it again.
2. If the layout is still gone, delete `~/.local/share/io.github.j-manlans.timefold/WebKitCache` (the window's cached
   pages only; the record and settings are beside it, not in it) and start again.
3. If it keeps coming back, compile every component when the dev server starts, by adding
   `warmup: { clientFiles: ['./src/**/*.svelte'] }` under `server` in `vite.config.ts`. It is dev-only and costs well
   under a second; it is code, so it waits for the owner's go.

### The built app's theme follows only the desktop

**Seen as:** in a built app, the theme button does nothing, and the theme follows the desktop's light or dark setting;
in dev the button works.

**Cause:** the theme button sets `color-scheme` on the page, which picks each token's side of `light-dark()`. A build
aimed at browsers older than `light-dark()` has Lightning CSS rewrite it into `--lightningcss-light` and
`--lightningcss-dark` variables, switched only by `@media (prefers-color-scheme: dark)`. Dev sends the CSS as written,
so it never shows there.

**Fix:** `build.cssTarget` in `vite.config.ts` names engines new enough for `light-dark()` (WebKitGTK and WebView2 are),
so the build leaves it alone. To check a build, the CSS in `dist/assets/` should hold `light-dark(` and no
`lightningcss-`.

### A fade leaves its last frame on screen on Linux

**Seen as:** in the window on Linux, something that has faded out stays on screen under what comes next, such as the
onboarding's balance step under its name step, or the buttons and the focus ring of "Starta nytt" under the balance,
until the window is resized or Esc is pressed; nothing sticks in Stilla, where nothing animates.

**Cause:** WebKitGTK's DMA-BUF renderer on the owner's laptop (NVIDIA and AMD graphics, Wayland, Pop!_OS 24.04 with
WebKitGTK 2.52) sometimes never shows the last frame of an animation, and does not redraw a focus ring's spot or a
`background-attachment: fixed` surface after a fade. A change with no animation is always drawn in full. Turning the
renderer off (`WEBKIT_DISABLE_DMABUF_RENDERER=1`) cures it but loses `backdrop-filter`, so the menu's frost goes; it is
not used.

**Fix:** in the element that fades: let one step fade out before the next fades in, never both at once; turn the faded
one `visibility: hidden` as its fade ends, which forces the redraw; drop a `fixed` background from what is leaving; and
let anything holding the focus ring leave at once, with no fade. The onboarding's steps (`Onboarding.svelte`) do all
four.

### A glitch seen only in VS Code's built-in browser

**Seen as:** in the prototype, opened in VS Code's built-in browser, something tears or is left behind on hover-off,
such as around the always-shown "+" in "Visa alla".

**Cause:** that browser is a Chromium webview inside an editor panel, with paint quirks of its own; the same page in
Firefox shows nothing wrong. The app runs in neither.

**Fix:** none in the page. Check a prototype glitch in Firefox before hunting it in the code.
