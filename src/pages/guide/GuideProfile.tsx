
import React from 'react';
import ProfileForm from '@/components/guide/ProfileForm';
import { useProfileManager } from '@/hooks/useProfileManager';

const GuideProfile = () => {
  const {
    profile,
    loading,
    saving,
    photoPreview,
    handleInputChange,
    handleLanguagesChange,
    handlePhotoChange,
    handleSubmit
  } = useProfileManager();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <ProfileForm
      profile={profile}
      photoPreview={photoPreview}
      saving={saving}
      handleInputChange={handleInputChange}
      handleLanguagesChange={handleLanguagesChange}
      handlePhotoChange={handlePhotoChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default GuideProfile;
