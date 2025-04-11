
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceForm from '@/components/guide/ServiceForm';
import ServiceList from '@/components/guide/ServiceList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ServiceFormValues } from './ServiceFormSchema';

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

interface ServiceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  services: Service[];
  loading: boolean;
  formData: Omit<Service, 'service_id'>;
  editingId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLanguagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formData: ServiceFormValues) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({
  activeTab,
  setActiveTab,
  services,
  loading,
  formData,
  editingId,
  onInputChange,
  onLanguagesChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel
}) => {
  const handleValueChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleValueChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="add" disabled={activeTab === "edit"}>Add New</TabsTrigger>
        {activeTab === "edit" && (
          <TabsTrigger value="edit">Edit Service</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="services">
        <ServicesTabContent 
          services={services} 
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddNew={() => setActiveTab("add")}
        />
      </TabsContent>
      
      <TabsContent value="add">
        <ServiceForm 
          formData={formData}
          editingId={null}
          onInputChange={onInputChange}
          onLanguagesChange={onLanguagesChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </TabsContent>
      
      <TabsContent value="edit">
        {editingId && (
          <ServiceForm 
            formData={formData}
            editingId={editingId}
            onInputChange={onInputChange}
            onLanguagesChange={onLanguagesChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isEditing={true}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

// Extract the services tab content into its own component
const ServicesTabContent: React.FC<{
  services: Service[];
  loading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}> = ({ services, loading, onEdit, onDelete, onAddNew }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">No services added yet.</p>
        <Button onClick={onAddNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Your First Service
        </Button>
      </div>
    );
  }
  
  return (
    <ServiceList 
      services={services}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ServiceTabs;
