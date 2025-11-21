/**
 * Generates an array of distinct HSL colors.
 * @param count The number of colors to generate.
 * @returns Array of HSL color strings.
 */
export function generateDistinctColors(count: number): string[] {
  const colors: string[] = [];
  const saturation = 70;
  const lightness = 50;

  for (let i = 0; i < count; i++) {
    // Distribute hues evenly around the color wheel (0-360)
    const hue = Math.floor((i * 360) / count);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}
