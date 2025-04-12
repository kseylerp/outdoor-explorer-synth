
import React, { useState, useEffect } from 'react';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { useTrips } from '@/hooks/useTrips';
import TriageResponseBubble from '@/components/prompt/TriageResponseBubble';

// Define conversation stages for our boolean conversation flow
type ConversationStage = 
  | 'welcome'
  | 'region'
  | 'timing'
  | 'timing_recommendation'
  | 'skill_level'
  | 'duration'
  | 'equipment'
  | 'group_size'
  | 'confirmation'
  | 'refinement';

const Index = () => {
  const {
    trips,
    loading,
    error,
    errorDetails,
    thinking,
    handlePromptSubmit,
    handleVoiceTripData,
    handleRetry,
    handleSaveTrip
  } = useTrips();
  
  // State for the conversation flow
  const [conversationStage, setConversationStage] = useState<ConversationStage>('welcome');
  const [triageMessages, setTriageMessages] = useState<Array<{content: string, isUser: boolean}>>([]);
  const [userPreferences, setUserPreferences] = useState({
    region: '',
    timing: '',
    wantsTimingRecommendation: null as boolean | null,
    skillLevel: '',
    duration: '',
    equipment: '',
    groupSize: ''
  });
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState(false);
  
  // Initialize the conversation with welcome message
  useEffect(() => {
    if (triageMessages.length === 0) {
      setTriageMessages([{
        content: "Hi there! I'd love to help you plan your next adventure. What kind of outdoor experience are you looking for?",
        isUser: false
      }]);
    }
  }, [triageMessages.length]);

  // Handle transcript and triage the conversation
  const handleTranscript = (transcript: string, tripData?: any) => {
    console.log('Index received transcript:', transcript);
    
    // Add the user message to triage messages
    setTriageMessages(prev => [...prev, {content: transcript, isUser: true}]);
    setHasSubmittedPrompt(true);
    
    if (tripData) {
      handleVoiceTripData(tripData, transcript);
    } else {
      processConversation(transcript);
    }
  };

  // Process the user's message based on conversation stage
  const processConversation = (userMessage: string) => {
    const userMessageLower = userMessage.toLowerCase();
    
    switch (conversationStage) {
      case 'welcome':
        setUserPreferences(prev => ({...prev, interests: userMessage}));
        askAboutRegion();
        break;
      
      case 'region':
        setUserPreferences(prev => ({...prev, region: userMessage}));
        askAboutTiming();
        break;
        
      case 'timing':
        setUserPreferences(prev => ({...prev, timing: userMessage}));
        askTimingRecommendation();
        break;
        
      case 'timing_recommendation':
        if (userMessageLower.includes('yes') || userMessageLower.includes('y')) {
          setUserPreferences(prev => ({...prev, wantsTimingRecommendation: true}));
          provideTimingRecommendation();
        } else {
          setUserPreferences(prev => ({...prev, wantsTimingRecommendation: false}));
          askAboutSkillLevel();
        }
        break;
        
      case 'skill_level':
        setUserPreferences(prev => ({...prev, skillLevel: userMessage}));
        askAboutDuration();
        break;
        
      case 'duration':
        setUserPreferences(prev => ({...prev, duration: userMessage}));
        askAboutEquipment();
        break;
        
      case 'equipment':
        setUserPreferences(prev => ({...prev, equipment: userMessage}));
        askAboutGroupSize();
        break;
        
      case 'group_size':
        setUserPreferences(prev => ({...prev, groupSize: userMessage}));
        confirmAndGenerateTrip();
        break;
        
      case 'confirmation':
        if (userMessageLower.includes('yes') || userMessageLower.includes('y')) {
          generateFinalTrip();
        } else {
          askForRefinement();
        }
        break;
        
      case 'refinement':
        handlePromptRefinement(userMessage);
        break;
        
      default:
        handlePromptSubmit(userMessage);
    }
  };
  
  // Conversation flow helper functions
  const askAboutRegion = () => {
    setConversationStage('region');
    addBotMessage("Great! What specific region or type of landscape are you interested in exploring?");
  };
  
  const askAboutTiming = () => {
    setConversationStage('timing');
    addBotMessage("When are you planning to go? (date range or season)");
  };
  
  const askTimingRecommendation = () => {
    setConversationStage('timing_recommendation');
    addBotMessage("Would you like me to recommend the best time to visit to avoid crowds? (Y/N)");
  };
  
  const provideTimingRecommendation = () => {
    addBotMessage(`Based on your interest in ${userPreferences.region}, I'd recommend visiting during shoulder seasons (late spring or early fall) to avoid crowds while still enjoying good weather.`);
    askAboutSkillLevel();
  };
  
  const askAboutSkillLevel = () => {
    setConversationStage('skill_level');
    addBotMessage("What is your skill/experience level with outdoor activities? For example, for hiking, are you comfortable with 8 hours of strenuous uphill climbing?");
  };
  
  const askAboutDuration = () => {
    setConversationStage('duration');
    addBotMessage("How long would you like your adventure to be? (days/weeks)");
  };
  
  const askAboutEquipment = () => {
    setConversationStage('equipment');
    addBotMessage("Do you have equipment already or will you need to rent/purchase gear?");
  };
  
  const askAboutGroupSize = () => {
    setConversationStage('group_size');
    addBotMessage("How many people will be joining you? Does your group include children or seniors?");
  };
  
  const confirmAndGenerateTrip = () => {
    setConversationStage('confirmation');
    
    const summary = `
Thanks for sharing those details. Based on what you've told me:
- Adventure interest: ${userPreferences.interests}
- Region: ${userPreferences.region}
- Timing: ${userPreferences.timing}
- Skill level: ${userPreferences.skillLevel}
- Duration: ${userPreferences.duration}
- Equipment: ${userPreferences.equipment}
- Group: ${userPreferences.groupSize}

I'll show you some adventure options on screen that match your preferences. Does this sound good? (Y/N)
    `;
    
    addBotMessage(summary);
  };
  
  const generateFinalTrip = () => {
    addBotMessage("Great! I'm crafting your perfect adventure experience now...");
    
    // Construct the prompt from gathered preferences
    const fullPrompt = `
Plan an adventure trip with these details:
- Region: ${userPreferences.region}
- Timing: ${userPreferences.timing}
- Skill Level: ${userPreferences.skillLevel}
- Duration: ${userPreferences.duration}
- Equipment needs: ${userPreferences.equipment}
- Group size: ${userPreferences.groupSize}
- Adventure interests: ${userPreferences.interests}
    `;
    
    // Submit to the AI
    handlePromptSubmit(fullPrompt);
  };
  
  const askForRefinement = () => {
    setConversationStage('refinement');
    addBotMessage("What would you like to change about the plan?");
  };
  
  const handlePromptRefinement = (refinement: string) => {
    addBotMessage("Thanks! I'll update your adventure options based on that feedback...");
    
    // Create a new prompt with the refinement
    const refinedPrompt = `
Adjust this trip based on the following feedback:
${refinement}

Original trip details:
- Region: ${userPreferences.region}
- Timing: ${userPreferences.timing}
- Skill Level: ${userPreferences.skillLevel}
- Duration: ${userPreferences.duration}
- Equipment needs: ${userPreferences.equipment}
- Group size: ${userPreferences.groupSize}
- Adventure interests: ${userPreferences.interests}
    `;
    
    handlePromptSubmit(refinedPrompt);
  };
  
  const addBotMessage = (message: string) => {
    setTriageMessages(prev => [...prev, {content: message, isUser: false}]);
  };

  const handleUserPrompt = (prompt: string) => {
    setTriageMessages(prev => [...prev, {content: prompt, isUser: true}]);
    setHasSubmittedPrompt(true);
    processConversation(prompt);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col min-h-[calc(100vh-80px)] bg-[#EFF3EE] dark:bg-[#202020]">
      {!hasSubmittedPrompt && (
        <div className="mb-8 text-center my-[20px] mx-0">
          <h1 className="text-4xl font-bold mb-4 py-0 mx-[2px] md:text-5xl my-px">
            Let's find an <span className="offbeat-gradient">offbeat</span> adventure
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-200 text-base my-0">
            Powered by local guides: explore, plan, and experience better trips
          </p>
        </div>
      )}

      <div className="flex-grow flex flex-col">
        {/* Conversation Area */}
        <div className="conversation-container border-b border-gray-200 dark:border-gray-800">
          {triageMessages.length > 0 && (
            <div className="mb-4">
              {triageMessages.map((message, index) => (
                <TriageResponseBubble 
                  key={index}
                  message={message.content}
                  isUser={message.isUser}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trip Results Area */}
        <div className="trip-results-container py-4">
          {error && (
            <ApiConnectionError 
              customMessage={error} 
              errorDetails={errorDetails || undefined} 
              onRetry={handleRetry} 
            />
          )}

          {loading && (
            <div className="mb-8">
              <LoadingSpinner />
              {thinking && thinking.length > 0 && (
                <ThinkingDisplay thinkingSteps={thinking} isVisible={true} />
              )}
            </div>
          )}

          {trips.length > 0 && (
            <div className="space-y-8 mb-8">
              {trips.map((trip, index) => (
                <div key={trip.id || `trip-${index}`} className="relative">
                  {trips.length > 1 && (
                    <div className="absolute -top-4 -left-2 z-10">
                      <span className="bg-[#65558F] text-white text-sm font-medium px-3 py-1 rounded-full">
                        Option {index + 1}
                      </span>
                    </div>
                  )}
                  <TripCard trip={trip} onSave={() => handleSaveTrip(trip)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Prompt Input */}
      <div className="sticky-prompt">
        <PromptInput 
          onSubmit={handleUserPrompt}
          onTranscript={handleTranscript}
          isProcessing={loading} 
          placeholder="Tell us about your dream trip..." 
        />
      </div>
    </div>
  );
};

export default Index;
