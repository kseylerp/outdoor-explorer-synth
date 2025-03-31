
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    whyWeChoseThis: '',
    duration: '',
    priceEstimate: '',
    difficultyLevel: '',
    maxCapacity: '',
    includedItems: '',
    requiredGear: '',
    meetingPoint: '',
    cancellationPolicy: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['title', 'location', 'description', 'duration', 'priceEstimate', 'difficultyLevel'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the data to your backend
    console.log('Submitting trip:', formData);
    
    // Show success message
    toast({
      title: "Trip created",
      description: "Your new trip has been saved as a draft."
    });
    
    // Navigate to the trip management page
    navigate('/guide/trips');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">Create New Trip</h1>
        <p className="text-muted-foreground">Design a new guided adventure</p>
      </header>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Trip Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="e.g., Mount Rainier Summit Climb" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  placeholder="e.g., Mount Rainier National Park, WA" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Provide a detailed description of the trip" 
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whyWeChoseThis">Why We Chose This</Label>
              <Textarea 
                id="whyWeChoseThis" 
                name="whyWeChoseThis" 
                value={formData.whyWeChoseThis} 
                onChange={handleChange}
                placeholder="What makes this trip special?" 
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleChange}
                  placeholder="e.g., 3 days" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priceEstimate">Price per Person (USD) *</Label>
                <Input 
                  id="priceEstimate" 
                  name="priceEstimate" 
                  type="number" 
                  value={formData.priceEstimate} 
                  onChange={handleChange}
                  placeholder="e.g., 399" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('difficultyLevel', value)}
                  value={formData.difficultyLevel}
                >
                  <SelectTrigger id="difficultyLevel">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Challenging">Challenging</SelectItem>
                    <SelectItem value="Difficult">Difficult</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                <Input 
                  id="maxCapacity" 
                  name="maxCapacity" 
                  type="number" 
                  value={formData.maxCapacity} 
                  onChange={handleChange}
                  placeholder="e.g., 6" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meetingPoint">Meeting Point</Label>
                <Input 
                  id="meetingPoint" 
                  name="meetingPoint" 
                  value={formData.meetingPoint} 
                  onChange={handleChange}
                  placeholder="e.g., Visitor Center Parking Lot" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="includedItems">What's Included</Label>
              <Textarea 
                id="includedItems" 
                name="includedItems" 
                value={formData.includedItems} 
                onChange={handleChange}
                placeholder="List items included in the trip price" 
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requiredGear">Required Gear</Label>
              <Textarea 
                id="requiredGear" 
                name="requiredGear" 
                value={formData.requiredGear} 
                onChange={handleChange}
                placeholder="List gear that participants need to bring" 
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Textarea 
                id="cancellationPolicy" 
                name="cancellationPolicy" 
                value={formData.cancellationPolicy} 
                onChange={handleChange}
                placeholder="Describe your cancellation and refund policy" 
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/guide/trips')}>
            Cancel
          </Button>
          <Button type="submit">Save as Draft</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
