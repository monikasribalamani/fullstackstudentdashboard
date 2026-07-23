import { apiClient } from '@/services/api'
import type {
  DashboardStats,
  MessageResponse,
  Student,
  StudentFormValues,
  StudentListResponse,
  StudentQueryParams,
} from '@/types/student'

function buildQueryString(params: StudentQueryParams): string {
  const search = new URLSearchParams()

  if (params.search) search.set('search', params.search)
  if (params.department) search.set('department', params.department)
  if (params.status) search.set('status', params.status)
  if (params.sort_by) search.set('sort_by', params.sort_by)
  if (params.sort_order) search.set('sort_order', params.sort_order)
  search.set('page', String(params.page ?? 1))
  search.set('page_size', String(params.page_size ?? 10))

  return search.toString()
}

export async function getStudents(
  params: StudentQueryParams = {},
): Promise<StudentListResponse> {
  const query = buildQueryString(params)
  const { data } = await apiClient.get<StudentListResponse>(`/api/students?${query}`)
  return data
}

export async function getStudent(studentId: string): Promise<Student> {
  const { data } = await apiClient.get<Student>(`/api/students/${studentId}`)
  return data
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>('/api/students/stats')
  return data
}

export async function createStudent(payload: StudentFormValues): Promise<Student> {
  const { data } = await apiClient.post<Student>('/api/students', payload)
  return data
}

export async function updateStudent(
  studentId: string,
  payload: Partial<StudentFormValues>,
): Promise<Student> {
  const { data } = await apiClient.put<Student>(`/api/students/${studentId}`, payload)
  return data
}

export async function deleteStudent(studentId: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(`/api/students/${studentId}`)
  return data
}

export async function deleteAllStudents(): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>('/api/students/all')
  return data
}
