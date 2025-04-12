
import { useState } from 'react';
import { useGuideAssistant } from '@/hooks/useGuideAssistant';
import { toast } from 'sonner';

export interface ChatMessage {
  content: string;
  isAI: boolean;
  timestamp: Date;
}

export function useGuideChat() {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    content: "Hi there! I'm your Guide Recommendation AI assistant. I'll help you create activities that align with our sustainability standards. Let's start by discussing your activity idea. What would you like to add?",
    isAI: true,
    timestamp: new Date()
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetStandards, setMeetStandards] = useState(false);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [activityData, setActivityData] = useState<any>(null);
  
  const { sendMessage, saveActivity } = useGuideAssistant();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, {
      content: message,
      isAI: false,
      timestamp: new Date()
    }]);

    setIsSubmitting(true);
    
    try {
      // Send message to assistant
      const response = await sendMessage(message);
      
      setMessages(prev => [...prev, {
        content: response.text || "I'm processing your request.",
        isAI: true,
        timestamp: new Date()
      }]);

      // If the AI has extracted structured data, enable submit option
      if (response.activityData) {
        setActivityData(response.activityData);
        setIsReadyToSubmit(true);

        // Add a message suggesting submission
        setMessages(prev => [...prev, {
          content: "I've gathered enough information to create this activity. Please confirm it meets our standards for reducing over-tourism and ecosystem degradation, then click Submit.",
          isAI: true,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsSubmitting(false);
      setMessage('');
    }
  };

  const handleSubmit = async () => {
    if (!meetStandards) {
      toast.error('Please confirm that this activity meets our standards before submitting.');
      return;
    }

    if (!activityData) {
      toast.error('No activity data available to submit.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add images to the activity data
      const activityWithImages = {
        ...activityData,
        images: images
      };
      
      // Save to database
      await saveActivity(activityWithImages);
      
      toast.success('Activity successfully submitted!');
      
      // Reset the form
      setMessages([{
        content: "Great job! Your activity has been submitted successfully. Would you like to add another activity?",
        isAI: true,
        timestamp: new Date()
      }]);
      setImages([]);
      setMeetStandards(false);
      setIsReadyToSubmit(false);
      setActivityData(null);
    } catch (error) {
      console.error('Error submitting activity:', error);
      toast.error('Failed to submit activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return {
    message,
    setMessage,
    images,
    setImages,
    messages,
    isSubmitting,
    meetStandards,
    setMeetStandards,
    isReadyToSubmit,
    handleSendMessage,
    handleSubmit,
    removeImage
  };
}
