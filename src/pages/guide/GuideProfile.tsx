
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const GuideProfile = () => {
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

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
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
            </div>
          </div>
          
          <div className="mt-6">
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

export default GuideProfile;
