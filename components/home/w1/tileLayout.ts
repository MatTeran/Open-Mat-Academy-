import { StyleSheet } from 'react-native';

import { fontFamilies } from '../../../lib/theme';

/**
 * Shared layout + type scale for Home dashboard tiles.
 * Next Class and Journey must share these zones exactly.
 */
export const TILE = {
  /** Locked equal card height */
  height: 220,
  pad: 14,
  headerHeight: 20,
  /** Primary headline (class name / level) */
  titleSize: 14,
  titleLineHeight: 17,
  titleLetterSpacing: 0.4,
  titleMaxLines: 2,
  /** Supporting meta (when, XP, location) */
  metaSize: 11,
  metaLineHeight: 14,
  metaGap: 4,
  /** Footer block (CTA + links | metrics) */
  footerHeight: 74,
  btnHeight: 34,
  secondaryHeight: 24,
  metricsHeight: 62,
  bodyGap: 6,
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
    fontSize: 13,
    letterSpacing: 0.15,
  },
  metricLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 8,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
