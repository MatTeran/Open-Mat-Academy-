import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  ANNOUNCEMENTS,
  OPEN_MATS,
  SEMINARS,
  TEAM_CHAT_MESSAGES,
  BIRTHDAYS,
} from '../mocks/community';
import type {
  Announcement,
  ChatMessage,
  MemberBirthday,
  OpenMatSession,
  Seminar,
} from '../../types/community';

interface CommunityContextValue {
  announcements: Announcement[];
  birthdays: MemberBirthday[];
  seminars: Seminar[];
  openMats: OpenMatSession[];
  chatMessages: ChatMessage[];
  getAnnouncement: (id: string) => Announcement | undefined;
  addComment: (announcementId: string, body: string, authorName: string) => void;
  toggleSeminarRegistration: (seminarId: string) => void;
  sendChatMessage: (body: string, authorName: string) => void;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: PropsWithChildren) {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [seminars, setSeminars] = useState(SEMINARS);
  const [chatMessages, setChatMessages] = useState(TEAM_CHAT_MESSAGES);

  const getAnnouncement = useCallback(
    (id: string) => announcements.find((item) => item.id === id),
    [announcements],
  );

  const addComment = useCallback(
    (announcementId: string, body: string, authorName: string) => {
      const trimmed = body.trim();
      if (!trimmed) {
        return;
      }

      setAnnouncements((current) =>
        current.map((item) => {
          if (item.id !== announcementId) {
            return item;
          }
          return {
            ...item,
            comments: [
              ...item.comments,
              {
                id: `c-${Date.now()}`,
                authorName,
                body: trimmed,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
      );
    },
    [],
  );

  const toggleSeminarRegistration = useCallback((seminarId: string) => {
    setSeminars((current) =>
      current.map((item) => {
        if (item.id !== seminarId) {
          return item;
        }
        const registered = !item.registered;
        return {
          ...item,
          registered,
          spotsLeft: registered
            ? Math.max(item.spotsLeft - 1, 0)
            : item.spotsLeft + 1,
        };
      }),
    );
  }, []);

  const sendChatMessage = useCallback((body: string, authorName: string) => {
    const trimmed = body.trim();
    if (!trimmed) {
      return;
    }
    setChatMessages((current) => [
      ...current,
      {
        id: `m-${Date.now()}`,
        authorName,
        body: trimmed,
        createdAt: new Date().toISOString(),
        mine: true,
      },
    ]);
  }, []);

  const value = useMemo(
    () => ({
      announcements,
      birthdays: BIRTHDAYS,
      seminars,
      openMats: OPEN_MATS,
      chatMessages,
      getAnnouncement,
      addComment,
      toggleSeminarRegistration,
      sendChatMessage,
    }),
    [
      addComment,
      announcements,
      chatMessages,
      getAnnouncement,
      seminars,
      sendChatMessage,
      toggleSeminarRegistration,
    ],
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity(): CommunityContextValue {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within CommunityProvider.');
  }
  return context;
}
