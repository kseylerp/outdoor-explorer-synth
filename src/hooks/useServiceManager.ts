
import { useServiceFormState } from './useServiceFormState';
import { useServiceCrud } from './useServiceCrud';
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

export const useServiceManager = () => {
  const {
    editingId,
    formData,
    handleInputChange,
    handleLanguagesChange,
    resetForm,
    setFormForEditing
  } = useServiceFormState();

  const {
    services,
    loading,
    createService,
    updateService,
    deleteService
  } = useServiceCrud();

  const handleSubmit = async (formData: ServiceFormValues) => {
    // Convert ServiceFormValues to Omit<Service, "service_id">
    const serviceData: Omit<Service, "service_id"> = {
      guide_id: formData.guide_id || 'default-guide-id', // Provide default value for required field
      guide_name: formData.guide_name || '',
      services: formData.services || '',
      location: formData.location || '',
      years_of_experience: formData.years_of_experience || '',
      bio: formData.bio || '',
      languages: formData.languages || [],
      certifications: formData.certifications
    };

    if (editingId) {
      const success = await updateService(editingId, serviceData);
      if (success) resetForm();
    } else {
      const success = await createService(serviceData);
      if (success) resetForm();
    }
  };

  const handleEdit = (service: any) => {
    setFormForEditing(service);
  };

  const handleDelete = (id: string) => {
    deleteService(id);
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
