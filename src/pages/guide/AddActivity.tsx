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

const AddActivity = () => {
  const [images, setImages] = useState<File[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedCompany[]>([
    { companyName: "", websiteUrl: "" },
    { companyName: "", websiteUrl: "" }
  ]);

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
      recommendations: []
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

  const onSubmit = (data: ActivityFormValues) => {
    const validRecommendations = recommendations.filter(
      rec => rec.companyName.trim() !== "" && rec.websiteUrl.trim() !== ""
    );
    
    const formData = {
      ...data,
      recommendations: validRecommendations
    };
    
    console.log("Activity form submitted:", formData);
    
    // Here you would normally send the data to your backend
    // For demo purposes, we'll just show a success toast
    toast.success("Activity added successfully!");
    
    // Reset form
    form.reset();
    setImages([]);
    setRecommendations([
      { companyName: "", websiteUrl: "" },
      { companyName: "", websiteUrl: "" }
    ]);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Activity Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Price" {...field} />
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
                        <Input placeholder="Duration" {...field} />
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
                        <select {...field} className="border rounded px-4 py-2 w-full">
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                          <option value="extreme">Extreme</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the activity"
                        className="resize-none"
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
                    <FormLabel>Guide Recommendation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Why do you recommend this activity?"
                        className="resize-none"
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
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Who is this activity suitable for?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permitRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Permit Required?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.getValues("permitRequired") && (
                <FormField
                  control={form.control}
                  name="permitDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permit Details</FormLabel>
                      <FormControl>
                        <Input placeholder="Permit Details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <ImageUploader
                images={images}
                setImages={setImages}
                setFormImages={(files) => form.setValue("images", files)}
                error={form.formState.errors.images?.message?.toString()}
              />

              <RecommendationsSection
                recommendations={recommendations}
                updateRecommendation={updateRecommendation}
                addRecommendation={addRecommendation}
              />

              <Button type="submit">Add Activity</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddActivity;
