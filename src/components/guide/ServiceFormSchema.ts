
import { z } from 'zod';

export const serviceFormSchema = z.object({
  guide_id: z.string().optional(),
  serviceName: z.string().min(1, "Service name is required"),
  serviceDescription: z.string().min(10, "Description must be at least 10 characters"),
  serviceDetails: z.string().min(10, "Service details must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  duration: z.string().min(1, "Duration is required"),
  images: z.array(z.instanceof(File)).optional()
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
