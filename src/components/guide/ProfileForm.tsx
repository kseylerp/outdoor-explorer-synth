
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProfilePhotoSection from './ProfilePhotoSection';
import ProfileDetailsSection from './ProfileDetailsSection';

interface ProfileFormProps {
  profile: any;
  photoPreview: string | null;
  saving: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleLanguagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  photoPreview,
  saving,
  handleInputChange,
  handleLanguagesChange,
  handlePhotoChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <ProfilePhotoSection 
              profile={profile} 
              photoPreview={photoPreview} 
              handlePhotoChange={handlePhotoChange} 
            />
            
            <ProfileDetailsSection 
              profile={profile}
              handleInputChange={handleInputChange}
              handleLanguagesChange={handleLanguagesChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
