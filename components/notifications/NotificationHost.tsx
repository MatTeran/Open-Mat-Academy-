import { useNotifications } from '../../hooks';
import { NotificationBanner } from './NotificationBanner';

/**
 * Global foreground notification banner host.
 * Mount once under NavigationContainer + NotificationProvider.
 */
export function NotificationHost() {
  const {
    foregroundBanner,
    dismissForegroundBanner,
    handleNotificationNavigation,
    history,
    markRead,
  } = useNotifications();

  if (!foregroundBanner) {
    return null;
  }

  const matched = history.find((item) => item.id === foregroundBanner.id);

  return (
    <NotificationBanner
      title={foregroundBanner.title}
      body={foregroundBanner.body}
      category={foregroundBanner.category}
      onDismiss={dismissForegroundBanner}
      onPress={() => {
        dismissForegroundBanner();
        if (matched) {
          void markRead(matched.id);
          handleNotificationNavigation(matched.data);
        }
      }}
    />
  );
}
