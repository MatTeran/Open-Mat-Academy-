import { G, Path } from 'react-native-svg';

import type { MedalMaterial } from '../../../lib/achievements/materials';
import { materialPalette } from '../../../lib/achievements/materials';

/** Layered metallic flame on obsidian hex face. */
export function Streak30Art({
  cx,
  cy,
  s,
  material,
  unlocked,
}: {
  cx: number;
  cy: number;
  s: number;
  material: MedalMaterial;
  unlocked: boolean;
}) {
  const outer = unlocked ? materialPalette.amberEnamel : material.accent;
  const mid = unlocked ? '#E39B2E' : material.rimMid;
  const core = unlocked ? materialPalette.goldHighlight : material.rimHighlight;
  const metal = unlocked ? materialPalette.primaryGold : material.rimMid;

  return (
    <G>
      {/* Obsidian plate hint */}
      <Path
        d={`M ${cx} ${cy - 20 * s}
          L ${cx + 17 * s} ${cy - 10 * s}
          L ${cx + 17 * s} ${cy + 10 * s}
          L ${cx} ${cy + 20 * s}
          L ${cx - 17 * s} ${cy + 10 * s}
          L ${cx - 17 * s} ${cy - 10 * s}
          Z`}
        fill={materialPalette.obsidian}
        opacity={unlocked ? 0.55 : 0.35}
      />

      {/* Outer flame metal edge */}
      <Path
        d={`M ${cx} ${cy + 14 * s}
          C ${cx - 13 * s} ${cy + 4 * s}, ${cx - 11 * s} ${cy - 8 * s}, ${cx - 2 * s} ${cy - 16 * s}
          C ${cx - 1 * s} ${cy - 8 * s}, ${cx + 6 * s} ${cy - 6 * s}, ${cx + 5 * s} ${cy + 2 * s}
          C ${cx + 10 * s} ${cy - 2 * s}, ${cx + 12 * s} ${cy + 6 * s}, ${cx + 8 * s} ${cy + 12 * s}
          C ${cx + 5 * s} ${cy + 16 * s}, ${cx + 2 * s} ${cy + 16 * s}, ${cx} ${cy + 14 * s}
          Z`}
        fill={metal}
        opacity={unlocked ? 0.95 : 0.5}
      />

      {/* Amber enamel core */}
      <Path
        d={`M ${cx} ${cy + 11 * s}
          C ${cx - 9 * s} ${cy + 3 * s}, ${cx - 8 * s} ${cy - 6 * s}, ${cx} ${cy - 12 * s}
          C ${cx + 2 * s} ${cy - 5 * s}, ${cx + 7 * s} ${cy - 2 * s}, ${cx + 6 * s} ${cy + 5 * s}
          C ${cx + 8 * s} ${cy + 2 * s}, ${cx + 8 * s} ${cy + 8 * s}, ${cx + 4 * s} ${cy + 11 * s}
          C ${cx + 2 * s} ${cy + 13 * s}, ${cx + 1 * s} ${cy + 12 * s}, ${cx} ${cy + 11 * s}
          Z`}
        fill={outer}
        opacity={unlocked ? 0.95 : 0.4}
      />
      <Path
        d={`M ${cx} ${cy + 8 * s}
          C ${cx - 5 * s} ${cy + 2 * s}, ${cx - 4 * s} ${cy - 4 * s}, ${cx} ${cy - 8 * s}
          C ${cx + 2 * s} ${cy - 3 * s}, ${cx + 4 * s} ${cy} ${cx + 3 * s} ${cy + 4 * s}
          C ${cx + 4 * s} ${cy + 6 * s}, ${cx + 2 * s} ${cy + 8 * s}, ${cx} ${cy + 8 * s}
          Z`}
        fill={mid}
        opacity={unlocked ? 0.9 : 0.35}
      />
      <Path
        d={`M ${cx} ${cy + 5 * s}
          C ${cx - 2.5 * s} ${cy + 1 * s}, ${cx - 2 * s} ${cy - 2 * s}, ${cx} ${cy - 5 * s}
          C ${cx + 1.5 * s} ${cy - 1 * s}, ${cx + 2 * s} ${cy + 2 * s}, ${cx} ${cy + 5 * s}
          Z`}
        fill={core}
        opacity={unlocked ? 0.95 : 0.3}
      />

      {/* Engraved 30 */}
      <Path
        d={`M ${cx - 8 * s} ${cy + 18 * s} H ${cx + 8 * s}`}
        stroke={material.rimHighlight}
        strokeOpacity={unlocked ? 0.35 : 0.18}
        strokeWidth={0.8}
      />
    </G>
  );
}
