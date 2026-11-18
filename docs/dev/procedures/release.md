# Releasing a version

How a version of TimeFold reaches the owner's machines: raising the version, the tag, the build, publishing and
installing. Read before a release. Why it works this way is in "The app reaches each machine as an installer from a
GitHub release", in `design-decisions/`; the build itself is `.github/workflows/release.yml`.

The owner makes each release by hand; the agent guides, one step at a time.

## Which version

major.minor.patch: one minor version per phase (Phase 1 ships as `0.1.0`), a patch for a fix between phases, and `1.0.0`
the day the app is finished and the Excel backup goes.

## Steps

1. **The phase is merged.** Its pull request is merged into `main` with rebase, and `main` is pulled:
   `git switch main && git pull --rebase`.
2. **Raise the version in all three places,** to the same number:
   - `package.json` and its lock: `npm version 0.1.0 --no-git-tag-version`
   - `src-tauri/tauri.conf.json`: `"version"`
   - `src-tauri/Cargo.toml`: `version` under `[package]`; `Cargo.lock` follows on the next build
3. **Check and commit:** `npm run tidy` and `npm test` pass, then a commit named after the version, such as "Version
   0.1.0", pushed to `main`.
4. **Tag and push the tag:** `git tag v0.1.0`, then `git push origin v0.1.0`. This starts the build.
5. **Watch the build** on the repo's Actions page. It first checks that the tag and the three versions agree, then
   builds on Windows and on Linux, each in about ten to fifteen minutes.
6. **Publish:** on the releases page, the draft "TimeFold v0.1.0" holds the installers: for Windows an `.msi` and an
   `-setup.exe`, for Linux a `.deb`, an `.rpm` and an `.AppImage`. Read it over, then "Publish release".
7. **Install** on each machine from the releases page: on Windows the `-setup.exe`, on Linux the `.deb`. A newer
   installer updates the program in place and leaves the record, its copies and the settings untouched.

## When the build stops

- **"The tag is v0.1.0, but package.json says 0.0.0":** a version was missed. Delete the tag on both sides
  (`git push --delete origin v0.1.0`, then `git tag -d v0.1.0`), fix the version, commit, push, and tag again.
- **A build fails on one machine:** its log is on the Actions page, under the failed job. The other still finishes; the
  draft is published only once both installers are there.
