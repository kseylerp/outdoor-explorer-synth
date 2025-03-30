
/**
 * Validates the prompt request
 * @param prompt The prompt to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validatePrompt(prompt: unknown): string | undefined {
  if (!prompt) {
    return 'Prompt is required';
  }

  if (typeof prompt !== 'string') {
    return 'Prompt must be a string';
  }

  if (prompt.trim().length === 0) {
    return 'Prompt cannot be empty';
  }

  return undefined;
}
