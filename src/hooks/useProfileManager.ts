
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GuideProfile {
  guide_id?: string;
  guide_name: string;
  bio: string;
  location: string;
  years_of_experience: string;
  languages: string[];
  certifications?: string;
  guide_photo_url?: string;
}

export const useProfileManager = () => {
  const [profile, setProfile] = useState<GuideProfile>({
    guide_name: '',
    bio: '',
    location: '',
    years_of_experience: '',
    languages: [],
    certifications: '',
    guide_photo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // In a real app, you would filter by the current user's ID
      const { data, error } = await supabase
        .from('guide_services')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          guide_id: data.guide_id,
          guide_name: data.guide_name,
          bio: data.bio,
          location: data.location,
          years_of_experience: data.years_of_experience,
          languages: data.languages,
          certifications: data.certifications,
          guide_photo_url: data.guide_photo_url
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languagesArray = e.target.value.split(',').map(lang => lang.trim());
    setProfile({ ...profile, languages: languagesArray });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // In a real implementation, you would upload the photo to storage
      // and then update the profile with the photo URL
      let photoUrl = profile.guide_photo_url;
      
      if (photoFile) {
        // This is a placeholder for actual file upload logic
        // In a real app, you'd upload to Supabase Storage
        photoUrl = URL.createObjectURL(photoFile);
      }
      
      const updateData = {
        ...profile,
        guide_photo_url: photoUrl
      };
      
      // For this demo, we'll just log the data that would be saved
      console.log('Saving profile:', updateData);
      
      // Simulate a successful update
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    photoPreview,
    handleInputChange,
    handleLanguagesChange,
    handlePhotoChange,
    handleSubmit
  };
};
