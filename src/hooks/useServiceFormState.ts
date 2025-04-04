
import { useState } from 'react';

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

export const useServiceFormState = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'service_id'>>({
    guide_id: '',
    guide_name: '',
    services: '',
    location: '',
    years_of_experience: '',
    bio: '',
    languages: [],
    certifications: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languagesArray = e.target.value.split(',').map(lang => lang.trim());
    setFormData({ ...formData, languages: languagesArray });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      guide_id: '',
      guide_name: '',
      services: '',
      location: '',
      years_of_experience: '',
      bio: '',
      languages: [],
      certifications: ''
    });
  };

  const setFormForEditing = (service: Service) => {
    setEditingId(service.service_id);
    setFormData({
      guide_id: service.guide_id,
      guide_name: service.guide_name,
      services: service.services,
      location: service.location,
      years_of_experience: service.years_of_experience,
      bio: service.bio,
      languages: service.languages,
      certifications: service.certifications || ''
    });
  };

  return {
    editingId,
    formData,
    handleInputChange,
    handleLanguagesChange,
    resetForm,
    setFormForEditing
  };
};
