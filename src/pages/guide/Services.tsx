
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ServiceTabs from '@/components/guide/ServiceTabs';
import { useServiceManager } from '@/hooks/useServiceManager';

const Services: React.FC = () => {
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

  const [activeTab, setActiveTab] = useState<string>("services");

  const handleAddNew = () => {
    resetForm();
    setActiveTab("add");
  };

  const handleCancel = () => {
    resetForm();
    setActiveTab("services");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Guide Services</h1>
        {activeTab === "services" && (
          <Button 
            onClick={handleAddNew}
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        )}
      </div>

      <ServiceTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        services={services}
        loading={loading}
        formData={formData}
        editingId={editingId}
        onInputChange={handleInputChange}
        onLanguagesChange={handleLanguagesChange}
        onSubmit={handleSubmit}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default Services;
