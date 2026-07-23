import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DEPARTMENTS, type StudentStatus } from '@/types/student'

interface StudentFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  department: string
  onDepartmentChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
}

export function StudentFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
}: StudentFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
      <Input
        placeholder="Search by name, student ID, or email..."
        icon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search students"
      />
      <Select
        value={department}
        onChange={(event) => onDepartmentChange(event.target.value)}
        aria-label="Filter by department"
        className="sm:w-52"
      >
        <option value="">All departments</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </Select>
      <Select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as StudentStatus | '')}
        aria-label="Filter by status"
        className="sm:w-40"
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
    </div>
  )
}
