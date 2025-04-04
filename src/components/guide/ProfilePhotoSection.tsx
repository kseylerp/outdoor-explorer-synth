
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfilePhotoSectionProps {
  profile: {
    guide_name: string;
    guide_photo_url?: string;
  };
  photoPreview: string | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({ 
  profile, 
  photoPreview, 
  handlePhotoChange 
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32">
        <AvatarImage src={photoPreview || profile.guide_photo_url} />
        <AvatarFallback>{profile.guide_name?.charAt(0) || 'G'}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center">
        <Label htmlFor="photo" className="cursor-pointer text-blue-500 hover:text-blue-700">
          Change Photo
        </Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoSection;
