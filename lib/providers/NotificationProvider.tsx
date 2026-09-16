import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo, AppState } from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  isEventAllowedByPreferences,
} from '../notifications/notificationPreferences';
import { navigateFromNotificationTarget } from '../notifications/navigation';
import { resolveNotificationRoute } from '../notifications/notificationRoutes';
import {
  buildHistoryItem,
  configureNotificationHandler,
  enablePushNotifications,
  openSystemNotificationSettings,
  parseNotificationData,
  presentLocalNotification,
  type PermissionEnableResult,
} from '../notifications/notificationService';
import {
  loadNotificationHistory,
  loadNotificationPreferences,
  loadPermissionPromptStatus,
  prependNotificationHistory,
  saveNotificationHistory,
  saveNotificationPreferences,
  savePermissionPromptStatus,
} from '../notifications/notificationStorage';
import { syncNotificationPreferencesToSupabase } from '../notifications/pushTokenApi';
import type {
  OpenMatNotification,
  OpenMatNotificationData,
  NotificationPreferences,
  PermissionPromptStatus,
} from '../notifications/notificationTypes';

export interface ForegroundBannerState {
  id: string;
  title: string;
  body: string;
  category: OpenMatNotification['category'];
}

interface NotificationContextValue {
  ready: boolean;
  preferences: NotificationPreferences;
  history: OpenMatNotification[];
  unreadCount: number;
  permissionPromptStatus: PermissionPromptStatus;
  permissionStatus: Notifications.PermissionStatus | 'unknown';
  foregroundBanner: ForegroundBannerState | null;
  dismissForegroundBanner: () => void;
  updatePreferences: (
    patch: Partial<NotificationPreferences>,
  ) => Promise<void>;
  enableNotifications: () => Promise<PermissionEnableResult>;
  deferPermissionPrompt: () => Promise<void>;
  openSettings: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  addToHistory: (item: OpenMatNotification) => Promise<void>;
  handleNotificationNavigation: (data?: OpenMatNotificationData | null) => void;
  runDevTest: (kind: DevTestKind) => Promise<void>;
}

export type DevTestKind =
  | 'class_reminder'
  | 'waitlist'
  | 'achievement'
  | 'weekly_goal'
  | 'academy'
  | 'competition';

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

function shouldHapticForEvent(eventType: string): boolean {
  return (
    eventType === 'achievement_unlocked' ||
    eventType === 'waitlist_opening' ||
    eventType === 'weekly_goal_completed'
  );
}

export function NotificationProvider({ children }: PropsWithChildren) {
  const { user, isGuest, isAuthenticated } = useAuth();
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );
  const [history, setHistory] = useState<OpenMatNotification[]>([]);
  const [permissionPromptStatus, setPermissionPromptStatus] =
    useState<PermissionPromptStatus>('unknown');
  const [permissionStatus, setPermissionStatus] = useState<
    Notifications.PermissionStatus | 'unknown'
  >('unknown');
  const [foregroundBanner, setForegroundBanner] =
    useState<ForegroundBannerState | null>(null);
  const responseHandledRef = useRef<string | null>(null);

  const userId = user?.id ?? 'anonymous';

  useEffect(() => {
    configureNotificationHandler();

    let mounted = true;

    async function bootstrap() {
      try {
        const [prefs, items, prompt] = await Promise.all([
          loadNotificationPreferences(),
          loadNotificationHistory(),
          loadPermissionPromptStatus(),
        ]);
        const permissions = await Notifications.getPermissionsAsync();
        if (!mounted) {
          return;
        }
        setPreferences(prefs);
        setHistory(items);
        setPermissionPromptStatus(prompt);
        setPermissionStatus(permissions.status);
      } catch (error) {
        if (__DEV__) {
          console.warn('[notifications] bootstrap failed', error);
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    void bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const dismissForegroundBanner = useCallback(() => {
    setForegroundBanner(null);
  }, []);

  const addToHistory = useCallback(async (item: OpenMatNotification) => {
    const next = await prependNotificationHistory(item);
    setHistory(next);
  }, []);

  const handleIncoming = useCallback(
    async (
      title: string | null | undefined,
      body: string | null | undefined,
      rawData: unknown,
      options?: { showBanner?: boolean },
    ) => {
      const data = parseNotificationData(rawData);
      if (!data) {
        return;
      }

      if (!isEventAllowedByPreferences(data.eventType, preferences)) {
        return;
      }

      const item = buildHistoryItem({
        userId,
        title: title?.trim() || 'My Gi',
        body: body?.trim() || '',
        category: data.category,
        eventType: data.eventType,
        data,
      });

      await addToHistory(item);

      if (options?.showBanner !== false) {
        setForegroundBanner({
          id: item.id,
          title: item.title,
          body: item.body,
          category: item.category,
        });
        AccessibilityInfo.announceForAccessibility?.(
          `${item.title}. ${item.body}`,
        );
      }

      if (shouldHapticForEvent(data.eventType)) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => undefined);
      }
    },
    [addToHistory, preferences, userId],
  );

  const handleNotificationNavigation = useCallback(
    (data?: OpenMatNotificationData | null) => {
      const target = resolveNotificationRoute(data);
      navigateFromNotificationTarget(target);
    },
    [],
  );

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        const content = notification.request.content;
        void handleIncoming(content.title, content.body, content.data, {
          showBanner: true,
        });
      },
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const responseId = response.notification.request.identifier;
        if (responseHandledRef.current === responseId) {
          return;
        }
        responseHandledRef.current = responseId;

        const content = response.notification.request.content;
        const data = parseNotificationData(content.data);
        void handleIncoming(content.title, content.body, content.data, {
          showBanner: false,
        }).finally(() => {
          handleNotificationNavigation(data);
        });
      },
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [handleIncoming, handleNotificationNavigation]);

  // Cold start: notification that launched the app.
  useEffect(() => {
    if (!ready || !isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function consumeColdStart() {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (!response || cancelled) {
        return;
      }
      const responseId = response.notification.request.identifier;
      if (responseHandledRef.current === responseId) {
        return;
      }
      responseHandledRef.current = responseId;
      const data = parseNotificationData(
        response.notification.request.content.data,
      );
      handleNotificationNavigation(data);
    }

    const timer = setTimeout(() => {
      void consumeColdStart();
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ready, isAuthenticated, handleNotificationNavigation]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        return;
      }
      void Notifications.getPermissionsAsync().then((result) => {
        setPermissionStatus(result.status);
      });
    });
    return () => sub.remove();
  }, []);

  const updatePreferences = useCallback(
    async (patch: Partial<NotificationPreferences>) => {
      setPreferences((current) => {
        const next = { ...current, ...patch };
        void saveNotificationPreferences(next);
        if (user?.id && !isGuest) {
          void syncNotificationPreferencesToSupabase(user.id, next);
        }
        return next;
      });
    },
    [isGuest, user?.id],
  );

  const enableNotifications = useCallback(async () => {
    const result = await enablePushNotifications({
      userId: user?.id,
      isGuest,
    });

    const permissions = await Notifications.getPermissionsAsync();
    setPermissionStatus(permissions.status);

    if (result.status === 'granted') {
      await savePermissionPromptStatus('accepted');
      setPermissionPromptStatus('accepted');
    } else if (result.status === 'blocked') {
      await savePermissionPromptStatus('blocked');
      setPermissionPromptStatus('blocked');
    } else if (result.status === 'denied') {
      await savePermissionPromptStatus('denied');
      setPermissionPromptStatus('denied');
    }

    return result;
  }, [isGuest, user?.id]);

  const deferPermissionPrompt = useCallback(async () => {
    await savePermissionPromptStatus('deferred');
    setPermissionPromptStatus('deferred');
  }, []);

  const markRead = useCallback(async (id: string) => {
    setHistory((current) => {
      const next = current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      );
      void saveNotificationHistory(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(async () => {
    setHistory((current) => {
      const next = current.map((item) => ({ ...item, isRead: true }));
      void saveNotificationHistory(next);
      return next;
    });
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    setHistory((current) => {
      const next = current.filter((item) => item.id !== id);
      void saveNotificationHistory(next);
      return next;
    });
  }, []);

  const runDevTest = useCallback(
    async (kind: DevTestKind) => {
      const map: Record<
        DevTestKind,
        { title: string; body: string; data: OpenMatNotificationData }
      > = {
        class_reminder: {
          title: 'Competition Class starts in 1 hour',
          body: 'You’re one class away from your weekly goal.',
          data: {
            eventType: 'class_reminder',
            category: 'training',
            screen: 'ClassDetails',
            classId: 'demo-class-1',
          },
        },
        waitlist: {
          title: 'A spot just opened',
          body: 'Tonight’s No-Gi class has availability. Reserve now before it fills.',
          data: {
            eventType: 'waitlist_opening',
            category: 'training',
            screen: 'ClassDetails',
            classId: 'demo-class-nogi',
            action: 'reserve',
          },
        },
        achievement: {
          title: 'Achievement Unlocked',
          body: 'You completed 100 classes.',
          data: {
            eventType: 'achievement_unlocked',
            category: 'journey',
            screen: 'Journey',
            achievementId: '100-classes',
          },
        },
        weekly_goal: {
          title: 'One class left this week',
          body: 'Train once more to complete your weekly goal.',
          data: {
            eventType: 'weekly_goal_progress',
            category: 'journey',
            screen: 'Journey',
          },
        },
        academy: {
          title: 'Coach announcement',
          body: 'Open Mat hours update for this weekend.',
          data: {
            eventType: 'coach_announcement',
            category: 'academy',
            screen: 'AnnouncementDetails',
            announcementId: 'demo-announcement',
          },
        },
        competition: {
          title: 'Competition countdown',
          body: 'Your tournament is one week away. Review weigh-ins.',
          data: {
            eventType: 'competition_countdown',
            category: 'competition',
            screen: 'CompetitionDetails',
            competitionId: 'demo-comp-1',
          },
        },
      };

      const sample = map[kind];
      await presentLocalNotification(sample);
      // History + banner come from the received listener when OS delivers.
      // Also write history immediately so the center updates even if the
      // foreground handler suppresses duplicates on some platforms.
      const item = buildHistoryItem({
        userId,
        title: sample.title,
        body: sample.body,
        category: sample.data.category,
        eventType: sample.data.eventType,
        data: sample.data,
      });
      await addToHistory(item);
      setForegroundBanner({
        id: item.id,
        title: item.title,
        body: item.body,
        category: item.category,
      });
      if (shouldHapticForEvent(sample.data.eventType)) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => undefined);
      }
    },
    [addToHistory, userId],
  );

  const unreadCount = useMemo(
    () => history.filter((item) => !item.isRead).length,
    [history],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      ready,
      preferences,
      history,
      unreadCount,
      permissionPromptStatus,
      permissionStatus,
      foregroundBanner,
      dismissForegroundBanner,
      updatePreferences,
      enableNotifications,
      deferPermissionPrompt,
      openSettings: openSystemNotificationSettings,
      markRead,
      markAllRead,
      removeNotification,
      addToHistory,
      handleNotificationNavigation,
      runDevTest,
    }),
    [
      ready,
      preferences,
      history,
      unreadCount,
      permissionPromptStatus,
      permissionStatus,
      foregroundBanner,
      dismissForegroundBanner,
      updatePreferences,
      enableNotifications,
      deferPermissionPrompt,
      markRead,
      markAllRead,
      removeNotification,
      addToHistory,
      handleNotificationNavigation,
      runDevTest,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}
