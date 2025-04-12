
import { supabase } from '@/integrations/supabase/client';
import { SessionResponse } from './types';

export class SessionManager {
  async createSession(
    instructions: string = "",
    voice: string = "sage"  // Default to "sage" voice
  ): Promise<SessionResponse> {
    try {
      console.log('Creating realtime session with voice:', voice);
      
      // Set up session with Supabase Edge Function - ensure we're using the correct URL
      const { data, error } = await supabase.functions.invoke('realtime-sessions', {
        body: {
          action: 'create_session',
          instructions: instructions || "You are an adventure guide that specializes in offbeat travel recommendations. Help users plan unique outdoor adventures with hiking trails, camping options, and other outdoor activities. First, engage in natural conversation to understand the user's request. After you understand their requirements, inform them you'll show them trip options on screen. Format your response after understanding as a JSON object with trip array containing trip objects with destination, activities, and description fields.",
          voice: voice || "sage"  // Ensure we're using "sage" voice
        }
      });
      
      if (error) {
        console.error('Error creating session:', error);
        throw new Error('Failed to create session: ' + error.message);
      }
      
      if (!data?.clientSecret) {
        throw new Error('Failed to get client secret from OpenAI');
      }
      
      console.log('Session created with ID:', data.sessionId);
      console.log('Using voice:', data.voice);
      
      return {
        sessionId: data.sessionId,
        clientSecret: data.clientSecret
      };
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }
  
  async connectToOpenAI(sdp: string, ephemeralToken: string): Promise<string> {
    try {
      const response = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
        method: "POST",
        body: sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp"
        },
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI WebRTC setup error: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error connecting to OpenAI:', error);
      throw error;
    }
  }
}
