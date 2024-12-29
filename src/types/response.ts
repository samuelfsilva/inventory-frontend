export interface UnknownResponse {
  error: {
    [key: string]: string
  }
}

export interface CategoryReview {
  description?: string
  isActive?: boolean
}

export interface CategoryResponse {
  error: CategoryReview
}

export interface ApiResponse<T> {
  status: number
  data: T | CategoryResponse | null
}

export interface BatchReview {
  description?: string
  expirationDate?: Date
}
