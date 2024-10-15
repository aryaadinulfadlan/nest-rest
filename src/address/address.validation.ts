import { z, ZodType } from 'zod';

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    contact_id: z.string(),
    street: z.string().min(4).max(50).optional(),
    city: z.string().min(4).max(50).optional(),
    province: z.string().min(4).max(50).optional(),
    country: z.string().min(4).max(50),
    postal_code: z.string().min(4).max(10),
  });
}
