
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { serviceFormSchema, ServiceFormValues } from './ServiceFormSchema';
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
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      guide_id: defaultValues?.guide_id || '',
      guide_name: defaultValues?.guide_name || '',
      services: defaultValues?.services || '',
      location: defaultValues?.location || '',
      years_of_experience: defaultValues?.years_of_experience || '',
      bio: defaultValues?.bio || '',
      languages: defaultValues?.languages || [],
      certifications: defaultValues?.certifications || ''
    }
  });

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languagesArray = e.target.value.split(',').map(lang => lang.trim());
    form.setValue('languages', languagesArray);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-xl font-medium mb-4">
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="guide_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guide Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Services Offered</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="years_of_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <Label htmlFor="languages">Languages (comma separated)</Label>
            <Input
              id="languages"
              value={form.getValues('languages').join(', ')}
              onChange={handleLanguagesChange}
            />
            {form.formState.errors.languages && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.languages.message}</p>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32" />
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
