import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cgpaColorClasses, formatCgpa, statusBadgeClasses } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { SortField, SortOrder, Student } from '@/types/student'

interface StudentTableProps {
  students: Student[]
  sortBy: SortField
  sortOrder: SortOrder
  onSortChange: (field: SortField) => void
  onDelete: (student: Student) => void
}

interface Column {
  field: SortField
  label: string
  sortable: boolean
  className?: string
}

const COLUMNS: Column[] = [
  { field: 'student_id', label: 'Student ID', sortable: true },
  { field: 'name', label: 'Name', sortable: true },
  { field: 'department', label: 'Department', sortable: true, className: 'hidden lg:table-cell' },
  { field: 'year', label: 'Year', sortable: true, className: 'hidden md:table-cell' },
  { field: 'cgpa', label: 'CGPA', sortable: true },
  { field: 'status', label: 'Status', sortable: true },
]

export function StudentTable({
  students,
  sortBy,
  sortOrder,
  onSortChange,
  onDelete,
}: StudentTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            {COLUMNS.map((column) => (
              <th
                key={column.field}
                className={cn(
                  'px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400',
                  column.className,
                )}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange(column.field)}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    {column.label}
                    <SortIcon active={sortBy === column.field} order={sortOrder} />
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
            <th className="hidden px-6 py-3.5 font-semibold text-slate-500 sm:table-cell dark:text-slate-400">
              Email
            </th>
            <th className="hidden px-6 py-3.5 font-semibold text-slate-500 sm:table-cell dark:text-slate-400">
              Phone
            </th>
            <th className="px-6 py-3.5 text-right font-semibold text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-b border-slate-50 transition-colors hover:bg-slate-50/70 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
            >
              <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                {student.student_id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                {student.name}
              </td>
              <td className="hidden whitespace-nowrap px-6 py-4 text-slate-600 lg:table-cell dark:text-slate-400">
                {student.department}
              </td>
              <td className="hidden whitespace-nowrap px-6 py-4 text-slate-600 md:table-cell dark:text-slate-400">
                Year {student.year}
              </td>
              <td className={cn('whitespace-nowrap px-6 py-4 font-semibold', cgpaColorClasses(student.cgpa))}>
                {formatCgpa(student.cgpa)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Badge className={statusBadgeClasses(student.status)}>{student.status}</Badge>
              </td>
              <td className="hidden whitespace-nowrap px-6 py-4 text-slate-600 sm:table-cell dark:text-slate-400">
                {student.email}
              </td>
              <td className="hidden whitespace-nowrap px-6 py-4 text-slate-600 sm:table-cell dark:text-slate-400">
                {student.phone}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/students/${student.student_id}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
                    aria-label={`View ${student.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/students/${student.student_id}/edit`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
                    aria-label={`Edit ${student.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(student)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                    aria-label={`Delete ${student.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
  return order === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
  )
}
