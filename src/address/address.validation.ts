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
  static readonly GET: ZodType = z.object({
    contact_id: z.string(),
    address_id: z.string(),
  });
  static readonly UPDATE: ZodType = z.object({
    id: z.string(),
    contact_id: z.string(),
    street: z.string().min(4).max(50).optional(),
    city: z.string().min(4).max(50).optional(),
    province: z.string().min(4).max(50).optional(),
    country: z.string().min(4).max(50),
    postal_code: z.string().min(4).max(10),
  });
}
