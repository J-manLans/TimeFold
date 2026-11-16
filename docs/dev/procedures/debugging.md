# Debugging

The order of a bug hunt and the tools for it. Read in debug mode. What debug mode is, and who commits the fix, is in
`AGENTS.md`; tools not installed yet are in `codebase-ideas.md`.

## The hunt

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

**Seen as:** in `npm run tauri dev`, the window shows every element stacked down the middle with no grid, flex or gaps,
and the terminal says `[vite-plugin-svelte:load] failed to load virtual css module …?svelte&type=style&lang.css` for the
components.

**Cause:** in dev, each component's styles are their own request. When the window asks for a component's styles before
the dev server has compiled that component, the Svelte plugin has nothing to give, and Vite sends the raw `.svelte` file
as CSS instead, and keeps that answer while the server runs. The window cannot read it, so no component styles apply.
Why the window asked in that order was not proven. The built app cannot hit it: `vite build` puts every component's
compiled styles into one CSS file.

**Fix, in order:**

1. Stop `npm run tauri dev` and start it again.
2. If the layout is still gone, delete `~/.local/share/TimeFold/WebKitCache` (the window's cached pages only; the record
   and settings are beside it, not in it) and start again.
3. If it keeps coming back, compile every component when the dev server starts, by adding
   `warmup: { clientFiles: ['./src/**/*.svelte'] }` under `server` in `vite.config.ts`. It is dev-only and costs well
   under a second; it is code, so it waits for the owner's go.
