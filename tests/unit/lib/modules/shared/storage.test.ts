import { invoke } from '@tauri-apps/api/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { copyRecord, loadRecord, loadSettings, newestCopy, saveRecord, saveSettings } from '$lib/modules/shared/storage'
import { RECORD } from '$tests/helpers/records'

// === Stand-ins ===

// invoke only works inside the app window; here it plays the Rust half
vi.mock('@tauri-apps/api/core', () => ({ invoke: vi.fn() }))
const rust = vi.mocked(invoke)

beforeEach(() => {
  rust.mockReset()
})

// === Tests ===

describe('loading with no record on the disk gives no record yet', () => {
  it('gives null', async () => {
    rust.mockResolvedValue(null)

    expect(await loadRecord()).toBeNull()
    expect(rust).toHaveBeenCalledWith('load_record')
  })
})

describe('loading a record checks it', () => {
  it('gives the record when the file is sound', async () => {
    rust.mockResolvedValue(JSON.stringify(RECORD))

    expect(await loadRecord()).toEqual({ ok: true, record: RECORD })
  })

  it('gives the problem when the file is not sound', async () => {
    rust.mockResolvedValue('{"burger-joint": "mcdonalds", "cows": 256}')

    expect(await loadRecord()).toEqual({ ok: false, problem: { kind: 'not-a-record' } })
  })
})

describe('saving sends the whole record, and copies nothing', () => {
  it('sends the record as JSON', async () => {
    rust.mockResolvedValue(undefined)

    await saveRecord(RECORD)

    expect(rust).toHaveBeenCalledWith('save_record', { json: expect.any(String) })
    const sent = rust.mock.calls[0][1] as { json: string }
    expect(JSON.parse(sent.json)).toEqual(RECORD)
  })
})

describe('the day’s copy is asked for with the local date', () => {
  it('names the local day on both sides of midnight, not the day in UTC', async () => {
    rust.mockResolvedValue(undefined)

    await copyRecord(new Date(2026, 10, 16, 23, 59))
    await copyRecord(new Date(2026, 10, 17, 0, 1))

    expect(rust.mock.calls).toEqual([
      ['copy_record', { today: '2026-11-16' }],
      ['copy_record', { today: '2026-11-17' }],
    ])
  })
})

describe('the newest copy is read and checked, with its day', () => {
  it('gives the day and the record', async () => {
    rust.mockResolvedValue(['2026-11-16', JSON.stringify(RECORD)])

    expect(await newestCopy()).toEqual({ day: '2026-11-16', record: RECORD })
    expect(rust).toHaveBeenCalledWith('newest_copy')
  })

  it('gives null when there is no copy, or the newest cannot be read', async () => {
    rust.mockResolvedValueOnce(null).mockResolvedValueOnce(['2026-11-16', '{"broken'])

    expect([await newestCopy(), await newestCopy()]).toEqual([null, null])
  })
})

describe('a failed save is not hidden', () => {
  it("passes the Rust half's error on", async () => {
    rust.mockRejectedValue('No space left on device')

    await expect(saveRecord(RECORD)).rejects.toBe('No space left on device')
  })
})

describe('loading the settings reads the machine’s own file', () => {
  it('gives the theme from the file', async () => {
    rust.mockResolvedValue('{"theme":"light"}')

    expect(await loadSettings()).toEqual({ theme: 'light', motion: 'system' })
    expect(rust).toHaveBeenCalledWith('load_settings')
  })

  it('gives System, with no error, when the file cannot be read', async () => {
    rust.mockRejectedValue('Permission denied')

    expect(await loadSettings()).toEqual({ theme: 'system', motion: 'system' })
  })
})

describe('saving the settings sends them as JSON', () => {
  it('sends the theme and the motion', async () => {
    rust.mockResolvedValue(undefined)

    await saveSettings({ theme: 'dark', motion: 'on' })

    const sent = rust.mock.calls[0][1] as { json: string }
    expect(rust.mock.calls[0][0]).toBe('save_settings')
    expect(JSON.parse(sent.json)).toEqual({ theme: 'dark', motion: 'on' })
  })
})
