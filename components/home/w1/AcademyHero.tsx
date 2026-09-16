import { Ionicons } from '@expo/vector-icons';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { spacing, w1Spacing } from '../../../lib/theme';

const heroImage = require('../../../assets/home-hero.jpg');

interface AcademyHeroProps {
  /** Kept for callers / a11y; brand + location live in the hero photo. */
  academyName: string;
  locationLabel: string;
  unreadCount?: number;
  onPressNotifications?: () => void;
}

/**
 * Full-bleed academy hero. Branding is in the photo (My Gi · Central Valley);
 * UI chrome is limited to notifications so the first viewport stays light.
 */
export function AcademyHero({
  academyName,
  locationLabel,
  unreadCount = 0,
  onPressNotifications,
}: AcademyHeroProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Wide academy interior — immersive but not taller than the tiles below.
  const height = Math.max(176, Math.min(220, width * 0.52));

  return (
    <View
      style={[styles.wrap, { height: height + insets.top }]}
      accessibilityRole="header"
      accessibilityLabel={`${academyName}, ${locationLabel}`}
    >
      <ImageBackground
        source={heroImage}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* Soft top veil only — keep wall branding readable */}
        <View style={styles.topVeil} />

        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + spacing.sm,
              paddingHorizontal: w1Spacing.screenX,
            },
          ]}
        >
          <View style={styles.topRow}>
            <View style={styles.spacer} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : 'Notifications'
              }
              onPress={onPressNotifications}
              hitSlop={12}
              style={[
                styles.bell,
                { backgroundColor: 'rgba(20,18,14,0.28)' },
              ]}
            >
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
              {unreadCount > 0 ? (
                <View
                  style={[styles.dot, { backgroundColor: colors.goldAccent }]}
                />
              ) : null}
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
  },
  topVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 14, 10, 0.12)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  spacer: {
    flex: 1,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
