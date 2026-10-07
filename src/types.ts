export interface Memo {
  id: string
  /** JPEG の data URL */
  imageDataUrl: string
  /** 録音音声の data URL */
  audioDataUrl: string
  /** ISO 8601 */
  createdAt: string
}
