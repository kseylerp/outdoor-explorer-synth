
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  ExternalLink, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  company_name: string;
  website_url: string;
  activity_id: string;
}

interface Activity {
  activity_id: string;
  title: string;
  description: string;
  company_recommendations: string;
  target_audience: string;
  danger_level: string;
  permit_required: boolean;
  permit_details: string | null;
  price: string;
  duration: string;
  image_urls: string[] | null;
  recommendations?: Recommendation[];
  created_at: string;
}

const dangerLevelColors = {
  low: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  extreme: "bg-red-100 text-red-800"
};

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;
      
      // Fetch recommendations for each activity
      const activitiesWithRecommendations = await Promise.all(
        (activitiesData || []).map(async (activity) => {
          const { data: recommendations, error: recommendationsError } = await supabase
            .from('recommendations')
            .select('*')
            .eq('activity_id', activity.activity_id);
            
          if (recommendationsError) {
            console.error("Error fetching recommendations:", recommendationsError);
            return { ...activity, recommendations: [] };
          }
          
          return { ...activity, recommendations };
        })
      );
      
      setActivities(activitiesWithRecommendations);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (!deleteActivityId) return;
    
    try {
      // First delete related recommendations
      const { error: recError } = await supabase
        .from('recommendations')
        .delete()
        .eq('activity_id', deleteActivityId);
        
      if (recError) throw recError;
      
      // Then delete the activity
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('activity_id', deleteActivityId);
        
      if (error) throw error;
      
      setActivities(activities.filter(activity => activity.activity_id !== deleteActivityId));
      toast.success("Activity deleted successfully");
      setDeleteDialogOpen(false);
      setDeleteActivityId(null);
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  const openDeleteDialog = (activityId: string) => {
    setDeleteActivityId(activityId);
    setDeleteDialogOpen(true);
  };

  const viewActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setViewDialogOpen(true);
  };

  const formatDangerLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Guided Activities</h1>
        <Button asChild>
          <Link to="/guide-portal/add-activity">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Activity
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-40 bg-gray-200 rounded-t-lg" />
              <CardContent className="space-y-2 p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </CardContent>
              <CardFooter className="justify-end p-6 pt-0">
                <div className="h-10 bg-gray-200 rounded w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Activities Added Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by adding your first guided activity recommendation.
          </p>
          <Button asChild>
            <Link to="/guide-portal/add-activity">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Activity
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card key={activity.activity_id} className="overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-200 relative">
                {activity.image_urls && activity.image_urls.length > 0 ? (
                  <img 
                    src={activity.image_urls[0]} 
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
                <Badge 
                  className={`absolute top-3 right-3 ${
                    dangerLevelColors[activity.danger_level as keyof typeof dangerLevelColors]
                  }`}
                >
                  {formatDangerLevel(activity.danger_level)}
                </Badge>
              </div>
              <CardContent className="flex-1 p-6">
                <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline">{activity.price}</Badge>
                  <Badge variant="outline">{activity.duration}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {activity.description}
                </p>
                {activity.recommendations && activity.recommendations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Recommended Companies:</p>
                    <ul className="space-y-1">
                      {activity.recommendations.slice(0, 2).map((rec) => (
                        <li key={rec.id} className="text-sm flex items-center">
                          <span className="truncate">{rec.company_name}</span>
                        </li>
                      ))}
                      {activity.recommendations.length > 2 && (
                        <li className="text-sm text-muted-foreground">
                          +{activity.recommendations.length - 2} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-6 pt-2 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => viewActivityDetails(activity)}
                >
                  View Details
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link to={`/guide-portal/edit-activity/${activity.activity_id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => openDeleteDialog(activity.activity_id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Activity Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedActivity && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedActivity.title}</DialogTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{selectedActivity.price}</Badge>
                  <Badge variant="outline">{selectedActivity.duration}</Badge>
                  <Badge 
                    className={
                      dangerLevelColors[selectedActivity.danger_level as keyof typeof dangerLevelColors]
                    }
                  >
                    {formatDangerLevel(selectedActivity.danger_level)} Risk
                  </Badge>
                </div>
              </DialogHeader>
              
              {selectedActivity.image_urls && selectedActivity.image_urls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  {selectedActivity.image_urls.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`${selectedActivity.title} ${index + 1}`}
                      className="rounded-md object-cover h-60 w-full"
                    />
                  ))}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p>{selectedActivity.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Guide Recommendation</h3>
                  <p>{selectedActivity.company_recommendations}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
                  <p>{selectedActivity.target_audience}</p>
                </div>
                
                {selectedActivity.permit_required && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Permit Information</h3>
                    <p>{selectedActivity.permit_details}</p>
                  </div>
                )}
                
                {selectedActivity.recommendations && selectedActivity.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recommended Companies</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      {selectedActivity.recommendations.map((rec) => (
                        <Card key={rec.id}>
                          <CardContent className="p-4">
                            <h4 className="font-medium">{rec.company_name}</h4>
                            <a 
                              href={rec.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center mt-1 text-sm"
                            >
                              {rec.website_url}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0 mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button asChild>
                  <Link to={`/guide-portal/edit-activity/${selectedActivity.activity_id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Activity
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteActivity}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;
