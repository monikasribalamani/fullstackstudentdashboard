import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StudentForm } from '@/components/StudentForm'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useStudentQuery, useUpdateStudentMutation } from '@/hooks/useStudents'
import { useToast } from '@/context/ToastContext'
import type { StudentFormValues } from '@/types/student'

export function EditStudent() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const studentQuery = useStudentQuery(studentId)
  const updateMutation = useUpdateStudentMutation(studentId ?? '')

  async function handleSubmit(values: StudentFormValues) {
    if (!studentId) return
    try {
      const student = await updateMutation.mutateAsync(values)
      showToast(`${student.name} was updated successfully.`, 'success')
      navigate(`/students/${student.student_id}`)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update student.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Edit Student
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update the student's information below.
        </p>
      </div>

      {studentQuery.isPending && <Spinner label="Loading student..." />}

      {studentQuery.isError && (
        <ErrorState
          message="We couldn't load this student's details."
          onRetry={() => studentQuery.refetch()}
        />
      )}

      {studentQuery.isSuccess && (
        <StudentForm
          defaultValues={studentQuery.data}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      )}
    </div>
  )
}
