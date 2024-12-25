import { Category, NewCategory } from '@/types/category'
import { UnknownResponse } from '@/types/response'
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/category`)
  return response.data as Category[]
}

export const getCategory = async (id: string): Promise<Category> => {
  const response = await axios.get(`${API_URL}/category/${id}`)
  return response.data as Category
}

export const createCategory = async (category: NewCategory) => {
  try {
    const response = await axios.post(`${API_URL}/category`, category)
    return response
  } catch (error) {
    const axiosError = error as AxiosError<UnknownResponse>
    return axiosError.response
  }
}

export const updateCategory = async (id: string, category: NewCategory) => {
  try {
    const response = await axios.put(`${API_URL}/category/${id}`, category)
    return response
  } catch (error) {
    const axiosError = error as AxiosError<UnknownResponse>
    return axiosError.response
  }
}

export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/category/${id}`)
    return response
  } catch (error) {
    const axiosError = error as AxiosError<UnknownResponse>
    return axiosError.response
  }
}