
export interface QuickResponseOption {
  text: string;
  value: string;
}

export interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  onTranscript?: (transcript: string, tripData?: any) => void;
  isProcessing: boolean;
  defaultValue?: string;
  placeholder?: string;
}
