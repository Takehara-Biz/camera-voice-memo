import { useState } from 'react'
import { MAX_MEMOS, clearMemos, formatDate, loadMemos } from '../storage'
import { navigate } from '../useHashRoute'

export default function TopPage() {
  const [memos, setMemos] = useState(loadMemos)
  const full = memos.length >= MAX_MEMOS

  const handleClear = () => {
    if (!window.confirm('すべてのメモを削除します。よろしいですか？')) return
    clearMemos()
    setMemos([])
  }

  return (
    <div className="page">
      <header className="header">
        <h1>カメラ声メモ</h1>
        <span className="count">
          {memos.length} / {MAX_MEMOS}
        </span>
      </header>

      <main className="content">
        {memos.length === 0 ? (
          <p className="empty">メモはまだありません。<br />「新規作成」から撮影・録音しましょう。</p>
        ) : (
          <ul className="memo-list">
            {memos.map((m) => (
              <li key={m.id}>
                <button
                  className="memo-item"
                  onClick={() => navigate(`/memo/${encodeURIComponent(m.id)}`)}
                >
                  <img src={m.imageDataUrl} alt="" />
                  <span>{formatDate(m.createdAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="footer">
        {full && <p className="notice">上限（{MAX_MEMOS}件）に達しています。削除してから作成してください。</p>}
        <button
          className="btn primary"
          disabled={full}
          onClick={() => navigate('/new')}
        >
          ＋ 新規作成
        </button>
        <button
          className="btn danger"
          disabled={memos.length === 0}
          onClick={handleClear}
        >
          すべて削除
        </button>
      </footer>
    </div>
  )
}
