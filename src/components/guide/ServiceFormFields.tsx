
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onInputChange}
          required
          className="h-32"
        />
      </div>
    </>
  );
};

export default ServiceFormFields;
