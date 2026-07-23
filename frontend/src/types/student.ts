export type StudentStatus = 'active' | 'inactive'

export interface Student {
  id: string
  student_id: string
  name: string
  email: string
  phone: string
  department: string
  year: number
  cgpa: number
  status: StudentStatus
  created_at: string
  updated_at: string
}

export interface StudentListResponse {
  items: Student[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface DashboardStats {
  total_students: number
  active_students: number
  inactive_students: number
  average_cgpa: number
}

export interface StudentFormValues {
  student_id: string
  name: string
  email: string
  phone: string
  department: string
  year: number
  cgpa: number
  status: StudentStatus
}

export type SortField =
  | 'student_id'
  | 'name'
  | 'department'
  | 'year'
  | 'cgpa'
  | 'status'
  | 'created_at'

export type SortOrder = 'asc' | 'desc'

export interface StudentQueryParams {
  search?: string
  department?: string
  status?: StudentStatus
  sort_by?: SortField
  sort_order?: SortOrder
  page?: number
  page_size?: number
}

export interface ApiErrorBody {
  success: false
  message: string
  details?: unknown
}

export interface MessageResponse {
  success: boolean
  message: string
  details?: unknown
}

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
] as const

export const YEARS = [1, 2, 3, 4, 5, 6] as const
