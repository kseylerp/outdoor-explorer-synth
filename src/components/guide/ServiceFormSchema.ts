
import { z } from 'zod';

export const serviceFormSchema = z.object({
  guide_id: z.string().optional(),
  serviceName: z.string().min(1, "Service name is required"),
  serviceDescription: z.string().min(10, "Description must be at least 10 characters"),
  serviceDetails: z.string().min(10, "Service details must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  duration: z.string().min(1, "Duration is required"),
  images: z.array(z.instanceof(File)).optional(),
  // Add guide profile fields that will come from the profile but are needed when saving to database
  guide_name: z.string().optional(),
  services: z.string().optional(),
  location: z.string().optional(),
  years_of_experience: z.string().optional(),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),
  certifications: z.string().optional()
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
