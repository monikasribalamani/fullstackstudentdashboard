import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { studentFormSchema, type StudentFormSchema } from '@/utils/validation'
import { DEPARTMENTS, YEARS, type StudentFormValues } from '@/types/student'

interface StudentFormProps {
  defaultValues?: Partial<StudentFormValues>
  onSubmit: (values: StudentFormValues) => void
  isSubmitting: boolean
  submitLabel: string
}

export function StudentForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormSchema>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      student_id: defaultValues?.student_id ?? '',
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      department: defaultValues?.department ?? '',
      year: defaultValues?.year ?? 1,
      cgpa: defaultValues?.cgpa ?? 0,
      status: defaultValues?.status ?? 'active',
    },
  })

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Student ID"
            placeholder="STU2024001"
            error={errors.student_id?.message}
            {...register('student_id')}
          />
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane.doe@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1234567890"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Select label="Department" error={errors.department?.message} {...register('department')}>
            <option value="" disabled>
              Select department
            </option>
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </Select>
          <Select
            label="Year"
            error={errors.year?.message}
            {...register('year', { valueAsNumber: true })}
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </Select>
          <Input
            label="CGPA"
            type="number"
            step="0.01"
            min={0}
            max={10}
            placeholder="8.75"
            error={errors.cgpa?.message}
            {...register('cgpa', { valueAsNumber: true })}
          />
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
          <Button type="submit" isLoading={isSubmitting}>
            <Save className="h-4 w-4" />
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}
