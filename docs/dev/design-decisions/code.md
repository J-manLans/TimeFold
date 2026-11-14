# Code

How the code is written and tested. Each decision follows the template in `README.md`, and is cited by its title.

## Tests come first, from the owner's rules (2026-11-14)

**Built by:** Clocking, from its first code.

**Decision:** before a piece of code is written, the owner says what must hold and what must never happen. Owner and
agent talk it through as a conversation: the agent names what it thinks is missing, and together they settle what
fits. The agreed cases are written as tests and seen to fail before the code is written. Cases agreed before their
part is built wait in the **Cases** line of the decision they mainly check. Tests are named for the rule they check,
and a test cites its decision by title only when its name cannot carry the reason. What cannot be tested
automatically, such as how something looks, is checked by hand under the phase's **Done when**.
**Why:** the rules come from the owner's working day, and a red test proves the rule is understood before the code
exists. Keeping cases under their decision means they change with it, and nothing agreed in talk is lost before its
phase.
**Rejected:** tests written after the code: they tend to check what the code does, not what the owner meant. A
separate file of cases grouped by module: the modules do not exist yet, and the cases would drift from their rules.
A sign-off checklist for cases: the workflow must not become a bottleneck. Every test citing its decision: a
well-named test already says its rule.
**Revisit if:** writing the cases first slows the work more than it saves.

## Code style (2026-11-14)

**Built by:** Clocking, from its first file.

**Decision:** the code follows the owner's style from an earlier project, translated to Svelte, TypeScript and Rust.
- **Tools, with their defaults:** Prettier with its Svelte plugin for TypeScript, Svelte and CSS, and rustfmt for
  Rust, formatting automatically; ESLint with the TypeScript and Svelte rules, and clippy for Rust. One `tidy` script
  formats and lints everything, and checks the same as CI. Lines are at most 120 characters, as in the docs.
- **Types:** TypeScript in strict mode. Exported functions state their parameter and return types; a variable states
  its type when it is not obvious. A method that replaces an inherited one is marked `override`, and
  `noImplicitOverride` makes a missing mark an error. A class that matches an interface says `implements` and does not
  inherit to get it.
- **Naming:** in TypeScript, camelCase for variables and functions, PascalCase for types and Svelte components,
  UPPER_SNAKE_CASE for module-level constants; in Rust, its own conventions. What is private is not exported from its
  module (a class's own fields are `#private`), with no underscore prefix; Rust keeps things private by default.
  Names and comments are in English; only what the user sees is Swedish.
- **Doc comments:** every exported function, type and component has one: what it is for, its inputs, what it returns,
  and side effects if any, as TSDoc (`/** … @param … @returns … */`) without repeating the types, or Rust's `///`.
  Private helpers need no doc comment; a clarifying comment is enough.
- **Comments:** only where they clarify, not to repeat the code. A comment starts with a capital letter; a comment of
  one sentence has no period, a comment of more than one ends each sentence with one, the last included. Work still
  to do is a searchable `TODO`.
- **Sections:** a file with several parts is grouped under short, fixed banners, in each language's comment style, a
  line of `=` above and below a centred name; a subsection is one line, `=== Name ===`. Logic modules use **Init**,
  **API** and **Helpers**, the helpers sub-headed by the section they serve (`=== Init ===`, `=== API ===`,
  `=== Global ===`). A Svelte component's script uses **Props**, **State**, **Logic** and **Helpers**, and its style
  **Tokens**, **Layout** and **States**. A small file with one job needs no banner.
- **CSS:** every raw value (colour, size, radius, time, strength) lives in one tokens file, `src/styles/tokens.css`,
  carried over from the main screen sketch's knobs, with each theme colour written once as `light-dark(light, dark)`;
  components use only `var(--…)`. A small `src/styles/base.css` holds the reset, fonts and body. Inside a component,
  class names are short and plain (`.label`, `.dot`), since Svelte scopes each component's styles; states are shown
  with `class:` directives, `:disabled` and `aria-` attributes, not in class names. Every transition takes
  `--speed-ui`, and `prefers-reduced-motion` is always respected.
- **Tests,** with Vitest for TypeScript and Rust's own tests for Rust ("Tests come first, from the owner's rules"):
  - as few tests as cover the behaviour: a test earns its place only if breaking the code it guards turns it red and
    no other test already does; no tests of the language or a library; asserts on one behaviour share one test;
  - unit tests in `tests/unit/` mirror `src/`, one test file per source file, and may use real collaborators;
    integration tests in `tests/integration/` check hand-offs between parts; Rust's tests sit beside their code;
  - one `describe` block per behaviour, its name the one-line description;
  - a test plays what the code would really see, values and sequences the app can produce;
  - a value put in and expected back unchanged is a shared constant; a value the code works out is written in the
    test as the worked example it is, not computed with the code's own formula;
  - setup several tests share is written once, as a helper in `tests/helpers/` or a Vitest fixture; setup for one or
    two tests of one file stays in that file;
  - a test file's top level is in sections, each only when used, in this order: **Constants**, **Stand-ins**,
    **Helpers**, **Fixtures**, **Tests**.
**Why:** the owner has worked this way and wants the same feel here. Tools with defaults keep style out of reviews and
match every example a learner finds. Strict types and few, sharp tests suit tests-first: each test guards a rule from a
decision, and its worked examples are the decisions' cases.
**Rejected:** an underscore for private things: in TypeScript, not exporting says it, and the norm is without one.
Full-width banners: the owner's short, fixed ones read better. Python's tools and forms (Ruff, Pyright, `conftest.py`,
reST docstrings with types): translated, not carried. Regression tests replaying recorded baselines: they suit a
simulation; here the decisions' cases cover it. BEM class names: Svelte's scoped styles already prevent the collisions
BEM exists to avoid, and the long names would only add noise.
**Revisit if:** a tool's default fights the owner's banners or comment style, or a third language joins.

