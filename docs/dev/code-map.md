# Code map

Where the code lives and the path a run takes through it: which folder to open, not what the code says. Most files open
with a comment saying what they do; why the code is as it is lives in `design-decisions/`. Print the tree with
`git ls-files -- src src-tauri tests ':!src-tauri/icons'`.

## A run, from the command to the screen

1. `npm start` runs `tauri dev` with `src-tauri/tauri.dev.conf.json` laid over `tauri.conf.json`: its own identifier
   gives dev a data folder of its own, so it never opens the installed app's record. Tauri first runs `npm run dev`,
   Vite serving the interface on port 5173.
2. Tauri compiles and starts the Rust half (`src-tauri/src/main.rs`, then `run()` in `lib.rs`), which opens the window
   on Vite's page.
3. `index.html` loads `src/main.ts`, which imports the styles and mounts `src/App.svelte`.
4. `App.svelte` is the main screen. It reads and changes the app's state only through `app` in `lib/app.svelte.ts`,
   whose actions apply the rules in `lib/modules/` and save through `lib/modules/shared/storage.ts`, the only file that
   calls the Rust half.

`npm run tauri build` does the same with Vite's built files in `dist/`, and packages the app.

## The interface: `src/`

- `main.ts`: the entry; the global styles are imported here and nowhere else.
- `App.svelte`: the root, the main screen; it decides whether the sides stack.
- `lib/app.svelte.ts`: the app's state while it runs (`app`) and every action that changes it.
- `lib/components/`: the Svelte components, a folder per part of the screen: `controls/` (the controls side and its
  popups), `menu/` (the menu, its tabs, the onboarding and the recovery screen), `dashboard/` (the figures and the entry
  lists), `edit/` (the edit popup, its line and its reasons) and `shared/` (what more than one part wears, such as
  `Disc`, `ChoiceButton` and `Dropdown`).
- `lib/modules/`: the logic in TypeScript, in the same folders as the components that use it; a module that gains a user
  in another part moves to `shared/`, where the record's shape and check (`record.ts`), the counting (`counting.ts`),
  the colours (`colours.ts`) and the storage live.
- `styles/design-tokens.css`: the look's scales, its colours, and the values several parts share or the code reads ("The
  look is a few scales, picked in each part"); `styles/base.css`: the reset, the fonts, the body, the surfaces' colours
  under each `data-surface`, the shared looks (`.tag`, `.button-small`, `.field`, `.dropdown`, `.caps`, `.plastic`),
  every focus ring, and Stilla (`data-still`), which zeroes every transition.

## The tests: `tests/`

`unit/` mirrors `src/` with one test file per source file; `integration/` holds the hand-offs between parts; `helpers/`
holds what several test files share, such as a sound record and `RUNS`, how many cases every property test tries
(`FC_RUNS=50000 npm test` raises it). Rust's tests sit beside their code.

## The Rust half: `src-tauri/`

- `src/lib.rs`: builds the app and holds the commands the interface invokes; `src/disk.rs`: the file work (reading, the
  safe save, the daily copies), with no Tauri in it. The record, its `copies/` folder and `settings.json` live in the
  app's data folder, named by the identifier.
- `tauri.conf.json`: the app's name, identifier and window; `tauri.dev.conf.json`: dev's own identifier;
  `capabilities/`: what the interface may ask of the Rust half and its plugins.
- `icons/`: made from `icons/icon.svg`, the only one drawn by hand, with `npx tauri icon src-tauri/icons/icon.svg`.

## Configuration at the root

`package.json` (the scripts), Prettier's and ESLint's config, `vite.config.ts` (the dev server, and the aliases `$lib`
and `$tests`, also in `tsconfig.app.json`), `svelte.config.js` and the `tsconfig` files. `.github/workflows/release.yml`
builds the installers from a pushed version tag (`docs/dev/procedures/release.md`).
