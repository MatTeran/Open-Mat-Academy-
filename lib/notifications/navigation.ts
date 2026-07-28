import {
  createNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

import type { RootStackParamList } from '../../navigation/types';
import type { NotificationRouteTarget } from './notificationTypes';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

let navigationReady = false;

export function setNavigationReady(ready: boolean): void {
  navigationReady = ready;
}

export function isNavigationReady(): boolean {
  return navigationReady && navigationRef.isReady();
}

/**
 * Navigate from a resolved notification target once auth + nav are ready.
 * Falls back to Profile → Notifications when the destination is unavailable.
 */
export function navigateFromNotificationTarget(
  target: NotificationRouteTarget,
): void {
  if (!isNavigationReady()) {
    return;
  }

  try {
    switch (target.kind) {
      case 'schedule':
        navigationRef.dispatch(
          CommonActions.navigate({
            name: 'Main',
            params: { screen: 'Schedule' },
          }),
        );
        return;
      case 'journey':
        navigationRef.dispatch(
          CommonActions.navigate({
            name: 'Main',
            params: {
              screen: 'Home',
              params: { screen: 'Journey' },
            },
          }),
        );
        return;
      case 'announcement':
        navigationRef.dispatch(
          CommonActions.navigate({
            name: 'Main',
            params: {
              screen: 'Community',
              params: {
                screen: 'AnnouncementDetail',
                params: { announcementId: target.announcementId },
              },
            },
          }),
        );
        return;
      case 'local_events':
        navigationRef.dispatch(
          CommonActions.navigate({
            name: 'Main',
            params: {
              screen: 'Home',
              params: { screen: 'LocalEvents' },
            },
          }),
        );
        return;
      case 'notifications':
      case 'fallback':
      default:
        navigationRef.dispatch(
          CommonActions.navigate({
            name: 'Main',
            params: {
              screen: 'Profile',
              params: { screen: 'Notifications' },
            },
          }),
        );
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[notifications] navigation failed', error);
    }
    try {
      navigationRef.dispatch(
        CommonActions.navigate({
          name: 'Main',
          params: {
            screen: 'Profile',
            params: { screen: 'Notifications' },
          },
        }),
      );
    } catch {
      // Avoid crash loops from stale navigation state.
    }
  }
}
