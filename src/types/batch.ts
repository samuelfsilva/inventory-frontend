export interface Batch {
  id: string
  description: string
  expirationDate: Date
}

export interface NewBatch {
  description: string
  expirationDate: Date | null
}

export interface BatchReview {
  description?: string
  expirationDate?: string
}

export interface BatchResponse {
  error: BatchReview
}
