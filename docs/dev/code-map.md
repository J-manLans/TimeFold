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
- `lib/components/`: the Svelte components, starting with their first file.
- `lib/modules/`: the logic in TypeScript. `record.ts`: the record's shape as types, and `readRecord`, the check on
  opening that turns a file's text into a record or names what is wrong with it. `counting.ts`: the balance, each day's
  result, expected hours and the app's month, worked out in seconds from the record. `storage.ts`: `loadRecord` and
  `saveRecord`, the only place that invokes the record's commands; it adds the local date that names a day's copy.
- `styles/design-tokens.css`: every value of the look ("Design tokens hold every value of the look"); `styles/base.css`:
  the reset, the fonts and the body.

## The tests: `tests/`

- `unit/`, mirroring `src/` with one test file per source file; `integration/`, the hand-offs between parts; `helpers/`,
  setup several test files share ("Code style"), such as `records.ts` with a sound record. Each starts with its first
  file. Vitest finds every `*.test.ts`; Rust's tests sit beside their code.

## The Rust half: `src-tauri/`

- `src/main.rs`: starts the app; `src/lib.rs`: builds it in `run()`, where commands and plugins are registered, and
  holds the commands the interface invokes: `load_record` and `save_record` (the daily copy, then the safe save).
- `src/disk.rs`: the file work, with no Tauri in it: reading a file, the safe save, the daily copies; its tests at the
  bottom. The record and its `copies/` folder live in the app's data folder.
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
