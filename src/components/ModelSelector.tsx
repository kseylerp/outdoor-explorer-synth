
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ModelSelectorProps {
  compact?: boolean; // For more compact display in headers
  showLabels?: boolean; // Whether to show descriptive labels
  onChange?: (model: 'gemini') => void; // Only OpenAI option now
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  compact = false, 
  showLabels = true,
  onChange 
}) => {
  // Always use OpenAI via Gemini endpoint
  const [preferredModel, setPreferredModel] = useState<'gemini'>(
    () => 'gemini'
  );

  // Update localStorage when preference changes (though we only have one option now)
  useEffect(() => {
    localStorage.setItem('preferredAiModel', preferredModel);
    
    // Call the onChange callback if provided
    if (onChange) {
      onChange(preferredModel);
    }
    
    // Trigger a storage event so other components can react to the change
    window.dispatchEvent(new Event('storage'));
  }, [preferredModel, onChange]);

  // Only show a message that we're using OpenAI
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">Using OpenAI</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Using OpenAI</span>
      
      {showLabels && (
        <span className="ml-2 text-xs text-muted-foreground">
          (powered by gpt-4o)
        </span>
      )}
    </div>
  );
};

export default ModelSelector;
