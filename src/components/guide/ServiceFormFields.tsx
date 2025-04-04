
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ServiceFormFieldsProps {
  formData: {
    guide_name: string;
    location: string;
    services: string;
    years_of_experience: string;
    languages: string[];
    certifications?: string;
    bio: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLanguagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({
  formData,
  onInputChange,
  onLanguagesChange
}) => {
  return (
    <>
      <BasicInfoSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <ServiceDetailSection 
        formData={formData} 
        onInputChange={onInputChange}
        onLanguagesChange={onLanguagesChange}
      />
      
      <BioSection 
        bio={formData.bio} 
        onInputChange={onInputChange}
      />
    </>
  );
};

// Basic guide info section
const BasicInfoSection: React.FC<{
  formData: Pick<ServiceFormFieldsProps['formData'], 'guide_name' | 'location'>;
  onInputChange: ServiceFormFieldsProps['onInputChange'];
}> = ({ formData, onInputChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <Label htmlFor="guide_name">Guide Name</Label>
      <Input
        id="guide_name"
        name="guide_name"
        value={formData.guide_name}
        onChange={onInputChange}
        required
      />
    </div>
    
    <div>
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        name="location"
        value={formData.location}
        onChange={onInputChange}
        required
      />
    </div>
  </div>
);

// Service details section
const ServiceDetailSection: React.FC<{
  formData: Pick<ServiceFormFieldsProps['formData'], 'services' | 'years_of_experience' | 'languages' | 'certifications'>;
  onInputChange: ServiceFormFieldsProps['onInputChange'];
  onLanguagesChange: ServiceFormFieldsProps['onLanguagesChange'];
}> = ({ formData, onInputChange, onLanguagesChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <Label htmlFor="services">Services Offered</Label>
      <Input
        id="services"
        name="services"
        value={formData.services}
        onChange={onInputChange}
        required
      />
    </div>
    
    <div>
      <Label htmlFor="years_of_experience">Years of Experience</Label>
      <Input
        id="years_of_experience"
        name="years_of_experience"
        value={formData.years_of_experience}
        onChange={onInputChange}
        required
      />
    </div>
    
    <div>
      <Label htmlFor="languages">Languages (comma separated)</Label>
      <Input
        id="languages"
        name="languages"
        value={formData.languages.join(', ')}
        onChange={onLanguagesChange}
        required
      />
    </div>
    
    <div>
      <Label htmlFor="certifications">Certifications</Label>
      <Input
        id="certifications"
        name="certifications"
        value={formData.certifications}
        onChange={onInputChange}
      />
    </div>
  </div>
);

// Bio section
const BioSection: React.FC<{
  bio: string;
  onInputChange: ServiceFormFieldsProps['onInputChange'];
}> = ({ bio, onInputChange }) => (
  <div>
    <Label htmlFor="bio">Bio</Label>
    <Textarea
      id="bio"
      name="bio"
      value={bio}
      onChange={onInputChange}
      required
      className="h-32"
    />
  </div>
);

export default ServiceFormFields;
