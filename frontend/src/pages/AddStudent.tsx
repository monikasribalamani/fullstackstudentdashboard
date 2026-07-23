import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StudentForm } from '@/components/StudentForm'
import { useCreateStudentMutation } from '@/hooks/useStudents'
import { useToast } from '@/context/ToastContext'
import type { StudentFormValues } from '@/types/student'

export function AddStudent() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const createMutation = useCreateStudentMutation()

  async function handleSubmit(values: StudentFormValues) {
    try {
      const student = await createMutation.mutateAsync(values)
      showToast(`${student.name} was added successfully.`, 'success')
      navigate(`/students/${student.student_id}`)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create student.', 'error')
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
          Add Student
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Fill in the details below to create a new student record.
        </p>
      </div>

      <StudentForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Student"
      />
    </div>
  )
}
