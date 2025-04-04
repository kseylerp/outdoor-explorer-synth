
import React from 'react';
import { useServiceManager } from '@/hooks/useServiceManager';
import ServiceForm from '@/components/guide/ServiceForm';
import ServiceList from '@/components/guide/ServiceList';

const GuideServices = () => {
  const {
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
  } = useServiceManager();

  return (
    <div className="space-y-8">
      <ServiceForm
        formData={formData}
        editingId={editingId}
        onInputChange={handleInputChange}
        onLanguagesChange={handleLanguagesChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />
      
      <div>
        <h3 className="text-xl font-medium mb-4">Your Services</h3>
        <ServiceList
          services={services}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default GuideServices;
