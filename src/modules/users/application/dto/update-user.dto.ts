import z from 'zod';
import { UserRole } from '../../domain/enums/user-role.enum';

export const UpdateUserSchema = z.object({
  email: z.email('Invalid email format'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: z.enum(UserRole).default(UserRole.STUDENT),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
