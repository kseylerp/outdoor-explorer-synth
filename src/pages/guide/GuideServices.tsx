
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
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

const GuideServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'service_id'>>({
    guide_id: '', // This field is now included
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

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? 'Edit Service' : 'Add New Service'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guide_name">Guide Name</Label>
            <Input
              id="guide_name"
              name="guide_name"
              value={formData.guide_name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="services">Services Offered</Label>
            <Input
              id="services"
              name="services"
              value={formData.services}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="years_of_experience">Years of Experience</Label>
            <Input
              id="years_of_experience"
              name="years_of_experience"
              value={formData.years_of_experience}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="languages">Languages (comma separated)</Label>
            <Input
              id="languages"
              name="languages"
              value={formData.languages.join(', ')}
              onChange={handleLanguagesChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="certifications">Certifications</Label>
            <Input
              id="certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            required
            className="h-32"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {editingId ? 'Update Service' : 'Add Service'}
          </Button>
        </div>
      </form>
      
      <div>
        <h3 className="text-xl font-medium mb-4">Your Services</h3>
        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-muted-foreground">No services added yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {services.map(service => (
              <Card key={service.service_id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{service.guide_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Services:</strong> {service.services}</p>
                  <p><strong>Location:</strong> {service.location}</p>
                  <p><strong>Experience:</strong> {service.years_of_experience}</p>
                  <p><strong>Languages:</strong> {service.languages.join(', ')}</p>
                  {service.certifications && (
                    <p><strong>Certifications:</strong> {service.certifications}</p>
                  )}
                  <p><strong>Bio:</strong> {service.bio}</p>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(service.service_id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideServices;
