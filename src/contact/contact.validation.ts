import { z, ZodType } from 'zod';

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(4).max(50),
    last_name: z.string().min(4).max(50).optional(),
    email: z.string().min(4).max(50).email().optional(),
    phone: z.string().min(4).max(20).optional(),
  });
}
