import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Spacing } from '../../../lib/theme';

const heroImage = require('../../../assets/home-hero.png');
const brandLogo = require('../../../assets/brand-logo.png');

interface AcademyHeroProps {
  academyName: string;
  locationLabel: string;
  unreadCount?: number;
  onPressNotifications?: () => void;
}

/**
 * Immersive academy photography with a balanced brand / notifications overlay.
 * Layout: [Logo] Brand .............. [Bell]
 *         Location
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
  const height = Math.max(168, Math.min(210, width * 0.48));

  return (
    <View style={[styles.wrap, { height: height + insets.top }]}>
      <ImageBackground
        source={heroImage}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* Light scrim for type legibility — keep photography visible */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(18, 14, 10, 0.30)' },
          ]}
        />
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
            <View style={styles.brandInline}>
              <Image source={brandLogo} style={styles.logo} />
              <Text
                style={styles.academyName}
                numberOfLines={1}
                accessibilityRole="header"
              >
                {academyName}
              </Text>
            </View>

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
                { backgroundColor: 'rgba(255,255,255,0.14)' },
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

          <Text style={styles.location} numberOfLines={1}>
            {locationLabel}
          </Text>
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
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brandInline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  academyName: {
    flexShrink: 1,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  location: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.88)',
    paddingLeft: 38,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
