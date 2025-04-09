
// Generate a prompt for the Gemini API
export function createGeminiPrompt(userPrompt: string): string {
  return `Generate detailed trip plans based on this request: "${userPrompt}"

Prioritize:
- Off-the-beaten-path locations and local operators
- Shoulder-season times to avoid crowds
- Realistic congestion expectations
- Appropriate preparation guidance
- Realistic timing for activities and travel between locations

Create a structured JSON response with all trip details including itinerary, map markers, and journey segments.`;
}
