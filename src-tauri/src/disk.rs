//! Reading and writing the app's files. This module knows nothing of what the files hold; the TypeScript half does
//! ("Rust touches the disk; TypeScript knows the record").

use std::fs::{self, File};
use std::io::{self, Write};
use std::path::{Path, PathBuf};

// ======================================
//                 API
// ======================================

/// Saves `contents` to `path` so that a crash at any moment leaves either the old file or the new one whole, never a
/// mix or an empty file. Writes a temporary file beside `path`, forces it onto the disk, then swaps it into place.
/// Used by `save_record` for every save of the record, and later for an exported handover file.
///
/// Returns an error if the folder cannot be written to; the old file is then left as it was.
pub fn save_safely(path: &Path, contents: &str) -> io::Result<()> {
    let temp = write_temp(path, contents)?;
    swap_in(&temp, path)
}

/// Reads the file at `path` as text: the record when the app starts, or a daily copy when one is offered. Returns
/// `None` when there is no file, which for the record means there is no record yet; any other failure is an error.
pub fn read_text(path: &Path) -> io::Result<Option<String>> {
    match fs::read_to_string(path) {
        Ok(text) => Ok(Some(text)),
        Err(error) if error.kind() == io::ErrorKind::NotFound => Ok(None),
        Err(error) => Err(error),
    }
}

/// Copies the file at `path` into `folder` as `<name>-<today>.<ext>`, unless a copy for `today` is already there or
/// there is no file yet, then deletes the oldest copies beyond `keep`. Called before each save, so a day's copy holds
/// the file as it stood before that day's first save. `today` is a date written `YYYY-MM-DD`, given by the caller.
/// Used by `save_record`: Monday's first save copies the record to `copies/record-2026-11-16.json`.
pub fn copy_once_a_day(path: &Path, folder: &Path, today: &str, keep: usize) -> io::Result<()> {
    if !path.exists() {
        return Ok(());
    }
    // record.json → record-2026-11-16.json
    let stem = path.file_stem().unwrap_or_default().to_string_lossy();
    let ext = path.extension().unwrap_or_default().to_string_lossy();
    let copy = folder.join(format!("{stem}-{today}.{ext}"));
    if !copy.exists() {
        fs::create_dir_all(folder)?;
        fs::copy(path, &copy)?;
    }
    for old in list_copies(folder)?.iter().skip(keep) {
        fs::remove_file(old)?;
    }
    Ok(())
}

/// Lists the copies in `folder`, newest first. An empty list when the folder does not exist yet. Used by
/// `copy_once_a_day` to find the copies past 14, and later to offer the newest when the record cannot be read.
pub fn list_copies(folder: &Path) -> io::Result<Vec<PathBuf>> {
    let entries = match fs::read_dir(folder) {
        Ok(entries) => entries,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(Vec::new()),
        Err(error) => return Err(error),
    };
    let mut copies = entries
        .map(|entry| entry.map(|e| e.path()))
        .collect::<io::Result<Vec<PathBuf>>>()?;
    // The date in the name sorts as text, so the newest name is the largest
    copies.sort();
    copies.reverse();
    Ok(copies)
}

// ======================================
//               Helpers
// ======================================

/// Writes `contents` to a temporary file beside `path` and forces it onto the disk; `path` itself is not touched.
/// Used by `save_safely` as its first half: `record.json` is written as `record.json.tmp`.
fn write_temp(path: &Path, contents: &str) -> io::Result<PathBuf> {
    // record.json → record.json.tmp, in the same folder, so the swap stays on one disk
    let mut name = path
        .file_name()
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput, "the path names no file"))?
        .to_os_string();
    name.push(".tmp");
    let temp = path.with_file_name(name);

    let mut file = File::create(&temp)?;
    file.write_all(contents.as_bytes())?;
    file.sync_all()?; // Forced onto the disk, not just handed to the system
    Ok(temp)
}

/// Moves the finished temporary file over `path` in one step. Used by `save_safely` as its second half.
fn swap_in(temp: &Path, path: &Path) -> io::Result<()> {
    fs::rename(temp, path)
}

// ======================================
//               Tests
// ======================================

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    // === Constants ===

    const OLD: &str = r#"{"version":1,"entries":["Monday"]}"#;
    const NEW: &str = r#"{"version":1,"entries":["Monday","Tuesday"]}"#;
    const KEEP: usize = 14;

    // === Helpers ===

    /// The file names of `paths`, for comparing copies by name. Used by the copy tests: `record-2026-11-16.json`
    fn names(paths: &[PathBuf]) -> Vec<String> {
        paths
            .iter()
            .map(|p| p.file_name().unwrap().to_string_lossy().into_owned())
            .collect()
    }

    // === Tests ===

    #[test]
    fn a_save_replaces_the_record_whole() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        fs::write(&record, OLD).unwrap();

        save_safely(&record, NEW).unwrap();

        assert_eq!(fs::read_to_string(&record).unwrap(), NEW);
        let files = fs::read_dir(folder.path()).unwrap().count();
        assert_eq!(files, 1, "no temporary file is left behind");
    }

    #[test]
    fn a_save_cut_short_before_the_swap_leaves_the_record_as_it_was() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        fs::write(&record, OLD).unwrap();

        // A crash between the two halves: the temporary file is written, the swap never happens
        write_temp(&record, NEW).unwrap();

        assert_eq!(fs::read_to_string(&record).unwrap(), OLD);
    }

    #[test]
    fn reading_no_file_means_no_record_yet() {
        let folder = tempdir().unwrap();

        let text = read_text(&folder.path().join("record.json")).unwrap();

        assert_eq!(text, None);
    }

    #[test]
    fn reading_a_file_gives_its_text() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        fs::write(&record, OLD).unwrap();

        assert_eq!(read_text(&record).unwrap().as_deref(), Some(OLD));
    }

    #[test]
    fn a_copy_is_made_once_on_each_day_the_app_saves() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        let copies = folder.path().join("copies");
        fs::write(&record, OLD).unwrap();

        // Three saves on Monday, none on Tuesday, one on Wednesday
        copy_once_a_day(&record, &copies, "2026-11-16", KEEP).unwrap();
        fs::write(&record, NEW).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-16", KEEP).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-16", KEEP).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-18", KEEP).unwrap();

        let names = names(&list_copies(&copies).unwrap());
        assert_eq!(names, ["record-2026-11-18.json", "record-2026-11-16.json"]);
        // Monday's copy is the record as it stood before Monday's first save
        let monday = fs::read_to_string(copies.join("record-2026-11-16.json")).unwrap();
        assert_eq!(monday, OLD);
    }

    #[test]
    fn no_copy_before_the_first_record_exists() {
        let folder = tempdir().unwrap();
        let copies = folder.path().join("copies");

        copy_once_a_day(
            &folder.path().join("record.json"),
            &copies,
            "2026-11-16",
            KEEP,
        )
        .unwrap();

        assert!(list_copies(&copies).unwrap().is_empty());
    }

    #[test]
    fn the_fifteenth_copy_deletes_the_oldest() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        let copies = folder.path().join("copies");
        fs::write(&record, OLD).unwrap();

        for day in 1..=15 {
            copy_once_a_day(&record, &copies, &format!("2026-12-{day:02}"), KEEP).unwrap();
        }

        let names = names(&list_copies(&copies).unwrap());
        assert_eq!(names.len(), 14);
        assert_eq!(
            names.first().map(String::as_str),
            Some("record-2026-12-15.json")
        );
        assert_eq!(
            names.last().map(String::as_str),
            Some("record-2026-12-02.json")
        );
    }
}
