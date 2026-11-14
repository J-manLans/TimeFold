# Code style starter

How code is written and tested, as a starting point for any project. It pairs with `AGENT_DOCS_STARTER.md`, which
says how the docs and the work are organised; this file says how the code itself is written. Neither is copied as
is: a new project starts from both and builds on them.

## How to use it

1. **Before the first file of code,** owner and agent go through this file together and settle the project's code
   style as a decision of its own ("Code style", in the project's decisions). The rules below are the defaults; each
   one is kept, changed or dropped for the project, and a dropped one goes under **Rejected** with its reason.
2. **Pick the languages' rows** from the tables. A language not listed gets a row the same way: what its tools are,
   how it spells each rule.
3. **An owner's style from an earlier project** is a good start. Sort it into three piles: what carries over as is,
   what needs translating to the new languages, and what does not fit, with reasons the owner can overrule.
4. **Keep it a decision, not a manual.** The decision states the rules; how to run the tools goes in the project's
   commands table in `AGENTS.md`. A rule added later is added because its absence cost something.

## Formatting and linting

- **Tools decide formatting, with their defaults.** Style never comes up in review, and the code looks like every
  example a learner finds. Change a default only for a reason the project can name, such as matching the docs' line
  length.
- **One script runs everything** (format, lint, type check), and checks exactly what CI checks, so a clean run at
  home means a clean run in CI. It is named in the commands table.
- **Linting catches mistakes, not taste.** Start from the linter's recommended rules and the language's own checker.

| Language | Format | Lint and check | The one script |
|---|---|---|---|
| Python | Ruff (format) | Ruff (lint), Pyright | `scripts/tidy.sh` |
| TypeScript, Svelte, CSS | Prettier, with its Svelte plugin | ESLint (TypeScript, Svelte rules), `tsc` / `svelte-check` | `npm run tidy` |
| Rust | rustfmt | clippy | `cargo fmt && cargo clippy` in the tidy script |

## Types

- **Typed as strictly as the language allows.** Public functions state their parameter and return types; a variable
  states its type when it is not obvious, or in a complex data structure.
- **An override is marked,** and the checker is told to flag a missing mark, so renaming or removing a parent's
  method is caught.
- **A type that matches an interface implements it; it does not inherit to get it.** A subclass that forgets a method
  would inherit an empty one, and nothing would flag it.

| Language | Strictness | Override | Interface |
|---|---|---|---|
| Python | type hints everywhere; Pyright | `@override`, `reportImplicitOverride` | `Protocol`, matched, not inherited |
| TypeScript | `strict: true` | `override`, `noImplicitOverride` | `interface`, `implements` |
| Rust | the compiler | (traits, no inheritance) | `trait`, `impl Trait for` |

## Naming

- **Each language's own conventions,** not one carried across languages.
- **Private is the language's way of saying private,** not a habit from another language.
- **Names and comments in one language** (usually English); only what the user sees follows the user's language.

| Language | Variables, functions | Types, classes, components | Constants | Private |
|---|---|---|---|---|
| Python | `snake_case` | `PascalCase` | `UPPER_SNAKE_CASE` | `_leading_underscore` |
| TypeScript | `camelCase` | `PascalCase` (Svelte components too) | `UPPER_SNAKE_CASE` at module level | not exported; `#field` in a class |
| Rust | `snake_case` | `PascalCase` | `UPPER_SNAKE_CASE` | private by default; `pub` to share |

## Doc comments

- **Everything public has one:** what it is for, its inputs, what it returns, and side effects, if any. It says what
  the thing is and does, and reads correctly when the work is finished: no "for now", no "until phase 3".
- **Private helpers need none;** a clarifying comment where it helps is enough.
- **Types are not repeated** where the language already states them.

| Language | Form |
|---|---|
| Python | docstring, `:param x:` and `:returns:` (`:type x:` only where hints are missing) |
| TypeScript | TSDoc: `/** … @param x … @returns … */`, without types |
| Rust | `///`, with `# Errors` and `# Panics` sections where they apply |

## Comments

- **Only where they clarify,** not to repeat what the code says.
- **A comment starts with a capital letter.** A comment of one sentence has no period; a comment of more than one ends
  each sentence with one, the last included: `Reset the step clock`, but `Spawn every orb. The field is full from the
  start.`
- **Work still to do is a searchable `TODO`** (or `NOTE`), never a doc comment that tells its own story.

## Sections

A file with several parts is grouped under short, fixed banners, in the language's comment style: a line of `=`
above and below a centred name. A subsection is one line. One level of banner only; a small file with one job needs
none.

```python
# ================= #
#        API        #
# ================= #

# === Getters === #
```

```ts
// ================= //
//        API        //
// ================= //

// === Getters === //
```

Default section names, adjusted per project:

- **A module or class with logic:** **Init**, **API**, **Helpers**. The helpers are sub-headed by the section they
  serve: `=== Init ===`, `=== API ===`, `=== Global ===`.
- **A UI component:** in its script **Props**, **State**, **Logic**, **Helpers**; in its styles **Tokens**,
  **Layout**, **States**.
- **A test file:** see "Tests" below.

## CSS

- **Raw values live in one tokens file.** Colours, sizes, radii, times and strengths are variables, defined once, and
  each theme colour once with its variants side by side (`light-dark(light, dark)`). Components use only the
  variables; a raw value inside a component is a bug waiting for the next theme or tweak.
- **A small base file** holds the reset, fonts and body, and nothing component-specific.
- **States are states,** not names: a disabled button is `:disabled` or `aria-disabled`, a running one a state class
  or attribute set by the code, and a disabled thing reacts to nothing (no hover, no press).
- **One speed for interface transitions,** a variable, and `prefers-reduced-motion` always respected. Longer
  animations that tell something over time keep their own length.
- **Class names depend on scoping.** Where the framework scopes styles per component (Svelte, Vue, CSS modules),
  short plain names are safe and enough. Where all styles share one global sheet, a naming scheme such as BEM
  (`.block__element--modifier`) prevents collisions.
- **The same section banners** as the code: Tokens, Layout, States.

## Tests

How tests are written; when they are written (first, from the owner's rules, or after) is a decision of the project.

- **As few tests as cover the behaviour.** A test earns its place only if breaking the code it guards turns it red,
  and no other test already does. No tests of the language or of a library; no repeating a test over values that take
  the same path. Asserts that check one behaviour share one test.
- **Unit tests mirror the source,** one test file per source file, in a `tests/unit/` tree shaped like `src/`. A unit
  test asks whether one file keeps its promise, and may use real collaborators to do it.
- **Integration tests** check that parts across modules hand off to each other.
- **One group per behaviour** (a test class, a `describe` block), its name or docstring a one-line description.
- **A test plays what the code would really see:** values and sequences the program can produce, even when a shortcut
  would be a few lines shorter. A step the program never takes raises more questions than it saves.
- **A value passed through unchanged is a shared constant,** so the test and the code cannot drift. **A value the
  code works out is written out** in the test as the worked example it is, not computed with the code's own formula.
- **Setup that several tests share is written once,** as a shared helper or fixture, as the rest of the code is.
  Setup used by one or two tests of one file stays in that file.
- **A test file's top level is in sections,** each only when used, in this order: **Constants**, **Stand-ins**
  (classes that play a collaborator, and what they record), **Helpers**, **Fixtures**, **Tests**, with no banners
  between the tests.
- **Tests never depend on files a person edits** to use or tune the program; they build their own setup.

| Language | Runner | Group | Shared setup | Where |
|---|---|---|---|---|
| Python | pytest (+ Hypothesis for properties) | `class Test<Thing>:` with a docstring | fixtures in a `conftest.py` | `tests/unit/` mirroring the package |
| TypeScript, Svelte | Vitest | `describe("…")` | `tests/helpers/`, Vitest fixtures | `tests/unit/` mirroring `src/` |
| Rust | `cargo test` | a `mod` per behaviour | helper functions in a `tests` module | beside the code (`#[cfg(test)]`); `tests/` for integration |

## What is project-specific

Left out on purpose, to be added by a project when it needs them: regression tests replaying recorded baselines (a
simulation's tool), diagrams generated from the code, generated documentation, performance budgets, and rules for a
particular framework's patterns. Each comes with the reason the project needs it.
