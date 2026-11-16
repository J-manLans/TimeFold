# Code map

Where the code lives and the path a run takes through it. It names files and what to look for in them, not what the code
says; why the code is as it is lives in `design-decisions/`. Print the tree with
`git ls-files -- src src-tauri tests ':!src-tauri/icons'`.

## A run, from the command to the screen

1. `npm run tauri dev` starts Tauri's CLI, which first runs `beforeDevCommand` from `src-tauri/tauri.conf.json`:
   `npm run dev`, Vite serving the interface on port 5173 (`vite.config.ts`).
2. The CLI compiles the Rust half and starts it: `src-tauri/src/main.rs` calls `run()` in `src-tauri/src/lib.rs`, which
   builds the Tauri app and opens the window from `tauri.conf.json`, pointed at `devUrl`.
3. The window loads `index.html`, which holds only `#app` and loads `src/main.ts`.
4. `src/main.ts` imports the styles and mounts `src/App.svelte` into `#app`.

`npm run tauri build` does the same with Vite's built files in `dist/` instead of the server, and packages the app.

## The interface: `src/`

- `main.ts`: the entry; the global styles are imported here and nowhere else.
- `App.svelte`: the root component, the main screen.
- `lib/app.svelte.ts`: the app's state while it runs, `app`: the record in memory, where the app is (loading, welcome,
  problem, ready), the profile on screen, the last click and the machine's theme; its actions `load`, `press`, `undo`
  and `cycleTheme` change them through the rules and save them. The theme is shown by setting `color-scheme` on the
  page. Components read it and call its actions.
- `lib/components/`: the Svelte components, a folder per part of the screen. `controls/`: `Controls.svelte`, the
  controls side, placing `ButtonBlock` (start/stop, export and import, the profile button), `StatusLine`, `UndoButton`
  with its `TipLabel`, `PruneLine` and the menu, and making the pointer light: it sets the light's place, and every
  button and disc that catches it paints `--pointer-light`. `menu/`: `Menu.svelte`, the menu button and the frosted
  panel it grows into, with `ThemeButton`. `shared/`: what more than one part uses, such as `Disc.svelte`, the dented
  disc of the profile, undo and theme buttons.
- `lib/modules/`: the logic in TypeScript. `record.ts`: the record's shape as types, and `readRecord`, the check on
  opening that turns a file's text into a record or names what is wrong with it. `clock.ts`: what a click on start/stop
  does to the record (`press`), the undo of the last click (`undo`) and what the undo's label says (`clickLabel`).
  `colours.ts`: the colour rule from the prototype, a profile's base, dimmed and over colours by role. `counting.ts`:
  the balance, each day's result, expected hours and the app's month, worked out in seconds from the record, and a
  moment's time of day as shown (`timeOfDay`). `settings.ts`: the machine's own settings (the theme), their defaults and
  the check on reading. `storage.ts`: `loadRecord`, `saveRecord`, `loadSettings` and `saveSettings`, the only place that
  invokes the Rust half; it adds the local date that names a day's copy.
- `styles/design-tokens.css`: every value of the look ("Design tokens hold every value of the look"); `styles/base.css`:
  the reset, the fonts, the body, and the registered `--glow-strength` the pointer light fades by.

## The tests: `tests/`

- `unit/`, mirroring `src/` with one test file per source file; `integration/`, the hand-offs between parts; `helpers/`,
  setup several test files share ("Code style"), such as `records.ts` with a sound record and `at` and `entry` for
  building moments and entries. Each starts with its first file. Vitest finds every `*.test.ts`; Rust's tests sit beside
  their code.

## The Rust half: `src-tauri/`

- `src/main.rs`: starts the app; `src/lib.rs`: builds it in `run()`, where commands and plugins are registered, and
  holds the commands the interface invokes: `load_record` and `save_record` (the daily copy, then the safe save), and
  `load_settings` and `save_settings` (the safe save, no copies).
- `src/disk.rs`: the file work, with no Tauri in it: reading a file, the safe save, the daily copies; its tests at the
  bottom. The record, its `copies/` folder and `settings.json` live in the app's data folder.
- `tauri.conf.json`: the app's name, its identifier (which names the folder the record lives in), the window, and the
  commands that build the interface.
- `capabilities/`: what the interface may ask of the Rust half.
- `Cargo.toml`: the Rust half's packages; `icons/`: the app's icons.

## Configuration at the root

- `package.json`: the interface's packages and scripts (`dev`, `build`, `check`, `test`, `tidy`, `tauri`).
- `.prettierrc` and `.prettierignore`: Prettier's few settings and what it skips; `eslint.config.js`: ESLint's rule
  sets, with Prettier's switch-off and the globals for the webview and for Node.
- `vite.config.ts`: the dev server Tauri loads, and the aliases `$lib` for `src/lib` and `$tests` for `tests` (also in
  `tsconfig.app.json`); `svelte.config.js`; `tsconfig.json` with `tsconfig.app.json` (the interface) and
  `tsconfig.node.json` (the config files).
