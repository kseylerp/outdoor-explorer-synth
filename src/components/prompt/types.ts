
/**
 * Type definitions for prompt components
 * 
 * These types define the shape of:
 * - Quick response options for interactive prompts
 * - Props for the main prompt input component
 */

/**
 * Defines a quick response option shown to users
 * @property text - Display text shown on the button
 * @property value - Value submitted when the option is selected
 */
export interface QuickResponseOption {
  text: string;
  value: string;
}

/**
 * Props for the main PromptInput component
 * 
 * @property onSubmit - Callback function when a prompt is submitted
 * @property onTranscript - Optional callback for handling voice transcripts
 * @property isProcessing - Whether the system is currently processing a request
 * @property defaultValue - Optional initial value for the prompt
 * @property placeholder - Optional placeholder text for the input
 */
export interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  onTranscript?: (transcript: string, tripData?: any) => void;
  isProcessing: boolean;
  defaultValue?: string;
  placeholder?: string;
}
