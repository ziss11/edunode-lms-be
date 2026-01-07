import z from 'zod';
import { UserRole } from '../../domain/enums/user-role.enum';

const hasLowercase = z
  .string()
  .refine(
    (value) => value.toLowerCase() === value,
    'Password must contain at least one lowercase letter',
  );
const hasUppercase = z
  .string()
  .refine(
    (value) => value.toUpperCase() === value,
    'Password must contain at least one uppercase letter',
  );
const hasNumber = z
  .string()
  .refine(
    (value) => /\d/.test(value),
    'Password must contain at least one number',
  );
const hasSpecialChar = z
  .string()
  .refine(
    (value) => /[!@#$%^&*]/.test(value),
    'Password must contain at least one special character',
  );

export const CreateUserSchema = z.object({
  email: z.email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .and(hasLowercase)
    .and(hasUppercase)
    .and(hasNumber)
    .and(hasSpecialChar),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: z.enum(UserRole).default(UserRole.STUDENT),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
