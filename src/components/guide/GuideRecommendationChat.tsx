
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useGuideAssistant } from '@/hooks/useGuideAssistant';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface ChatMessage {
  content: string;
  isAI: boolean;
  timestamp: Date;
}

const GuideRecommendationChat: React.FC = () => {
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Notify the user that images were added
      toast.success(`${newFiles.length} image(s) added. They'll be included when you submit the activity.`);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 ${msg.isAI ? 'mr-12' : 'ml-12'}`}
          >
            <Card 
              className={`p-3 ${msg.isAI 
                ? 'bg-white dark:bg-gray-800 border-gray-200' 
                : 'bg-primary text-primary-foreground'}`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </Card>
            <div className={`text-xs mt-1 text-gray-500 ${msg.isAI ? 'text-left' : 'text-right'}`}>
              {msg.isAI ? 'Guide AI' : 'You'} • {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {images.length > 0 && (
        <div className="mb-4">
          <p className="text-sm mb-2 font-medium">Uploaded Images ({images.length})</p>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt={`Uploaded ${index}`} 
                  className="h-16 w-16 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isReadyToSubmit && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="standards" 
              checked={meetStandards}
              onCheckedChange={(checked) => setMeetStandards(checked as boolean)}
            />
            <Label htmlFor="standards" className="text-sm">
              This activity meets our standards for reducing over-tourism and ecosystem degradation
            </Label>
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!meetStandards || isSubmitting}
          >
            Submit Activity
          </Button>
        </div>
      )}

      <div className="relative">
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="pr-24 resize-none"
          rows={3}
          disabled={isSubmitting}
        />
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleImageUpload}
            className="h-8 w-8"
            disabled={isSubmitting}
          >
            <Paperclip size={18} />
          </Button>
          <Button
            type="button"
            size="icon"
            onClick={handleSendMessage}
            className="h-8 w-8"
            disabled={isSubmitting || !message.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuideRecommendationChat;
