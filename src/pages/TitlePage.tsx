import { navigate } from '../useHashRoute'

export default function TitlePage() {
  return (
    <div className="page title-page">
      <h1>
        CVメモ
        <span className="sub">（カメラボイスメモ）</span>
      </h1>
      <p className="privacy">
        データはブラウザの中だけで保管されます。
        <br />
        サーバにアップロードされません。
      </p>
      <button className="btn primary" onClick={() => navigate('/memos')}>
        はじめる
      </button>
    </div>
  )
}
