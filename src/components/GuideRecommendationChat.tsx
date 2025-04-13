
import React, { useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useGuideChat } from '@/hooks/useGuideChat';
import ChatMessageList from './guide/ChatMessageList';
import ImageGallery from './guide/ImageGallery';
import ActivitySubmitSection from './guide/ActivitySubmitSection';
import ChatInputSection from './guide/ChatInputSection';

const GuideRecommendationChat: React.FC = () => {
  const {
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
  } = useGuideChat();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Notify the user that images were added
      toast(`${newFiles.length} image(s) added. They'll be included when you submit the activity.`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatMessageList messages={messages} />

      <ImageGallery images={images} removeImage={removeImage} />

      <ActivitySubmitSection 
        isReadyToSubmit={isReadyToSubmit}
        meetStandards={meetStandards}
        setMeetStandards={setMeetStandards}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
        />
        <ChatInputSection 
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          onImageUpload={handleImageUpload}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default GuideRecommendationChat;
