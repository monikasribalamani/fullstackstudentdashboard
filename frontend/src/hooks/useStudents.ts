import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createStudent,
  deleteAllStudents,
  deleteStudent,
  getDashboardStats,
  getStudent,
  getStudents,
  updateStudent,
} from '@/services/studentService'
import type { StudentFormValues, StudentQueryParams } from '@/types/student'

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params: StudentQueryParams) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (studentId: string) => [...studentKeys.details(), studentId] as const,
  stats: () => [...studentKeys.all, 'stats'] as const,
}

export function useStudentsQuery(params: StudentQueryParams) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => getStudents(params),
    placeholderData: keepPreviousData,
  })
}

export function useStudentQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: studentKeys.detail(studentId ?? ''),
    queryFn: () => getStudent(studentId as string),
    enabled: Boolean(studentId),
  })
}

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: studentKeys.stats(),
    queryFn: getDashboardStats,
  })
}

export function useCreateStudentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StudentFormValues) => createStudent(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studentKeys.all })
    },
  })
}

export function useUpdateStudentMutation(studentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<StudentFormValues>) => updateStudent(studentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studentKeys.all })
    },
  })
}

export function useDeleteStudentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (studentId: string) => deleteStudent(studentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studentKeys.all })
    },
  })
}

export function useDeleteAllStudentsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteAllStudents(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studentKeys.all })
    },
  })
}
