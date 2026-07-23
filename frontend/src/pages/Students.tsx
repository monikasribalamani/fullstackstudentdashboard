import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, UserX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { StudentTable } from '@/components/StudentTable'
import { StudentFilters } from '@/components/StudentFilters'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useDebounce } from '@/hooks/useDebounce'
import {
  useDeleteAllStudentsMutation,
  useDeleteStudentMutation,
  useStudentsQuery,
} from '@/hooks/useStudents'
import { useToast } from '@/context/ToastContext'
import type { SortField, SortOrder, Student } from '@/types/student'

const PAGE_SIZE = 10

export function Students() {
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [page, setPage] = useState(1)

  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [isDeleteAllOpen, setDeleteAllOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const studentsQuery = useStudentsQuery({
    search: debouncedSearch || undefined,
    department: department || undefined,
    status: (status || undefined) as 'active' | 'inactive' | undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    page_size: PAGE_SIZE,
  })

  const deleteStudentMutation = useDeleteStudentMutation()
  const deleteAllMutation = useDeleteAllStudentsMutation()

  const hasActiveFilters = Boolean(debouncedSearch || department || status)

  function handleSortChange(field: SortField) {
    if (field === sortBy) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleDepartmentChange(value: string) {
    setDepartment(value)
    setPage(1)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    setPage(1)
  }

  async function confirmDelete() {
    if (!studentToDelete) return
    try {
      await deleteStudentMutation.mutateAsync(studentToDelete.student_id)
      showToast(`${studentToDelete.name} was deleted successfully.`, 'success')
      setStudentToDelete(null)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete student.', 'error')
    }
  }

  async function confirmDeleteAll() {
    try {
      await deleteAllMutation.mutateAsync()
      showToast('All students were deleted successfully.', 'success')
      setDeleteAllOpen(false)
      setPage(1)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete all students.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Students
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your student records — search, filter, and update as needed.
          </p>
        </div>
        <div className="flex gap-3">
          {studentsQuery.data && studentsQuery.data.total > 0 && (
            <Button variant="outline" onClick={() => setDeleteAllOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete All
            </Button>
          )}
          <Link to="/students/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <StudentFilters
          search={search}
          onSearchChange={handleSearchChange}
          department={department}
          onDepartmentChange={handleDepartmentChange}
          status={status}
          onStatusChange={handleStatusChange}
        />
      </Card>

      <Card className="overflow-hidden">
        {studentsQuery.isPending && <TableSkeleton />}

        {studentsQuery.isError && (
          <ErrorState
            message="We couldn't load students. Please check your connection and try again."
            onRetry={() => studentsQuery.refetch()}
          />
        )}

        {studentsQuery.isSuccess && studentsQuery.data.items.length === 0 && !hasActiveFilters && (
          <EmptyState
            icon={<UserX className="h-6 w-6" />}
            title="No students yet"
            description="Get started by adding your first student record."
            action={
              <Link to="/students/new">
                <Button size="sm" className="mt-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </Link>
            }
          />
        )}

        {studentsQuery.isSuccess && studentsQuery.data.items.length === 0 && hasActiveFilters && (
          <EmptyState
            icon={<UserX className="h-6 w-6" />}
            title="No matching students"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        )}

        {studentsQuery.isSuccess && studentsQuery.data.items.length > 0 && (
          <>
            <StudentTable
              students={studentsQuery.data.items}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onDelete={setStudentToDelete}
            />
            <Pagination
              page={studentsQuery.data.page}
              totalPages={studentsQuery.data.total_pages}
              totalItems={studentsQuery.data.total}
              pageSize={studentsQuery.data.page_size}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        title="Delete Student"
        description={`Are you sure you want to delete ${studentToDelete?.name ?? 'this student'}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteStudentMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setStudentToDelete(null)}
      />

      <ConfirmDialog
        isOpen={isDeleteAllOpen}
        title="Delete All Students"
        description="This will permanently delete every student record in the system. This action cannot be undone."
        confirmLabel="Delete All"
        isLoading={deleteAllMutation.isPending}
        onConfirm={confirmDeleteAll}
        onCancel={() => setDeleteAllOpen(false)}
      />
    </div>
  )
}
