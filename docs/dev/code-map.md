# Code map

Where the code lives and the path a run takes through it. It names files and what to look for in them, not what the
code says; why the code is as it is lives in `design-decisions/`. Print the tree with
`git ls-files -- src src-tauri tests ':!src-tauri/icons'`.

## A run, from the command to the screen

1. `npm run tauri dev` starts Tauri's CLI, which first runs `beforeDevCommand` from `src-tauri/tauri.conf.json`:
   `npm run dev`, Vite serving the interface on port 5173 (`vite.config.ts`).
2. The CLI compiles the Rust half and starts it: `src-tauri/src/main.rs` calls `run()` in `src-tauri/src/lib.rs`,
   which builds the Tauri app and opens the window from `tauri.conf.json`, pointed at `devUrl`.
3. The window loads `index.html`, which holds only `#app` and loads `src/main.ts`.
4. `src/main.ts` imports the styles and mounts `src/App.svelte` into `#app`.

`npm run tauri build` does the same with Vite's built files in `dist/` instead of the server, and packages the app.

## The interface: `src/`

- `main.ts`: the entry; the global styles are imported here and nowhere else.
- `App.svelte`: the root component, the main screen.
- `lib/components/`: the Svelte components; `lib/modules/`: the logic in TypeScript, such as the record and the
  counting. Both start with their first file.
- `styles/design-tokens.css`: every value of the look ("Design tokens hold every value of the look");
  `styles/base.css`: the reset, the fonts and the body.

## The Rust half: `src-tauri/`

- `src/main.rs`: starts the app; `src/lib.rs`: builds it in `run()`, where commands and plugins are registered.
- `tauri.conf.json`: the app's name, its identifier (which names the folder the record lives in), the window, and the
  commands that build the interface.
- `capabilities/`: what the interface may ask of the Rust half.
- `Cargo.toml`: the Rust half's packages; `icons/`: the app's icons.

## Configuration at the root

- `package.json`: the interface's packages and scripts (`dev`, `build`, `check`, `tauri`).
- `vite.config.ts`: the dev server Tauri loads; `svelte.config.js`; `tsconfig.json` with `tsconfig.app.json` (the
  interface) and `tsconfig.node.json` (the config files).
