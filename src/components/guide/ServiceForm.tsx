
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { serviceFormSchema, ServiceFormValues } from './ServiceFormSchema';
import { supabase } from '@/integrations/supabase/client';
import ImageUploader from '@/components/form/ImageUploader';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (data: ServiceFormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [guideProfile, setGuideProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      guide_id: defaultValues?.guide_id || '',
      serviceName: defaultValues?.serviceName || '',
      serviceDescription: defaultValues?.serviceDescription || '',
      serviceDetails: defaultValues?.serviceDetails || '',
      price: defaultValues?.price || '',
      duration: defaultValues?.duration || '',
      images: [],
    }
  });

  useEffect(() => {
    // Fetch guide profile when component mounts
    const fetchGuideProfile = async () => {
      try {
        setLoading(true);
        // In a real app, you would filter by the current user's ID
        const { data, error } = await supabase
          .from('guide_services')
          .select('guide_id, guide_name, location, years_of_experience, languages, certifications, bio')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setGuideProfile(data);
          // Pre-fill the guide_id field with the profile guide_id
          form.setValue('guide_id', data.guide_id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load guide profile. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGuideProfile();
  }, [form]);

  const handleSubmitWithProfile = (data: ServiceFormValues) => {
    // Combine the form data with guide profile data
    const formDataWithProfile = {
      ...data,
      guide_name: guideProfile?.guide_name,
      location: guideProfile?.location,
      years_of_experience: guideProfile?.years_of_experience,
      languages: guideProfile?.languages,
      certifications: guideProfile?.certifications,
      bio: guideProfile?.bio
    };
    
    onSubmit(formDataWithProfile);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading guide profile...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWithProfile)} className="space-y-4">
        <h3 className="text-xl font-medium mb-4">
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h3>
        
        {guideProfile && (
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <h4 className="font-medium mb-2">Guide Information (from profile)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Name:</span> {guideProfile.guide_name}</div>
              <div><span className="font-medium">Location:</span> {guideProfile.location}</div>
              <div><span className="font-medium">Experience:</span> {guideProfile.years_of_experience}</div>
              <div><span className="font-medium">Languages:</span> {guideProfile.languages?.join(', ')}</div>
              {guideProfile.certifications && (
                <div className="col-span-2"><span className="font-medium">Certifications:</span> {guideProfile.certifications}</div>
              )}
            </div>
          </div>
        )}
        
        <ImageUploader
          images={images}
          setImages={setImages}
          setFormImages={(files) => form.setValue("images", files)}
          error={form.formState.errors.images?.message?.toString()}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Hiking Tour, Kayaking Adventure" />
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
                    <Input {...field} placeholder="e.g., $100 per person" />
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
                    <Input {...field} placeholder="e.g., 3 hours, Full day" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="serviceDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32" placeholder="Describe your service in detail..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="serviceDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Details</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32" placeholder="Additional details like what to bring, meeting point, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? 'Update Service' : 'Add Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
