
import { z } from 'zod';

export const serviceFormSchema = z.object({
  guide_id: z.string().optional(),
  guide_name: z.string().min(1, "Guide name is required"),
  services: z.string().min(1, "Services are required"),
  location: z.string().min(1, "Location is required"),
  years_of_experience: z.string().min(1, "Years of experience is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  certifications: z.string().optional()
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
