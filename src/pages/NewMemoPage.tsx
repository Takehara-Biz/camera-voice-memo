import { useEffect, useRef, useState } from 'react'
import { addMemo } from '../storage'
import { navigate } from '../useHashRoute'

const MAX_RECORD_SEC = 10
const MAX_IMAGE_EDGE = 640

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop())
}

export default function NewMemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<number | null>(null)

  const [cameraError, setCameraError] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [audio, setAudio] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [micError, setMicError] = useState('')
  const [saveError, setSaveError] = useState('')

  // カメラ起動（撮影済みの間は停止）
  useEffect(() => {
    if (image) return
    let cancelled = false
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stopStream(stream)
          return
        }
        cameraStreamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          void video.play()
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCameraError('カメラを利用できません。ブラウザのカメラ許可を確認してください。')
        }
      })
    return () => {
      cancelled = true
      stopStream(cameraStreamRef.current)
      cameraStreamRef.current = null
    }
  }, [image])

  // 画面を離れるときに録音を止める
  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
      const rec = recorderRef.current
      if (rec && rec.state !== 'inactive') {
        rec.onstop = null
        rec.stop()
        stopStream(rec.stream)
      }
    },
    [],
  )

  const capture = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    setImage(canvas.toDataURL('image/jpeg', 0.7))
  }

  const stopRecording = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') rec.stop()
  }

  const startRecording = async () => {
    setMicError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream, { audioBitsPerSecond: 32000 })
      const chunks: Blob[] = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      rec.onstop = () => {
        stopStream(stream)
        setRecording(false)
        const blob = new Blob(chunks, { type: rec.mimeType || chunks[0]?.type })
        void blobToDataUrl(blob).then(setAudio)
      }
      recorderRef.current = rec
      rec.start()
      setAudio(null)
      setElapsed(0)
      setRecording(true)
      const startedAt = Date.now()
      timerRef.current = window.setInterval(() => {
        const sec = (Date.now() - startedAt) / 1000
        setElapsed(Math.min(sec, MAX_RECORD_SEC))
        if (sec >= MAX_RECORD_SEC) stopRecording()
      }, 100)
    } catch {
      setMicError('マイクを利用できません。ブラウザのマイク許可を確認してください。')
    }
  }

  const handleSave = () => {
    if (!image) return
    try {
      addMemo({ imageDataUrl: image, audioDataUrl: audio })
      navigate('/memos')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : '保存に失敗しました')
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>新規メモ</h1>
      </header>

      <main className="content">
        <section className="area">
          <h2>① 写真</h2>
          <div className="camera">
            {image ? (
              <img src={image} alt="撮影した画像" />
            ) : cameraError ? (
              <p className="error">{cameraError}</p>
            ) : (
              <video ref={videoRef} playsInline muted />
            )}
          </div>
          {image ? (
            <button className="btn" onClick={() => setImage(null)}>
              撮り直す
            </button>
          ) : (
            <button className="btn primary" onClick={capture} disabled={!!cameraError}>
              📷 撮影
            </button>
          )}
        </section>

        <section className="area">
          <h2>② 声（任意・最大{MAX_RECORD_SEC}秒）</h2>
          <div className="meter">
            <div
              className="meter-bar"
              style={{ width: `${(elapsed / MAX_RECORD_SEC) * 100}%` }}
            />
          </div>
          <p className="timer">
            {elapsed.toFixed(1)} / {MAX_RECORD_SEC} 秒
          </p>
          {recording ? (
            <button className="btn danger" onClick={stopRecording}>
              ■ 録音終了
            </button>
          ) : (
            <button className="btn primary" onClick={() => void startRecording()}>
              ● {audio ? '録音し直す' : '録音開始'}
            </button>
          )}
          {audio && !recording && <audio controls src={audio} />}
          {micError && <p className="error">{micError}</p>}
        </section>
        {saveError && <p className="error">{saveError}</p>}
      </main>

      <footer className="footer row">
        <button className="btn" onClick={() => navigate('/memos')}>
          キャンセル
        </button>
        <button
          className="btn primary"
          disabled={!image || recording}
          onClick={handleSave}
        >
          保存
        </button>
      </footer>
    </div>
  )
}
