
import { useServiceFormState } from './useServiceFormState';
import { useServiceCrud } from './useServiceCrud';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const success = await updateService(editingId, formData);
      if (success) resetForm();
    } else {
      const success = await createService(formData);
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
