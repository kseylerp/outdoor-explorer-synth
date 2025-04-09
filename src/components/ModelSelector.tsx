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
  // Always default to 'gemini' now
  const [preferredModel, setPreferredModel] = useState<'claude' | 'gemini'>(
    () => 'gemini'
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
    
    // Trigger a storage event so other components can react to the change
    window.dispatchEvent(new Event('storage'));
  }, [preferredModel, compact, onChange]);

  const toggleModel = () => {
    // Claude is temporarily disabled, so this is now a no-op
    // We keep the function for future re-enabling
    console.log('Claude is temporarily unavailable');
    toast({
      title: "Only Gemini available",
      description: "Claude is temporarily unavailable. Using Gemini instead.",
    });
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">C</span>
        <Switch 
          checked={true} 
          disabled={true}
          className="scale-75"
        />
        <span className="text-xs font-medium">G</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Claude</span>
      <Switch 
        id="model-toggle" 
        checked={true} 
        disabled={true}
      />
      <span className="text-sm font-medium">Gemini</span>
      
      {showLabels && (
        <span className="ml-2 text-xs text-muted-foreground">
          (Google)
        </span>
      )}
    </div>
  );
};

export default ModelSelector;
