
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import ServiceForm from '@/components/guide/ServiceForm';
import ServiceCard from '@/components/guide/ServiceCard';
import { ServiceFormValues } from '@/components/guide/ServiceFormSchema';

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

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<string>("services");

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

  const handleAddService = async (formData: ServiceFormValues) => {
    try {
      // Ensure all required fields are present with proper types
      const serviceData = {
        guide_id: formData.guide_id || `guide_${Date.now()}`,
        guide_name: formData.guide_name || '',
        services: formData.services || '',
        location: formData.location || '',
        years_of_experience: formData.years_of_experience || '',
        bio: formData.bio || '',
        languages: formData.languages || [],
        certifications: formData.certifications || ''
      };
      
      const { data, error } = await supabase
        .from('guide_services')
        .insert([serviceData])
        .select();

      if (error) throw error;
      
      setServices([...services, ...(data as Service[])]);
      
      toast({
        title: 'Success',
        description: 'New service added successfully',
      });
      
      setActiveTab("services");
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateService = async (formData: ServiceFormValues) => {
    if (!editingService) return;
    
    try {
      // Ensure all required fields are present with proper types
      const serviceData = {
        guide_id: formData.guide_id || editingService.guide_id,
        guide_name: formData.guide_name || '',
        services: formData.services || '',
        location: formData.location || '',
        years_of_experience: formData.years_of_experience || '',
        bio: formData.bio || '',
        languages: formData.languages || [],
        certifications: formData.certifications || ''
      };
      
      const { error } = await supabase
        .from('guide_services')
        .update(serviceData)
        .eq('service_id', editingService.service_id);

      if (error) throw error;
      
      setServices(services.map(service => 
        service.service_id === editingService.service_id ? { ...service, ...serviceData } : service
      ));
      
      toast({
        title: 'Success',
        description: 'Service updated successfully',
      });
      
      setEditingService(null);
      setActiveTab("services");
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Error',
        description: 'Failed to update service. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setActiveTab("edit");
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

  const handleCancel = () => {
    setEditingService(null);
    setActiveTab("services");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Guide Services</h1>
        {activeTab === "services" && (
          <Button 
            onClick={() => setActiveTab("add")}
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="add" disabled={activeTab === "edit"}>Add New</TabsTrigger>
          {activeTab === "edit" && (
            <TabsTrigger value="edit">Edit Service</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="services">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No services added yet.</p>
              <Button 
                onClick={() => setActiveTab("add")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {services.map(service => (
                <ServiceCard 
                  key={service.service_id}
                  service={service}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <ServiceForm 
            onSubmit={handleAddService}
            onCancel={handleCancel}
          />
        </TabsContent>
        
        <TabsContent value="edit">
          {editingService && (
            <ServiceForm 
              defaultValues={editingService}
              onSubmit={handleUpdateService}
              onCancel={handleCancel}
              isEditing
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Services;
