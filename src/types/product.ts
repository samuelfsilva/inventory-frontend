export interface Product {
  id: string
  name: string
  description: string
  isActive: boolean
  categoryId: string
  groupId: string
  category: {
    id: string
    description: string
  }
  group: {
    id: string
    description: string
  }
}

export interface NewProduct {
  name: string
  description: string
  categoryId: string
  groupId: string
}

export interface ProductReview {
  name?: string
  description?: string
  isActive?: string
  categoryId?: string
  groupId?: string
}

export interface ProductResponse {
  error: ProductReview
}
