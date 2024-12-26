export interface Batch {
  id: string
  description: string
  expirationDate: Date
}

export interface NewBatch {
  description: string
  expirationDate: Date
}
