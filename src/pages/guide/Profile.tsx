
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const GuideProfile: React.FC = () => {
  // In a real app, this would be fetched from your backend
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    email: 'alex@trailguides.com',
    phone: '(555) 123-4567',
    location: 'Seattle, WA',
    bio: 'Professional mountain guide with 10+ years of experience leading treks throughout the Pacific Northwest. Certified in Wilderness First Response and Alpine Rescue techniques.',
    specialties: 'Alpine climbing, wilderness navigation, winter camping',
    certifications: 'Wilderness First Responder (WFR), American Mountain Guide Association (AMGA) Single Pitch Instructor',
    languages: 'English, Spanish',
    yearsExperience: 10
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would send the update to your backend
    setProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your guide profile has been successfully updated."
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Guide Profile</h1>
          <p className="text-muted-foreground">Manage your professional information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500">
                {/* This would be the actual profile image */}
                <span className="text-5xl">AR</span>
              </div>
              <Button variant="outline" className="mt-2">Upload Photo</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                      />
                    ) : (
                      <p>{profile.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input 
                        id="location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                      />
                    ) : (
                      <p>{profile.location}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                      />
                    ) : (
                      <p>{profile.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  {isEditing ? (
                    <Input 
                      id="yearsExperience" 
                      name="yearsExperience" 
                      type="number" 
                      value={formData.yearsExperience.toString()} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <p>{profile.yearsExperience} years</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  {isEditing ? (
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange}
                      rows={4} 
                    />
                  ) : (
                    <p>{profile.bio}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties</Label>
                  {isEditing ? (
                    <Input 
                      id="specialties" 
                      name="specialties" 
                      value={formData.specialties} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <p>{profile.specialties}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  {isEditing ? (
                    <Textarea 
                      id="certifications" 
                      name="certifications" 
                      value={formData.certifications} 
                      onChange={handleChange}
                      rows={2} 
                    />
                  ) : (
                    <p>{profile.certifications}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Languages</Label>
                  {isEditing ? (
                    <Input 
                      id="languages" 
                      name="languages" 
                      value={formData.languages} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <p>{profile.languages}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
