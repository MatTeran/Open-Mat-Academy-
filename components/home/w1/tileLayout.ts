import { StyleSheet } from 'react-native';

import { fontFamilies } from '../../../lib/theme';

/**
 * Shared layout + type scale for Home dashboard tiles.
 * Next Class and Journey must share these zones exactly.
 */
export const TILE = {
  /** Locked equal card height */
  height: 248,
  pad: 16,
  headerHeight: 22,
  /** Primary headline (class name / level) */
  titleSize: 15,
  titleLineHeight: 18,
  titleLetterSpacing: 0.35,
  titleMaxLines: 2,
  /** Supporting meta (when, XP, location) */
  metaSize: 11,
  metaLineHeight: 14,
  metaGap: 5,
  /** Footer block (CTA + links | metrics) */
  footerHeight: 86,
  btnHeight: 38,
  secondaryHeight: 28,
  metricsHeight: 72,
  bodyGap: 8,
} as const;

export const tileType = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: TILE.headerHeight,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: TILE.titleSize,
    lineHeight: TILE.titleLineHeight,
    letterSpacing: TILE.titleLetterSpacing,
    textTransform: 'uppercase',
  },
  meta: {
    fontFamily: fontFamilies.regular,
    fontSize: TILE.metaSize,
    lineHeight: TILE.metaLineHeight,
  },
  metaStrong: {
    fontFamily: fontFamilies.medium,
    fontSize: TILE.metaSize,
    lineHeight: TILE.metaLineHeight,
  },
  trailing: {
    fontFamily: fontFamilies.semibold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  cta: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  secondary: {
    fontFamily: fontFamilies.medium,
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    letterSpacing: 0.15,
  },
  metricLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 8,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
