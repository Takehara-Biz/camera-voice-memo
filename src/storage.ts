import type { Memo } from './types'

const KEY = 'camera-voice-memo:v1'
export const MAX_MEMOS = 10

export function loadMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as Memo[]) : []
  } catch {
    return []
  }
}

function save(memos: Memo[]): void {
  localStorage.setItem(KEY, JSON.stringify(memos))
}

/** 追加に失敗した場合（上限・容量超過）は Error を投げる */
export function addMemo(input: Omit<Memo, 'id' | 'createdAt'>): Memo {
  const memos = loadMemos()
  if (memos.length >= MAX_MEMOS) {
    throw new Error(`メモは最大${MAX_MEMOS}件までです`)
  }
  const memo: Memo = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  try {
    save([memo, ...memos])
  } catch {
    throw new Error('保存容量が足りません。不要なメモを削除してください')
  }
  return memo
}

export function removeMemo(id: string): void {
  save(loadMemos().filter((m) => m.id !== id))
}

export function clearMemos(): void {
  localStorage.removeItem(KEY)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
