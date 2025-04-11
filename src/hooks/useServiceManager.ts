
import { useServiceFormState } from './useServiceFormState';
import { useServiceCrud } from './useServiceCrud';
import { ServiceFormValues } from '@/components/guide/ServiceFormSchema';
import { useState } from 'react';

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

  // Track submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ServiceFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert ServiceFormValues to required format
      const serviceData = prepareServiceDataForSubmission(formData);

      // Determine if we're updating or creating
      let success = false;
      if (editingId) {
        success = await updateService(editingId, serviceData);
      } else {
        success = await createService(serviceData);
      }
      
      // Reset form if successful
      if (success) resetForm();
      
      return success;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: any) => {
    setFormForEditing(service);
  };

  const handleDelete = (id: string) => {
    deleteService(id);
  };

  return {
    // Service data
    services,
    loading,
    isSubmitting,
    
    // Form state
    editingId,
    formData,
    
    // Form handlers
    handleInputChange,
    handleLanguagesChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  };
};

// Helper function to prepare service data for submission
const prepareServiceDataForSubmission = (formData: ServiceFormValues) => {
  return {
    guide_id: formData.guide_id || 'default-guide-id', 
    guide_name: formData.guide_name || '',
    services: formData.services || '',
    location: formData.location || '',
    years_of_experience: formData.years_of_experience || '',
    bio: formData.bio || '',
    languages: formData.languages || [],
    certifications: formData.certifications
  };
};
