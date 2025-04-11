
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

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

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden">
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
          onClick={() => onEdit(service)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(service.service_id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
