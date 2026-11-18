mod disk;

use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// The record's file name, in the app's data folder
const RECORD_FILE: &str = "record.json";
/// The folder beside the record that holds its daily copies
const COPIES_FOLDER: &str = "copies";
/// How many daily copies are kept: a month back, so a fault noticed at the month's report can still be undone
const KEEP_COPIES: usize = 31;
/// The machine's own settings, such as the theme, beside the record; never exported
const SETTINGS_FILE: &str = "settings.json";

// ======================================
//                 Init
// ======================================

/// Builds the app: the opener plugin (the releases page in the browser), the log plugin in debug builds, the commands
/// the interface may invoke, then the window from tauri.conf.json. Used once, by `main`, when the app starts.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_record,
            save_record,
            copy_record,
            newest_copy,
            load_settings,
            save_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}

// ======================================
//                 API
// ======================================

/// Reads the record as text for the TypeScript half, or `None` when there is no record yet. Invoked by `loadRecord`
/// once, when the app starts.
#[tauri::command]
fn load_record(app: AppHandle) -> Result<Option<String>, String> {
    let folder = data_folder(&app)?;
    disk::read_text(&folder.join(RECORD_FILE)).map_err(|e| e.to_string())
}

/// Saves the record's text safely. Invoked by `saveRecord` after every change, such as a stop.
#[tauri::command]
fn save_record(app: AppHandle, json: String) -> Result<(), String> {
    let folder = data_folder(&app)?;
    disk::save_safely(&folder.join(RECORD_FILE), &json).map_err(|e| e.to_string())
}

/// Keeps the day's copy of the record, unless `today` (`YYYY-MM-DD`, the machine's local date, given by the
/// TypeScript half) has one or it is the same as the newest. Invoked by `copyRecord` when the app starts, once the
/// record has passed the check.
#[tauri::command]
fn copy_record(app: AppHandle, today: String) -> Result<(), String> {
    let folder = data_folder(&app)?;
    disk::copy_once_a_day(
        &folder.join(RECORD_FILE),
        &folder.join(COPIES_FOLDER),
        &today,
        KEEP_COPIES,
    )
    .map_err(|e| e.to_string())
}

/// The newest daily copy as its day (`YYYY-MM-DD`, from its name) and its text, or `None` when there is none.
/// Invoked by `newestCopy` when the record cannot be read.
#[tauri::command]
fn newest_copy(app: AppHandle) -> Result<Option<(String, String)>, String> {
    let folder = data_folder(&app)?.join(COPIES_FOLDER);
    let Some(newest) = disk::list_copies(&folder)
        .map_err(|e| e.to_string())?
        .into_iter()
        .next()
    else {
        return Ok(None);
    };
    // record-2026-11-16.json → 2026-11-16
    let stem = newest.file_stem().unwrap_or_default().to_string_lossy();
    let day = stem
        .get(stem.len().saturating_sub(10)..)
        .unwrap_or_default()
        .to_string();
    let text = disk::read_text(&newest).map_err(|e| e.to_string())?;
    Ok(text.map(|text| (day, text)))
}

/// Reads this machine's settings as text, or `None` when there are none yet. Invoked by `loadSettings` once, when the
/// app starts.
#[tauri::command]
fn load_settings(app: AppHandle) -> Result<Option<String>, String> {
    let folder = data_folder(&app)?;
    disk::read_text(&folder.join(SETTINGS_FILE)).map_err(|e| e.to_string())
}

/// Saves this machine's settings safely; no daily copies, since they only hold the theme. Invoked by `saveSettings`
/// after each change, such as a click on the theme button.
#[tauri::command]
fn save_settings(app: AppHandle, json: String) -> Result<(), String> {
    let folder = data_folder(&app)?;
    disk::save_safely(&folder.join(SETTINGS_FILE), &json).map_err(|e| e.to_string())
}

// ======================================
//               Helpers
// ======================================

/// The app's data folder (named by the identifier in tauri.conf.json), made if it does not exist yet. Used by every
/// command: on Linux, `~/.local/share/io.github.j-manlans.timefold`.
fn data_folder(app: &AppHandle) -> Result<PathBuf, String> {
    let folder = app.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&folder).map_err(|e| e.to_string())?;
    Ok(folder)
}
