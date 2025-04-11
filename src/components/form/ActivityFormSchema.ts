
import { z } from "zod";

export interface RecommendedCompany {
  companyName: string;
  websiteUrl: string;
}

export const activityFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Please provide a detailed description (at least 10 characters)"),
  guideRecommendation: z.string().min(10, "Please explain why you recommend this activity"),
  targetAudience: z.string().min(10, "Please describe who this activity is suitable for"),
  dangerLevel: z.enum(["low", "moderate", "high", "extreme"]),
  permitRequired: z.boolean(),
  permitDetails: z.string().optional(),
  price: z.string().min(1, "Price information is required"),
  duration: z.string().min(1, "Duration information is required"),
  images: z.array(z.instanceof(File)).optional(),
  recommendations: z.array(
    z.object({
      companyName: z.string(),
      websiteUrl: z.string().url("Please enter a valid URL").optional()
    })
  ).optional(),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;
