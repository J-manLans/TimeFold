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

/// Copies the file at `path` into `folder` as `<name>-<today>.<ext>`, unless a copy for `today` is already there,
/// the file is the same as the newest copy, or there is no file yet; then deletes the oldest copies beyond `keep`.
/// Called when the app starts, once the file has passed the check, so every copy is a file that could be read. `today`
/// is a date written `YYYY-MM-DD`, given by the caller. Used by `copy_record`: Monday's start copies the record to
/// `copies/record-2026-11-16.json`, and Tuesday's makes none if nothing changed.
pub fn copy_once_a_day(path: &Path, folder: &Path, today: &str, keep: usize) -> io::Result<()> {
    let Some(contents) = read_text(path)? else {
        return Ok(());
    };
    // record.json → record-2026-11-16.json
    let stem = path.file_stem().unwrap_or_default().to_string_lossy();
    let ext = path.extension().unwrap_or_default().to_string_lossy();
    let copy = folder.join(format!("{stem}-{today}.{ext}"));
    let newest = list_copies(folder)?.into_iter().next();
    let same = match &newest {
        Some(newest) => read_text(newest)?.as_deref() == Some(contents.as_str()),
        None => false,
    };
    if !copy.exists() && !same {
        fs::create_dir_all(folder)?;
        fs::write(&copy, &contents)?;
    }
    for old in list_copies(folder)?.iter().skip(keep) {
        fs::remove_file(old)?;
    }
    Ok(())
}

/// Lists the copies in `folder`, newest first. An empty list when the folder does not exist yet. Used by
/// `copy_once_a_day` to compare with the newest and find the copies past 31, and by `newest_copy` to offer the newest
/// when the record cannot be read.
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
    const KEEP: usize = 31;

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
    fn a_copy_is_made_once_a_day_and_not_when_nothing_changed() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        let copies = folder.path().join("copies");
        fs::write(&record, OLD).unwrap();

        // Started three times on Monday, the record changed after the first; once on Tuesday; once on Wednesday,
        // nothing changed since Tuesday
        copy_once_a_day(&record, &copies, "2026-11-16", KEEP).unwrap();
        fs::write(&record, NEW).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-16", KEEP).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-16", KEEP).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-17", KEEP).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-18", KEEP).unwrap();

        let names = names(&list_copies(&copies).unwrap());
        // Tuesday's holds Monday's change; Wednesday's would be the same as Tuesday's, so it is dropped
        assert_eq!(names, ["record-2026-11-17.json", "record-2026-11-16.json"]);
        let monday = fs::read_to_string(copies.join("record-2026-11-16.json")).unwrap();
        assert_eq!(monday, OLD);
    }

    #[test]
    fn a_copy_the_same_as_the_newest_is_dropped() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        let copies = folder.path().join("copies");
        fs::write(&record, OLD).unwrap();

        copy_once_a_day(&record, &copies, "2026-11-16", KEEP).unwrap();
        copy_once_a_day(&record, &copies, "2026-11-17", KEEP).unwrap();

        assert_eq!(
            names(&list_copies(&copies).unwrap()),
            ["record-2026-11-16.json"]
        );
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
    fn the_thirty_second_copy_deletes_the_oldest() {
        let folder = tempdir().unwrap();
        let record = folder.path().join("record.json");
        let copies = folder.path().join("copies");

        // A different record each day, so none is dropped as the same
        for day in 1..=32 {
            fs::write(&record, format!(r#"{{"day":{day}}}"#)).unwrap();
            let date = format!("2027-{:02}-{:02}", 1 + (day - 1) / 28, 1 + (day - 1) % 28);
            copy_once_a_day(&record, &copies, &date, KEEP).unwrap();
        }

        let names = names(&list_copies(&copies).unwrap());
        assert_eq!(names.len(), 31);
        assert_eq!(
            names.first().map(String::as_str),
            Some("record-2027-02-04.json")
        );
        assert_eq!(
            names.last().map(String::as_str),
            Some("record-2027-01-02.json")
        );
    }
}
