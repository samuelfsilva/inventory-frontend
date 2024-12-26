export interface UnknownResponse {
  error: {
    [key: string]: string
  }
}

export interface CategoryReview {
  description?: string
  isActive?: boolean
}

export interface BatchReview {
  description?: string
  expirationDate?: Date
}
