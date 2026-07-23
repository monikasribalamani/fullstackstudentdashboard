import { Link } from 'react-router-dom'
import { Award, CheckCircle2, Plus, Users, XCircle } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useDashboardStatsQuery, useStudentsQuery } from '@/hooks/useStudents'
import { formatCgpa, formatDate, statusBadgeClasses } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'

export function Dashboard() {
  const statsQuery = useDashboardStatsQuery()
  const recentStudentsQuery = useStudentsQuery({
    page: 1,
    page_size: 5,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview of your student records at a glance.
          </p>
        </div>
        <Link to="/students/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      {statsQuery.isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      )}

      {statsQuery.isError && (
        <Card>
          <ErrorState
            message="We couldn't load dashboard statistics. Please check your connection and try again."
            onRetry={() => statsQuery.refetch()}
          />
        </Card>
      )}

      {statsQuery.isSuccess && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Students"
            value={statsQuery.data.total_students.toString()}
            icon={Users}
            accent="blue"
          />
          <StatCard
            label="Active Students"
            value={statsQuery.data.active_students.toString()}
            icon={CheckCircle2}
            accent="emerald"
          />
          <StatCard
            label="Inactive Students"
            value={statsQuery.data.inactive_students.toString()}
            icon={XCircle}
            accent="slate"
          />
          <StatCard
            label="Average CGPA"
            value={formatCgpa(statsQuery.data.average_cgpa)}
            icon={Award}
            accent="amber"
          />
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recently Added Students
          </h2>
          <Link
            to="/students"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            View all
          </Link>
        </div>

        {recentStudentsQuery.isPending && (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        )}

        {recentStudentsQuery.isError && (
          <ErrorState
            message="We couldn't load recent students."
            onRetry={() => recentStudentsQuery.refetch()}
          />
        )}

        {recentStudentsQuery.isSuccess && recentStudentsQuery.data.items.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No students yet. Add your first student to get started.
          </div>
        )}

        {recentStudentsQuery.isSuccess && recentStudentsQuery.data.items.length > 0 && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentStudentsQuery.data.items.map((student) => (
              <li key={student.id}>
                <Link
                  to={`/students/${student.student_id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {student.student_id} &middot; {student.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusBadgeClasses(student.status)}>{student.status}</Badge>
                    <span className="hidden text-xs text-slate-400 sm:inline">
                      {formatDate(student.created_at)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
