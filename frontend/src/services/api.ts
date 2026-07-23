import axios, { AxiosError } from 'axios'
import type { ApiErrorBody } from '@/types/student'

export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred while contacting the server.'
    const details = error.response?.data?.details

    return Promise.reject(new ApiError(message, status, details))
  },
)
