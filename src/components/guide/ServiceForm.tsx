
import React from 'react';
import ServiceFormFields from './ServiceFormFields';
import ServiceFormActions from './ServiceFormActions';
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

interface ServiceFormProps {
  formData: Omit<Service, 'service_id'>;
  editingId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLanguagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formData: ServiceFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
  defaultValues?: Service;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  formData,
  editingId,
  onInputChange,
  onLanguagesChange,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert formData to ServiceFormValues type
    const serviceData: ServiceFormValues = {
      guide_id: formData.guide_id,
      guide_name: formData.guide_name,
      services: formData.services,
      location: formData.location,
      years_of_experience: formData.years_of_experience,
      bio: formData.bio,
      languages: formData.languages,
      certifications: formData.certifications
    };
    onSubmit(serviceData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg">
      <h3 className="text-xl font-medium mb-4">
        {editingId ? 'Edit Service' : 'Add New Service'}
      </h3>
      
      <ServiceFormFields 
        formData={formData}
        onInputChange={onInputChange}
        onLanguagesChange={onLanguagesChange}
      />
      
      <ServiceFormActions 
        isEditing={!!editingId || isEditing}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ServiceForm;
