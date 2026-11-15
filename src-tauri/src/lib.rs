mod disk;

use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// The record's file name, in the app's data folder
const RECORD_FILE: &str = "record.json";
/// The folder beside the record that holds its daily copies
const COPIES_FOLDER: &str = "copies";
/// How many daily copies are kept
const KEEP_COPIES: usize = 14;

// ======================================
//                 Init
// ======================================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
        .invoke_handler(tauri::generate_handler![load_record, save_record])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}

// ======================================
//                 API
// ======================================

/// Reads the record as text for the TypeScript half, or `None` when there is no record yet.
#[tauri::command]
fn load_record(app: AppHandle) -> Result<Option<String>, String> {
    let folder = data_folder(&app)?;
    disk::read_text(&folder.join(RECORD_FILE)).map_err(|e| e.to_string())
}

/// Saves the record's text safely, first copying the record as it stood if this is the first save of `today`
/// (`YYYY-MM-DD`, the machine's local date, given by the TypeScript half).
#[tauri::command]
fn save_record(app: AppHandle, json: String, today: String) -> Result<(), String> {
    let folder = data_folder(&app)?;
    let record = folder.join(RECORD_FILE);
    disk::copy_once_a_day(&record, &folder.join(COPIES_FOLDER), &today, KEEP_COPIES)
        .map_err(|e| e.to_string())?;
    disk::save_safely(&record, &json).map_err(|e| e.to_string())
}

// ======================================
//               Helpers
// ======================================

/// The app's data folder (named by the identifier in tauri.conf.json), made if it does not exist yet.
fn data_folder(app: &AppHandle) -> Result<PathBuf, String> {
    let folder = app.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&folder).map_err(|e| e.to_string())?;
    Ok(folder)
}
