import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useDeleteStudentMutation, useStudentQuery } from '@/hooks/useStudents'
import { useToast } from '@/context/ToastContext'
import {
  cgpaColorClasses,
  formatCgpa,
  formatDateTime,
  getInitials,
  ordinalYear,
  statusBadgeClasses,
} from '@/utils/format'

export function StudentDetails() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  const studentQuery = useStudentQuery(studentId)
  const deleteMutation = useDeleteStudentMutation()

  async function handleDelete() {
    if (!studentId) return
    try {
      await deleteMutation.mutateAsync(studentId)
      showToast('Student was deleted successfully.', 'success')
      navigate('/students')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete student.', 'error')
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

      {studentQuery.isPending && <Spinner label="Loading student..." />}

      {studentQuery.isError && (
        <ErrorState
          message="We couldn't load this student's details."
          onRetry={() => studentQuery.refetch()}
        />
      )}

      {studentQuery.isSuccess && (
        <>
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-xl font-bold text-white">
                  {getInitials(studentQuery.data.name)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {studentQuery.data.name}
                  </h1>
                  <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
                    {studentQuery.data.student_id}
                  </p>
                  <Badge className={`mt-2 ${statusBadgeClasses(studentQuery.data.status)}`}>
                    {studentQuery.data.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to={`/students/${studentQuery.data.student_id}/edit`}>
                  <Button variant="outline">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-100 pt-8 sm:grid-cols-2 lg:grid-cols-3 dark:border-slate-800">
              <DetailItem icon={Mail} label="Email" value={studentQuery.data.email} />
              <DetailItem icon={Phone} label="Phone" value={studentQuery.data.phone} />
              <DetailItem icon={Building2} label="Department" value={studentQuery.data.department} />
              <DetailItem
                icon={Calendar}
                label="Year"
                value={ordinalYear(studentQuery.data.year)}
              />
              <DetailItem
                icon={Award}
                label="CGPA"
                value={formatCgpa(studentQuery.data.cgpa)}
                valueClassName={cgpaColorClasses(studentQuery.data.cgpa)}
              />
              <DetailItem
                icon={Calendar}
                label="Enrolled On"
                value={formatDateTime(studentQuery.data.created_at)}
              />
            </dl>
          </Card>

          <ConfirmDialog
            isOpen={isDeleteOpen}
            title="Delete Student"
            description={`Are you sure you want to delete ${studentQuery.data.name}? This action cannot be undone.`}
            confirmLabel="Delete"
            isLoading={deleteMutation.isPending}
            onConfirm={handleDelete}
            onCancel={() => setDeleteOpen(false)}
          />
        </>
      )}
    </div>
  )
}

function DetailItem({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: typeof Mail
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className={`mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100 ${valueClassName ?? ''}`}>
          {value}
        </dd>
      </div>
    </div>
  )
}
