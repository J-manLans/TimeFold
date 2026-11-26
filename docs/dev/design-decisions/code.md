# Code

How the code is written and tested. Each decision follows the template in `README.md`, and is cited by its title.

## Tests come first, from the owner's rules (2026-11-14)

**Decision:** before a piece of code is written, the owner says what must hold and what must never happen. Owner and
agent talk it through as a conversation: the agent names what it thinks is missing, and together they settle what fits.
The agreed cases are written as tests and seen to fail before the code is written. Cases agreed before their part is
built wait in the **Cases** line of the decision they mainly check. Tests are named for the rule they check, and a test
cites its decision by title only when its name cannot carry the reason. Where rules meet in orders no case plans for, as
on the entry line, a property test states the rules that must always hold and fast-check tries random sequences of moves
against them, each failure it shrinks kept as a unit test; `FC_RUNS` raises its runs for a deeper hunt. What cannot be
tested automatically, such as how something looks, is checked by hand under the phase's **Done when**.

**Why:** the rules come from the owner's working day, and a red test proves the rule is understood before the code
exists. Keeping cases under their decision means they change with it, and nothing agreed in talk is lost before its
phase.

**Rejected:** tests written after the code: they tend to check what the code does, not what the owner meant. A separate
file of cases grouped by module: the modules do not exist yet, and the cases would drift from their rules. A sign-off
checklist for cases: the workflow must not become a bottleneck. Every test citing its decision: a well-named test
already says its rule.

**Revisit if:** writing the cases first slows the work more than it saves.

## Code style (2026-11-15)

**Decision:** the code follows the owner's style from an earlier project, translated to Svelte, TypeScript and Rust.

- **Structure:** a better structure that comes easily is built from the start, in the app's first version of the part;
  one that needs hoops jumped through waits until a problem asks for it. When two designs serve the owner equally, the
  one with fewer rules and less code wins. The sketches are throwaway and are not restructured. The prototype is not
  throwaway: it is the north star for the look beside the vision, structured for tuning (its knobs, in
  `procedures/prototype.md`) rather than as app code.
- **Tools, close to their defaults:** Prettier with its Svelte plugin for TypeScript, Svelte, CSS and the docs'
  markdown, and rustfmt for Rust, formatting automatically; ESLint with the TypeScript and Svelte rules, and clippy for
  Rust. Prettier is pinned to an exact version, since a new one may format the same code differently. `npm run tidy`
  formats, applies the linters' safe fixes, and fails on anything left: a lint, a clippy warning or a type error. Lines
  are at most 120 characters, code and docs alike, and Prettier wraps the docs' prose to fit. The few settings that
  differ from the defaults live in the tools' own config files, not here.
- **Types:** TypeScript in strict mode. Exported functions state their parameter and return types; a variable states its
  type when it is not obvious. A method that replaces an inherited one is marked `override`, and `noImplicitOverride`
  makes a missing mark an error. A class that matches an interface says `implements` and does not inherit to get it.
- **Naming:** in TypeScript, camelCase for variables and functions, PascalCase for types and Svelte components,
  UPPER_SNAKE_CASE for module-level constants; in Rust, its own conventions. What is private is not exported from its
  module (a class's own fields are `#private`), with no underscore prefix; Rust keeps things private by default. Names
  and comments are in English; only what the user sees is Swedish.
- **Imports:** anything under `src/lib/` is imported through `$lib` (`$lib/modules/shared/record`), from source and
  tests alike, and the tests' shared helpers through `$tests` (`$tests/helpers/records`), never by counting `../`; a
  file beside the importer may use `./`.
- **Doc comments:** every exported function, type and component has one: what it is for, when it is used with an example
  (or its one use), its inputs, what it returns, and side effects if any, as TSDoc (`/** … @param … @returns … */`)
  without repeating the types, or Rust's `///`. Private helpers and test helpers get a short one too: what they do and
  who uses them.
- **Comments:** only where they clarify, not to repeat the code. A comment starts with a capital letter; a comment of
  one sentence has no period, a comment of more than one ends each sentence with one, the last included. Work still to
  do is a searchable `TODO`.
- **Sections:** a file with several parts is grouped under short, fixed banners, in each language's comment style, a
  line of `=` above and below a centred name, the closing line starting where the comment opens (in CSS: `/* =====…`,
  the name centred under it, then `=====… */` flush with the `/*`); a subsection is one line, `=== Name ===`, in every
  section alike. Logic modules use **Init**, **API** and **Helpers**, the helpers sub-headed by the section they serve
  (`=== Init ===`, `=== API ===`, `=== Global ===`). A Rust module's tests, at the bottom of its file, follow under a
  **Tests** banner. A Svelte component's script uses **Props**, **State**, **Logic** and **Helpers**, and its style
  **Layout** and **States**. A small file with one job needs no banner.
- **CSS:** every raw value is a design token ("Design tokens hold every value of the look"); components use only
  `var(--…)`. Inside a component, class names are short and plain (`.label`, `.dot`), since Svelte scopes each
  component's styles; states are shown with `class:` directives, `:disabled` and `aria-` attributes, not in class names.
  **Colours by role:** one function takes a profile and the situation (the theme, the profile on screen, whether its
  figure is past its line, the peek) and returns its colour roles: `base`, `dimmed`, `over`, `faded` and `number`; the
  figures read them as CSS variables (`var(--wheel-number)`) and never pick a colour themselves. The balance profile's
  greys are theme tokens.
- **Tests,** with Vitest for TypeScript and Rust's own tests for Rust ("Tests come first, from the owner's rules"):
  - as few tests as cover the behaviour: a test earns its place only if breaking the code it guards turns it red and no
    other test already does; no tests of the language or a library; asserts on one behaviour share one test;
  - unit tests in `tests/unit/` mirror `src/`, one test file per source file, and may use real collaborators;
    integration tests in `tests/integration/` check hand-offs between parts; Rust's tests sit beside their code;
  - one `describe` block per behaviour, its name the one-line description;
  - a test plays what the code would really see, values and sequences the app can produce;
  - a value put in and expected back unchanged is a shared constant; a value the code works out is written in the test
    as the worked example it is, not computed with the code's own formula;
  - setup several tests share is written once, as a helper in `tests/helpers/` or a Vitest fixture; setup for one or two
    tests of one file stays in that file;
  - a test file's top level is in sections, each only when used, in this order: **Constants**, **Stand-ins**,
    **Helpers**, **Fixtures**, **Tests**.

**Why:** the owner has worked this way and wants the same feel here. Easy structure pays back at once, and building it
later means doing the part twice. Every rule is code, a test and a place to change it later. With colour roles, a change
to a colour rule is one edit, the greys can be tuned with the other tokens, and a test checks a role without drawing
anything. Tools close to their defaults keep style out of reviews and match every example a learner finds. Strict types
and few, sharp tests suit tests-first: each test guards a rule from a decision, and its worked examples are the
decisions' cases.

**Rejected:** each figure working out its own colours, as the prototype does: a rule changed twice in one session meant
finding every spot. An underscore for private things: in TypeScript, not exporting says it, and the norm is without one.
Full-width banners: the owner's short, fixed ones read better. Python's tools and forms (Ruff, Pyright, `conftest.py`,
reST docstrings with types): translated, not carried. Regression tests replaying recorded baselines: they suit a
simulation; here the decisions' cases cover it. BEM class names: Svelte's scoped styles already prevent the collisions
BEM exists to avoid, and the long names would only add noise. A second, check-only `tidy:check`: every change `tidy`
makes is safe and shows in `git diff`, and a second command needs a rule for which to use when; a check-only mode is for
a CI server, which the project does not have.

**Revisit if:** a tool's default fights the owner's banners or comment style, or a third language joins.

## Design tokens hold every value of the look (2026-11-15)

**Decision:** a design token is a named value standing for a design decision, written as a CSS custom property. Every
raw value of the look (colour, font, size, spacing, radius, time, shadow) is a token in one file,
`src/styles/design-tokens.css`, which `src/main.ts` imports once, beside `src/styles/base.css` (the reset, the fonts and
the body). Components never import it and use only `var(--…)`. Styles (selectors, layout, states) stay in each
component; only the values are central.

- **Names** say the intent, not the value: `--color-background`, `--wheel-diameter`, `--speed-ui`, never `--dark-grey`
  or `--size-200`. A value only one component uses is still a token, under that component. A decision shared by several
  parts is one token; two values that happen to be equal but mean different things are two. Where parts play the same
  role, such as small text or a heading in capitals, each part's token points at the role's shared one
  (`--entry-tag-size: var(--text-size-label)`), so one knob moves them all and a part can still be tuned apart.
- **Order:** the file runs Global, Controls (the controls side), Dashboard, then Overlays and popups, the popups grouped
  by the side that owns them, or Global. Inside each component, and in Global, values go in this order: colours,
  typography, dimensions, spacing, radii, motion, shadows and effects. The sections use the banners of "Code style".
- **Theming:** `:root` sets `color-scheme: light dark`. A fresh install leaves it so, following the system; once the
  theme button is clicked, "Ljust" and "Mörkt" set it to `light` or `dark` ("A light or dark theme, following the
  system"). A value that differs between the themes is written once as `light-dark(light, dark)`; one that does not is a
  single value. While the look is tuned, a pair may hold the same value on both sides; once the design settles, such a
  pair is merged into one value. The profiles' colours are not tokens: the colour roles in "Code style" work them out.
  The balance profile's greys are tokens.
- **Motion:** times are written in seconds. `--speed-ui: 0.2s` is every small transition's ("The look: a fresh display
  face, mono text and soft buttons"); a longer animation that tells something has its own token, such as the peek's 0.3s
  ("The ceiling wheel"). The app's own Animerat or Stilla decides, following the system's reduced-motion setting until
  the switch is first clicked ("Motion can be switched off in the app").

**Why:** one file is the tuning panel for the whole look, as the prototype's knobs were, and the look is tuned far more
often than a component is read; a token's name and go-to-definition make the second file cheap. Custom properties
inherit through Svelte's scoped styles, so one import on `:root` reaches every component with no wiring. Names by intent
survive a change of value. `light-dark()` keeps a theme's pair on one line with no second set of tokens, and the theme
button is one property on one element. Tokens describe the design as it is, not hypothetical needs.

**Rejected:** a component's own values in its style block: tuning the look would mean opening every component, and each
value would need a call on shared or local. Every colour paired for both themes from the start: a pair says the themes
differ, and an identical pair says it falsely. Times in milliseconds: the owner reads seconds.

**Revisit if:** the file grows past what is comfortable to tune in one place.
