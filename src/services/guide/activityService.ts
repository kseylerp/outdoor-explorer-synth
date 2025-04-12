
import { supabase } from '@/integrations/supabase/client';

// Upload images for an activity
export const uploadActivityImages = async (images: File[]): Promise<string[]> => {
  const imageUrls: string[] = [];
  
  for (const image of images) {
    try {
      const filename = `${Date.now()}-${image.name}`;
      const path = `activity-images/${filename}`;
      
      const { data, error } = await supabase.storage
        .from('activities')
        .upload(path, image);
      
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }
      
      const { data: urlData } = supabase.storage
        .from('activities')
        .getPublicUrl(path);
      
      if (urlData && urlData.publicUrl) {
        imageUrls.push(urlData.publicUrl);
      }
    } catch (err) {
      console.error('Error processing image:', err);
    }
  }
  
  return imageUrls;
};

// Save activity to the database
export const saveActivity = async (activityData: any, images: File[]) => {
  try {
    // Process images if any
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      imageUrls = await uploadActivityImages(images);
    }
    
    // Prepare activity data
    const activity = {
      title: activityData.title || '',
      description: activityData.description || '',
      price: activityData.price || '',
      duration: activityData.duration || '',
      danger_level: activityData.dangerLevel || 'low',
      permit_required: activityData.permitRequired || false,
      permit_details: activityData.permitDetails || '',
      guide_id: activityData.guideId || '00000000-0000-0000-0000-000000000000', // Default guide ID
      company_recommendations: JSON.stringify(activityData.recommendations || []),
      target_audience: activityData.targetAudience || '',
      image_urls: imageUrls
    };
    
    // Insert into the activities table
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (err: any) {
    console.error('Error saving activity:', err);
    throw err;
  }
};
