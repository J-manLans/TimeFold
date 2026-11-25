# Code map

Where the code lives and the path a run takes through it. It names files and what to look for in them, not what the code
says; why the code is as it is lives in `design-decisions/`. Print the tree with
`git ls-files -- src src-tauri tests ':!src-tauri/icons'`.

## A run, from the command to the screen

1. `npm start` runs `tauri dev` with `src-tauri/tauri.dev.conf.json` laid over `tauri.conf.json`: its own identifier
   gives dev a data folder of its own, so it never opens the installed app's record. Tauri's CLI first runs
   `beforeDevCommand` from `src-tauri/tauri.conf.json`: `npm run dev`, Vite serving the interface on port 5173
   (`vite.config.ts`).
2. The CLI compiles the Rust half and starts it: `src-tauri/src/main.rs` calls `run()` in `src-tauri/src/lib.rs`, which
   builds the Tauri app and opens the window from `tauri.conf.json`, pointed at `devUrl`.
3. The window loads `index.html`, which holds only `#app` and loads `src/main.ts`.
4. `src/main.ts` imports the styles and mounts `src/App.svelte` into `#app`.

`npm run tauri build` does the same with Vite's built files in `dist/` instead of the server, and packages the app.

## The interface: `src/`

- `main.ts`: the entry; the global styles are imported here and nowhere else.
- `App.svelte`: the root component, the main screen, with the edit popup; it sets `--profile-state`, the colour of where
  the profile on screen stands, which the profile letter and every focus ring wear.
- `lib/app.svelte.ts`: the app's state while it runs, `app`: the record in memory, where the app is (loading, welcome,
  problem, ready), the locked panel and how far its ending has got, and at recovery what is offered and the copy's day,
  the profile on screen, the last click and the machine's theme and motion; the edit popup's entry or gap (`editing`);
  its actions `load`, `press`, `setBreak`, `undo`, `stopLate`, `keepLate`, `openEdit`, `openGap`, `closeEdit`,
  `saveEdit`, `deleteEdited`, `switchTheme` and `switchMotion` change them through the rules and save them. The theme is
  shown by setting `color-scheme` on the page, Stilla by setting `data-still` on it; scripts that time something read
  `app.still`. Components read it and call its actions.
- `lib/components/`: the Svelte components, a folder per part of the screen. `controls/`: `Controls.svelte`, the
  controls side, placing `ButtonBlock` (start/stop, export and import, the profile button), `StatusLine` with
  `TodayPie.svelte` right of its text, `PauseField` ("Lägg till paus" and its length field), `UndoButton` with its
  `TipLabel`, `PruneLine`, the menu and `LatePopup.svelte`, the popup for a running entry from an earlier day, and
  making the pointer light, which it also sweeps once at the onboarding's end: it sets the light's place; a flat button
  catches it through `.plastic` in `base.css`, and each disc paints `--pointer-light` itself. `menu/`: `Menu.svelte`,
  the menu button and the frosted panel it grows into, with `ThemeButton`, `MotionButton.svelte` (the motion switch,
  also in the onboarding's note) and the tab row, whose Tid tab holds `FlexCalendar.svelte`, the flex-day calendar with
  its padlock and the list of marked days beside it, and locked open around `Onboarding.svelte`, the first start's
  onboarding with its ending's timeline, or `Recovery.svelte`, the screen for a record that cannot be read; both use
  `ChoiceButton.svelte`, in `shared/`. `dashboard/`: `Dashboard.svelte`, the dashboard, laying out its figures, drawing
  the divider, and handing them the panel's colour and the wheel's base; `FlexBar.svelte`, the balance and its bar;
  `CeilingWheel.svelte`, the ceiling wheel with the pay estimate; `RecentEntries.svelte`, the five newest entries;
  `AllEntries.svelte`, "Visa alla" and its popup with its month lines and the gaps between its rows; `EntryRow.svelte`,
  the row both lists share, which opens its entry in the edit popup. `edit/`: `EditPopup.svelte`, the edit popup over
  "Senaste" or stacked on "Visa alla", its peek, the day and the profile picker, the result in words, the break's field,
  and "Ta bort", "Avbryt" and "Spara"; `EditLine.svelte`, the entry line drawn from the line's model, the pointer turned
  into its moves, the pill and the view easing to its fit; `ReasonPicker.svelte`, the closed reason field, its list and
  "Annan orsak". `shared/`: what more than one part uses, such as `Disc.svelte`, the dented disc of the profile, undo
  and theme buttons, and `ChoiceButton.svelte`, the locked panel's and the popups' buttons with their tip.
- `lib/modules/`: the logic in TypeScript, a folder per part of the screen that uses it, as the components are, and
  `shared/` for what more than one part uses; a module that gains a user in another part moves to `shared/`.
  `controls/`: `clock.ts`, what a click on start/stop does to the record (`press`), the undo of the last click, an added
  break among them (`undo`), and what the undo's label says (`clickLabel`); `breaks.ts`, the running entry's whole break
  so far (`breakSoFar`) and a new total set on it, refused when nothing runs or it is longer than the entry
  (`setBreak`); the entry running from an earlier day when the app opens (`runningSinceEarlierDay`), stopping it
  whichever profile is on screen (`stopRunning`) and the popup's words (`lateWords`); `today.ts`, today's pie, the
  slices filled and lapped (`todaySlices`), a running entry counted to now. `dashboard/`: `figures.ts`, the flex bar's
  scale, reach and side, and the balance as text; `entries.ts`, the entry lists' entries, a running one first and the
  stopped ones newest first (`listedEntries`), what a row says, its break tag, its "e" and its reason among it, the
  month lines of "Visa alla" (`withMonthLines`) and the gap above each of its rows (`gapsAbove`). `edit/`: `line.ts`,
  the entry line's rules as plain state and moves: opening an entry or a gap, placing a new entry, dragging and stepping
  its handles against the walls (other entries, now, the break), shortening and gaps, a gap filled by another profile,
  joining and walking, the break and its sharing, the colours of the line and the view's fit; `edit.ts`, an entry of the
  record or a gap opened on the line (`lineForEntry`, `lineForGap`), whether the confirm can save (`canSave`), the save
  (`saveLine`), which writes the line's result into the record with its marks and reasons and makes one entry of a
  profile's entries left touching, the delete (`deleteEntry`), the result in words (`resultWords`) and the reasons in
  their order (`reasonList`); `scale.ts`, the labels under the line (`ticks`). `menu/`: `flexDays.ts`, a click on a day
  of the calendar marking or unmarking it, weekends, days janitor work started on (`workedDays`) and, while locked, days
  gone by refused (`toggleFlexDay`), the month it draws (`calendarMonth`, `monthAfter`) and the list of marked days
  ahead (`daysAhead`); `settings.ts`, the machine's own settings (the theme and the motion), their defaults, the check
  on reading each apart, the theme and the motion in force, and each button's switch. `shared/`: `record.ts`, the
  record's shape as types, `readRecord`, the check on opening that turns a file's text into a record or names what is
  wrong with it, upgrading an older version first, `recoveryFor`, what a problem leads to, and `toTimestamp` and
  `nextId`, a moment and a new entry's id as the record writes them; `colours.ts`, the colour rule from the prototype, a
  profile's base, dimmed and neon by role, the faded colour, and black or white ink on a colour (`inkOn`);
  `counting.ts`, the balance (`balance` up to a day, `balanceOnScreen` with the flex days ahead), each day's result,
  each entry's seconds by day less its added breaks, expected hours charged on days work started or flex days, the app's
  month, the ceiling with its carry and pieces, and the pay estimate, worked out in seconds from the record, and a
  moment's time of day as shown (`timeOfDay`); `dates.ts`, days and months in Swedish words ("måndag 16 november", "mån
  16", "november 2026"); `storage.ts`, `loadRecord`, `saveRecord`, `copyRecord`, `newestCopy`, `loadSettings` and
  `saveSettings`, the only place that invokes the Rust half; `copyRecord` adds the local date that names a day's copy;
  `timeInput.ts`, typed durations for the onboarding's balance and a break's length, each keystroke checked against the
  field's shape (`fitsShape`), which `durationShape.ts`, the Svelte attachment every length field wears, applies as it
  is typed, read into minutes, and written back in words ("1h 20min") or into a field ("1:20"); `focusRing.ts`, the last
  input (a key or a pointer) and the focus ring as a popup opens and closes: opening, each popup keeps how
  (`popupOpened`) and quiets the focus it moves in unless that was the keyboard (`ringOnOpen`); closing, it quiets the
  element the focus lands on (`popupClosed`) unless it was opened and closed with the keyboard (`ringAfterClose`).
- `styles/design-tokens.css`: every value of the look ("Design tokens hold every value of the look"); `styles/base.css`:
  the reset, the fonts, the body, every focus ring and the quiet one (`data-quiet-focus`) after a popup closes,
  `.plastic`, the flat button every button block, pause and choice button wears, with its pointer light, hover and
  press, the registered `--glow-strength` the pointer light fades by, and Stilla: under `data-still` every transition,
  animation and delay is zero.

## The tests: `tests/`

- `unit/`, mirroring `src/` with one test file per source file; `integration/`, the hand-offs between parts; `helpers/`,
  setup several test files share ("Code style"), such as `records.ts` with a sound record and `at` and `entry` for
  building moments and entries, and `lines.ts` with random days and moves for the edit's property tests, whose runs
  `FC_RUNS` raises (`FC_RUNS=50000 npm test`). Each starts with its first file. Vitest finds every `*.test.ts`; Rust's
  tests sit beside their code.

## The Rust half: `src-tauri/`

- `src/main.rs`: starts the app; `src/lib.rs`: builds it in `run()`, where commands and plugins are registered, and
  holds the commands the interface invokes: `load_record` and `save_record` (the safe save), `copy_record` (the day's
  copy, at start) and `newest_copy`, and `load_settings` and `save_settings` (the safe save).
- `src/disk.rs`: the file work, with no Tauri in it: reading a file, the safe save, the daily copies; its tests at the
  bottom. The record, its `copies/` folder and `settings.json` live in the app's data folder.
- `tauri.conf.json`: the app's name, its identifier (which names the folder the record lives in), the window, and the
  commands that build the interface.
- `tauri.dev.conf.json`: what `npm start` lays over `tauri.conf.json` for dev: only the identifier, so dev keeps its
  record in a folder of its own.
- `capabilities/`: what the interface may ask of the Rust half and its plugins, such as closing the window and opening
  the releases page (the opener plugin).
- `Cargo.toml`: the Rust half's packages; `icons/`: the app's and the installers' icons, made from `icons/icon.svg`, the
  only one drawn by hand, with `npx tauri icon src-tauri/icons/icon.svg`.

## Configuration at the root

- `package.json`: the interface's packages and scripts (`dev`, `start`, `build`, `check`, `test`, `tidy`, `tauri`).
- `.prettierrc` and `.prettierignore`: Prettier's few settings and what it skips; `eslint.config.js`: ESLint's rule
  sets, with Prettier's switch-off and the globals for the webview and for Node.
- `vite.config.ts`: the dev server Tauri loads, and the aliases `$lib` for `src/lib` and `$tests` for `tests` (also in
  `tsconfig.app.json`); `svelte.config.js`; `tsconfig.json` with `tsconfig.app.json` (the interface) and
  `tsconfig.node.json` (the config files).
- `.github/workflows/release.yml`: the release build. A pushed version tag checks that the tag and the three versions
  agree, then builds the Windows and Linux installers with Tauri's action onto a draft release
  (`docs/dev/procedures/release.md`).
