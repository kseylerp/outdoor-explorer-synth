
import React from 'react';
import ServiceCard from './ServiceCard';

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

interface ServiceListProps {
  services: Service[];
  loading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p>Loading services...</p>;
  }
  
  if (services.length === 0) {
    return <p className="text-muted-foreground">No services added yet.</p>;
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {services.map(service => (
        <ServiceCard 
          key={service.service_id} 
          service={service} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default ServiceList;
