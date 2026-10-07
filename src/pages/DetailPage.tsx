import { useState } from 'react'
import { formatDate, loadMemos, removeMemo } from '../storage'
import { navigate } from '../useHashRoute'

export default function DetailPage({ id }: { id: string }) {
  const [memo] = useState(() => loadMemos().find((m) => m.id === id))

  const handleDelete = () => {
    if (!window.confirm('このメモを削除します。よろしいですか？')) return
    removeMemo(id)
    navigate('/memos')
  }

  return (
    <div className="page">
      <header className="header">
        <button className="btn link" onClick={() => navigate('/memos')}>
          ← 戻る
        </button>
        <h1>メモ詳細</h1>
      </header>

      <main className="content">
        {memo ? (
          <>
            <img className="detail-image" src={memo.imageDataUrl} alt="撮影した画像" />
            {memo.audioDataUrl ? (
              <audio className="detail-audio" controls src={memo.audioDataUrl} />
            ) : (
              <p className="date">音声なし</p>
            )}
            <p className="date">作成日時: {formatDate(memo.createdAt)}</p>
          </>
        ) : (
          <p className="empty">メモが見つかりません。</p>
        )}
      </main>

      {memo && (
        <footer className="footer">
          <button className="btn danger" onClick={handleDelete}>
            このメモを削除
          </button>
        </footer>
      )}
    </div>
  )
}
