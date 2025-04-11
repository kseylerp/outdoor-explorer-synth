
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Recommendation {
  id: string;
  company_name: string;
  website_url: string;
  activity_id?: string;
}

const GuideRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRecommendation, setNewRecommendation] = useState({
    company_name: '',
    website_url: ''
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recommendations')
        .select('*');

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecommendation = async () => {
    try {
      if (!newRecommendation.company_name || !newRecommendation.website_url) {
        return;
      }

      const { data, error } = await supabase
        .from('recommendations')
        .insert([newRecommendation])
        .select();

      if (error) throw error;
      
      setRecommendations([...recommendations, ...(data as Recommendation[])]);
      setNewRecommendation({ company_name: '', website_url: '' });
    } catch (error) {
      console.error('Error adding recommendation:', error);
    }
  };

  const handleDeleteRecommendation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRecommendations(recommendations.filter(rec => rec.id !== id));
    } catch (error) {
      console.error('Error deleting recommendation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Add New Recommendation</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input 
                id="company_name"
                placeholder="Enter company name" 
                value={newRecommendation.company_name}
                onChange={(e) => setNewRecommendation({...newRecommendation, company_name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input 
                id="website_url"
                placeholder="https://example.com" 
                value={newRecommendation.website_url}
                onChange={(e) => setNewRecommendation({...newRecommendation, website_url: e.target.value})}
              />
            </div>
            
            <Button 
              onClick={handleAddRecommendation}
              disabled={!newRecommendation.company_name || !newRecommendation.website_url}
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Recommendation
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Your Recommendations</h3>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <p className="text-muted-foreground">No recommendations added yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <Card key={rec.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{rec.company_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={rec.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {rec.website_url}
                    </a>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteRecommendation(rec.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideRecommendations;
