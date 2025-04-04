
import React from 'react';
import ServiceFormFields from './ServiceFormFields';
import ServiceFormActions from './ServiceFormActions';

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
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  formData,
  editingId,
  onInputChange,
  onLanguagesChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 border p-6 rounded-lg">
      <h3 className="text-xl font-medium mb-4">
        {editingId ? 'Edit Service' : 'Add New Service'}
      </h3>
      
      <ServiceFormFields 
        formData={formData}
        onInputChange={onInputChange}
        onLanguagesChange={onLanguagesChange}
      />
      
      <ServiceFormActions 
        isEditing={!!editingId}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ServiceForm;
