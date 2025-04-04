
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

export const useServiceManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'service_id'>>({
    guide_id: '',
    guide_name: '',
    services: '',
    location: '',
    years_of_experience: '',
    bio: '',
    languages: [],
    certifications: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languagesArray = e.target.value.split(',').map(lang => lang.trim());
    setFormData({ ...formData, languages: languagesArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate a temporary guide_id if one isn't set
      if (!formData.guide_id) {
        // Using a UUID-like format for demo purposes
        formData.guide_id = `guide_${Date.now()}`;
      }
      
      if (editingId) {
        const { error } = await supabase
          .from('guide_services')
          .update(formData)
          .eq('service_id', editingId);

        if (error) throw error;
        
        setServices(services.map(service => 
          service.service_id === editingId ? { ...service, ...formData } : service
        ));
        
        toast({
          title: 'Success',
          description: 'Service updated successfully',
        });
      } else {
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
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.service_id);
    setFormData({
      guide_id: service.guide_id,
      guide_name: service.guide_name,
      services: service.services,
      location: service.location,
      years_of_experience: service.years_of_experience,
      bio: service.bio,
      languages: service.languages,
      certifications: service.certifications || ''
    });
  };

  const handleDelete = async (id: string) => {
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

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      guide_id: '',
      guide_name: '',
      services: '',
      location: '',
      years_of_experience: '',
      bio: '',
      languages: [],
      certifications: ''
    });
  };

  return {
    services,
    loading,
    editingId,
    formData,
    handleInputChange,
    handleLanguagesChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  };
};
