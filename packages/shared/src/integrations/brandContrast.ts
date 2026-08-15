/**
 * Relative luminance / contrast helpers for academy branding safety.
 * WCAG 2.1 contrast ratio against a fixed surface.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(foreground: string, background: string): number | null {
  const L1 = relativeLuminance(foreground);
  const L2 = relativeLuminance(background);
  if (L1 == null || L2 == null) return null;
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastWarning = {
  field: string;
  ratio: number;
  message: string;
};

const SURFACE = '#FAF9F6';
const INK = '#20201E';

/** Warn when accent/primary may fail AA against ivory surface or ink text. */
export function validateBrandColors(input: {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
}): ContrastWarning[] {
  const warnings: ContrastWarning[] = [];
  const checks: Array<{ field: string; color?: string | null }> = [
    { field: 'primaryColor', color: input.primaryColor },
    { field: 'secondaryColor', color: input.secondaryColor },
    { field: 'accentColor', color: input.accentColor },
  ];

  for (const { field, color } of checks) {
    if (!color) continue;
    const vsSurface = contrastRatio(color, SURFACE);
    if (vsSurface != null && vsSurface < 3) {
      warnings.push({
        field,
        ratio: Math.round(vsSurface * 100) / 100,
        message: `This ${field.replace('Color', '')} color may not provide sufficient contrast against the My Gi surface.`,
      });
    }
    const vsInk = contrastRatio(color, INK);
    if (vsInk != null && vsInk < 3) {
      warnings.push({
        field,
        ratio: Math.round(vsInk * 100) / 100,
        message: `This ${field.replace('Color', '')} color may not provide sufficient contrast with primary text.`,
      });
    }
  }
  return warnings;
}
