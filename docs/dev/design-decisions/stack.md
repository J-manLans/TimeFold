# Stack

What the app is built with. Each decision follows the template in `README.md`, and is cited by its title.

## Tauri, desktop on Windows and Linux (2026-11-14)

**Built by:** Clocking.

**Decision:** the app is built with Tauri: a web-style interface on the system's webview, with a Rust backend,
packaged as one small program for Windows and Linux.
**Why:** the app runs on the owner's Windows work computer and Linux home computer, and its interface has animation and
custom controls (the balance bar, the ceiling circle, the clock picker) that a web-style interface makes easy. Tauri
gives a small program that starts fast, and the owner wants to try it. On Linux the webview is WebKitGTK, which can lag
on newer CSS and animation, so animations are tested on Linux early.
**Rejected:** Electron: the same Chromium everywhere, but a program of about 100 MB for a small tool. Python with
Tkinter or Qt: custom animated controls are harder. A local web page in the browser: browser storage can be wiped,
which is risky for a record the boss relies on. A phone app: the owner clicks at a computer.
**Revisit if:** WebKitGTK cannot show the interface acceptably on Linux.
