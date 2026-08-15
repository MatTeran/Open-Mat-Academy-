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

export function AcademyHero({
  academyName,
  locationLabel,
  unreadCount = 0,
  onPressNotifications,
}: AcademyHeroProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Roughly half of the previous tall hero — immersive but not dominant.
  const height = Math.max(168, Math.min(210, width * 0.48));

  return (
    <View style={[styles.wrap, { height: height + insets.top }]}>
      <ImageBackground
        source={heroImage}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(18, 14, 10, 0.28)' },
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
            <View style={styles.brandBlock}>
              <View style={styles.logoRow}>
                <View style={styles.logoRing}>
                  <Image source={brandLogo} style={styles.logo} />
                </View>
                <Text
                  style={styles.academyName}
                  numberOfLines={1}
                  accessibilityRole="header"
                >
                  {academyName}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <View style={styles.locationRule} />
                <Text style={styles.location}>{locationLabel}</Text>
                <View style={styles.locationRule} />
              </View>
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
              style={styles.bell}
            >
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
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
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brandBlock: {
    flex: 1,
    gap: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  academyName: {
    flexShrink: 1,
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 2,
  },
  locationRule: {
    width: 18,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  location: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.88)',
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
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
