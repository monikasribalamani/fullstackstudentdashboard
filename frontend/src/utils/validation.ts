import { z } from 'zod'

const STUDENT_ID_REGEX = /^[A-Za-z0-9-]{3,50}$/
const PHONE_REGEX = /^\+?[0-9]{7,15}$/

export const studentFormSchema = z.object({
  student_id: z
    .string()
    .min(3, 'Student ID must be at least 3 characters')
    .max(50, 'Student ID must be at most 50 characters')
    .regex(STUDENT_ID_REGEX, 'Only letters, digits, and hyphens are allowed'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(150, 'Name must be at most 150 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(PHONE_REGEX, 'Enter a valid phone number (7-15 digits, optional leading +)'),
  department: z
    .string()
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department must be at most 100 characters'),
  year: z.coerce.number().int().min(1, 'Year must be between 1 and 6').max(6, 'Year must be between 1 and 6'),
  cgpa: z.coerce.number().min(0, 'CGPA must be between 0 and 10').max(10, 'CGPA must be between 0 and 10'),
  status: z.enum(['active', 'inactive']),
})

export type StudentFormSchema = z.infer<typeof studentFormSchema>
