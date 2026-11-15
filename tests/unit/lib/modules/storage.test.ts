import { invoke } from '@tauri-apps/api/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadRecord, saveRecord } from '$lib/modules/storage'
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

describe('saving sends the whole record with the local date', () => {
  it('sends the record as JSON and the day it is on this machine', async () => {
    rust.mockResolvedValue(undefined)

    await saveRecord(RECORD, new Date(2026, 10, 16, 9, 0))

    expect(rust).toHaveBeenCalledWith('save_record', { json: expect.any(String), today: '2026-11-16' })
    const sent = rust.mock.calls[0][1] as { json: string }
    expect(JSON.parse(sent.json)).toEqual(RECORD)
  })

  it('names the local day on both sides of midnight, not the day in UTC', async () => {
    rust.mockResolvedValue(undefined)

    await saveRecord(RECORD, new Date(2026, 10, 16, 23, 59))
    await saveRecord(RECORD, new Date(2026, 10, 17, 0, 1))

    expect(rust.mock.calls.map(([, args]) => (args as { today: string }).today)).toEqual(['2026-11-16', '2026-11-17'])
  })
})

describe('a failed save is not hidden', () => {
  it("passes the Rust half's error on", async () => {
    rust.mockRejectedValue('No space left on device')

    await expect(saveRecord(RECORD)).rejects.toBe('No space left on device')
  })
})
