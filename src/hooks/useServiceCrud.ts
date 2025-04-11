
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Service {
  service_id: string;
  guide_id: string;
  guide_name: string;
  services: string;
  location: string;
  years_of_experience: string;
  bio: string;
  languages: string[];
  certifications?: string;
}

export const useServiceCrud = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guide_services')
        .select('*');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load services. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createService = async (formData: Omit<Service, 'service_id'>) => {
    try {
      // Generate a temporary guide_id if one isn't set
      if (!formData.guide_id) {
        formData.guide_id = `guide_${Date.now()}`;
      }
      
      const { data, error } = await supabase
        .from('guide_services')
        .insert([formData])
        .select();

      if (error) throw error;
      
      setServices([...services, ...(data as Service[])]);
      
      toast({
        title: 'Success',
        description: 'New service added successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateService = async (serviceId: string, formData: Omit<Service, 'service_id'>) => {
    try {
      const { error } = await supabase
        .from('guide_services')
        .update(formData)
        .eq('service_id', serviceId);

      if (error) throw error;
      
      setServices(services.map(service => 
        service.service_id === serviceId ? { ...service, ...formData } : service
      ));
      
      toast({
        title: 'Success',
        description: 'Service updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Error',
        description: 'Failed to update service. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guide_services')
        .delete()
        .eq('service_id', id);

      if (error) throw error;
      
      setServices(services.filter(service => service.service_id !== id));
      
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService
  };
};
