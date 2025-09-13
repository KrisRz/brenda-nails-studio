import { z } from 'zod'

export const AppointmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  service: z.enum([
    'manicure',
    'pedicure',
    'gel-nails',
    'nail-art',
    'french-manicure',
    'acrylic-nails',
    'nail-repair',
    'consultation'
  ], { required_error: 'Service is required' }),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Appointment = z.infer<typeof AppointmentSchema>

export const CreateAppointmentSchema = AppointmentSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>
