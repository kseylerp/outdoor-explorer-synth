
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ModelSelectorProps {
  compact?: boolean; // For more compact display in headers
  showLabels?: boolean; // Whether to show descriptive labels
  onChange?: (model: 'claude' | 'gemini') => void; // Optional callback when model changes
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  compact = false, 
  showLabels = true,
  onChange 
}) => {
  // Get preferred model from localStorage, default to 'claude'
  const [preferredModel, setPreferredModel] = useState<'claude' | 'gemini'>(
    () => (localStorage.getItem('preferredAiModel') as 'claude' | 'gemini') || 'claude'
  );

  // Update localStorage when preference changes
  useEffect(() => {
    localStorage.setItem('preferredAiModel', preferredModel);
    
    if (!compact) {
      toast({
        title: "Preference Saved",
        description: `${preferredModel === 'claude' ? 'Claude' : 'Gemini'} set as your preferred AI model.`,
      });
    }
    
    // Call the onChange callback if provided
    if (onChange) {
      onChange(preferredModel);
    }
  }, [preferredModel, compact, onChange]);

  const toggleModel = () => {
    setPreferredModel(current => current === 'claude' ? 'gemini' : 'claude');
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className={`text-xs ${preferredModel === 'gemini' ? 'text-muted-foreground' : 'font-medium'}`}>C</span>
        <Switch 
          checked={preferredModel === 'gemini'} 
          onCheckedChange={toggleModel} 
          className="scale-75"
        />
        <span className={`text-xs ${preferredModel === 'claude' ? 'text-muted-foreground' : 'font-medium'}`}>G</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${preferredModel === 'gemini' ? 'text-muted-foreground' : 'font-medium'}`}>Claude</span>
      <Switch 
        id="model-toggle" 
        checked={preferredModel === 'gemini'} 
        onCheckedChange={toggleModel} 
      />
      <span className={`text-sm ${preferredModel === 'claude' ? 'text-muted-foreground' : 'font-medium'}`}>Gemini</span>
      
      {showLabels && (
        <span className="ml-2 text-xs text-muted-foreground">
          {preferredModel === 'claude' ? '(Anthropic)' : '(Google)'}
        </span>
      )}
    </div>
  );
};

export default ModelSelector;
