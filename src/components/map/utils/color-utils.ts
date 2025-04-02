
/**
 * Adjusts the brightness of a hex color
 * @param hex Hex color code
 * @param percent Percentage to adjust brightness (positive = brighter, negative = darker)
 * @returns Adjusted hex color
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  // Parse hex color to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, r + percent));
  g = Math.min(255, Math.max(0, g + percent));
  b = Math.min(255, Math.max(0, b + percent));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
