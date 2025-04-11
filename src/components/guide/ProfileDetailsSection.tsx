
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProfileDetailsSectionProps {
  profile: {
    guide_name: string;
    location: string;
    years_of_experience: string;
    languages: string[];
    certifications?: string;
    bio: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleLanguagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileDetailsSection: React.FC<ProfileDetailsSectionProps> = ({ 
  profile, 
  handleInputChange, 
  handleLanguagesChange 
}) => {
  return (
    <div className="flex-1 space-y-4">
      <div>
        <Label htmlFor="guide_name">Name</Label>
        <Input
          id="guide_name"
          name="guide_name"
          value={profile.guide_name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={profile.location}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="years_of_experience">Years of Experience</Label>
        <Input
          id="years_of_experience"
          name="years_of_experience"
          value={profile.years_of_experience}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="languages">Languages (comma separated)</Label>
        <Input
          id="languages"
          name="languages"
          value={profile.languages?.join(', ') || ''}
          onChange={handleLanguagesChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="certifications">Certifications</Label>
        <Input
          id="certifications"
          name="certifications"
          value={profile.certifications || ''}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={profile.bio}
          onChange={handleInputChange}
          required
          className="h-32"
        />
      </div>
    </div>
  );
};

export default ProfileDetailsSection;
