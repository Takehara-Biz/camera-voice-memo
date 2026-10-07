export interface Memo {
  id: string
  /** JPEG の data URL */
  imageDataUrl: string
  /** 録音音声の data URL（録音しなかった場合は null） */
  audioDataUrl: string | null
  /** ISO 8601 */
  createdAt: string
}
