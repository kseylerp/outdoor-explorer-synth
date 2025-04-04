
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "@/components/form/ImageUploader";
import RecommendationsSection from "@/components/form/RecommendationsSection";
import { 
  activityFormSchema, 
  ActivityFormValues, 
  RecommendedCompany 
} from "@/components/form/ActivityFormSchema";
import { supabase } from "@/integrations/supabase/client";

const AddActivity = () => {
  const [images, setImages] = useState<File[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedCompany[]>([
    { companyName: "", websiteUrl: "" },
    { companyName: "", websiteUrl: "" },
    { companyName: "", websiteUrl: "" }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      guideRecommendation: "",
      targetAudience: "",
      dangerLevel: "low",
      permitRequired: false,
      permitDetails: "",
      price: "",
      duration: "",
      images: [],
      recommendations: [],
    },
  });

  const updateRecommendation = (index: number, field: keyof RecommendedCompany, value: string) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations[index] = {
      ...updatedRecommendations[index],
      [field]: value,
    };
    setRecommendations(updatedRecommendations);
  };

  const addRecommendation = () => {
    setRecommendations([...recommendations, { companyName: "", websiteUrl: "" }]);
  };

  const onSubmit = async (data: ActivityFormValues) => {
    try {
      setSubmitting(true);
      
      const validRecommendations = recommendations.filter(
        rec => rec.companyName.trim() !== "" && rec.websiteUrl.trim() !== ""
      );
      
      // For now, using a temporary guide_id
      const guide_id = crypto.randomUUID();
      
      // Upload images if any
      let image_urls: string[] = [];
      
      if (images.length > 0) {
        // In a real app, you'd implement proper image upload to storage
        // For now we'll just pretend this works
        image_urls = images.map(img => URL.createObjectURL(img));
      }
      
      // Insert activity
      const { data: activity, error } = await supabase
        .from('activities')
        .insert({
          title: data.title,
          description: data.description,
          company_recommendations: data.guideRecommendation,
          target_audience: data.targetAudience,
          danger_level: data.dangerLevel,
          permit_required: data.permitRequired,
          permit_details: data.permitDetails || null,
          price: data.price,
          duration: data.duration,
          guide_id: guide_id,
          image_urls: image_urls.length > 0 ? image_urls : null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add recommendations if any
      if (validRecommendations.length > 0) {
        const { error: recError } = await supabase
          .from('recommendations')
          .insert(
            validRecommendations.map(rec => ({
              company_name: rec.companyName,
              website_url: rec.websiteUrl,
              activity_id: activity.activity_id
            }))
          );
          
        if (recError) throw recError;
      }
      
      toast.success("Activity added successfully!");
      
      // Reset form
      form.reset();
      setImages([]);
      setRecommendations([
        { companyName: "", websiteUrl: "" },
        { companyName: "", websiteUrl: "" },
        { companyName: "", websiteUrl: "" }
      ]);
      
    } catch (error) {
      console.error("Error submitting activity:", error);
      toast.error("Failed to add activity. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUploader 
              images={images} 
              setImages={setImages} 
              setFormImages={(files) => form.setValue("images", files)}
              error={form.formState.errors.images?.message?.toString()}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Hiking Angel's Landing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $25 per person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 4-5 hours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a detailed description of the activity..." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guideRecommendation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why I Recommend This Activity</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share why you recommend this activity to travelers..." 
                      className="min-h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who Is This Good For?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the ideal audience for this activity..." 
                      className="min-h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dangerLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danger Level</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      <option value="low">Low - Safe for most travelers</option>
                      <option value="moderate">Moderate - Some physical ability required</option>
                      <option value="high">High - Experience recommended</option>
                      <option value="extreme">Extreme - For experienced adventurers only</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permitRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Permit Required</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check if this activity requires a special permit
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("permitRequired") && (
              <FormField
                control={form.control}
                name="permitDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permit Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide details about the permit requirements..." 
                        className="min-h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <RecommendationsSection 
              recommendations={recommendations} 
              updateRecommendation={updateRecommendation}
              addRecommendation={addRecommendation}
            />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Activity"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddActivity;
