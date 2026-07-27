import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  createAchievementsRepository,
  createChallengesRepository,
  createCommandCenterRepository,
  createEventsRepository,
  createJourneyRepository,
  createMediaRepository,
  createNotificationsRepository,
  createTechniquesRepository,
  useAuth,
  type CoachAchievement,
  type CoachChallenge,
  type CoachEvent,
  type CommandCenterData,
  type CreateAchievementInput,
  type CreateChallengeInput,
  type CreateEventInput,
  type CreateMediaAlbumInput,
  type CreateMediaItemInput,
  type CreateNotificationDraftInput,
  type CreateTechniqueInput,
  type JourneyOverview,
  type MediaAlbum,
  type MediaItem,
  type NotificationDraft,
  type Technique,
  type UpdateAchievementInput,
  type UpdateChallengeInput,
  type UpdateEventInput,
  type UpdateTechniqueInput,
} from '@openmat/shared';

import {
  MOCK_ACHIEVEMENTS,
  MOCK_CHALLENGES,
  MOCK_COMMAND_CENTER,
  MOCK_EVENTS,
  MOCK_JOURNEY,
  MOCK_MEDIA_ALBUMS,
  MOCK_MEDIA_ITEMS,
  MOCK_NOTIFICATIONS,
  MOCK_TECHNIQUES,
} from '../mocks/phase2Data';

interface Phase2DataContextValue {
  techniques: Technique[];
  challenges: CoachChallenge[];
  achievements: CoachAchievement[];
  events: CoachEvent[];
  albums: MediaAlbum[];
  mediaItems: MediaItem[];
  notifications: NotificationDraft[];
  journey: JourneyOverview;
  commandCenter: CommandCenterData;
  createTechnique: (input: CreateTechniqueInput) => Promise<Technique>;
  updateTechnique: (
    id: string,
    input: UpdateTechniqueInput,
  ) => Promise<Technique | null>;
  toggleTechniqueFavorite: (id: string) => Promise<Technique | null>;
  createChallenge: (input: CreateChallengeInput) => Promise<CoachChallenge>;
  updateChallenge: (
    id: string,
    input: UpdateChallengeInput,
  ) => Promise<CoachChallenge | null>;
  createAchievement: (
    input: CreateAchievementInput,
  ) => Promise<CoachAchievement>;
  updateAchievement: (
    id: string,
    input: UpdateAchievementInput,
  ) => Promise<CoachAchievement | null>;
  createEvent: (input: CreateEventInput) => Promise<CoachEvent>;
  updateEvent: (
    id: string,
    input: UpdateEventInput,
  ) => Promise<CoachEvent | null>;
  createAlbum: (input: CreateMediaAlbumInput) => Promise<MediaAlbum>;
  createMediaItem: (input: CreateMediaItemInput) => Promise<MediaItem>;
  createNotification: (
    input: CreateNotificationDraftInput,
  ) => Promise<NotificationDraft>;
  getJourneyMember: (memberId: string) => JourneyOverview['snapshots'][number] | null;
}

const Phase2DataContext = createContext<Phase2DataContextValue | null>(null);

export function Phase2DataProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [techniques, setTechniques] = useState(MOCK_TECHNIQUES);
  const [challenges, setChallenges] = useState(MOCK_CHALLENGES);
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [albums, setAlbums] = useState(MOCK_MEDIA_ALBUMS);
  const [mediaItems, setMediaItems] = useState(MOCK_MEDIA_ITEMS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [journey] = useState(MOCK_JOURNEY);
  const [commandCenter] = useState(MOCK_COMMAND_CENTER);

  const techniquesRepo = useMemo(
    () => createTechniquesRepository(MOCK_TECHNIQUES),
    [],
  );
  const challengesRepo = useMemo(
    () => createChallengesRepository(MOCK_CHALLENGES),
    [],
  );
  const achievementsRepo = useMemo(
    () => createAchievementsRepository(MOCK_ACHIEVEMENTS),
    [],
  );
  const eventsRepo = useMemo(() => createEventsRepository(MOCK_EVENTS), []);
  const mediaRepo = useMemo(
    () =>
      createMediaRepository({
        albums: MOCK_MEDIA_ALBUMS,
        items: MOCK_MEDIA_ITEMS,
      }),
    [],
  );
  const notificationsRepo = useMemo(
    () => createNotificationsRepository(MOCK_NOTIFICATIONS),
    [],
  );
  const journeyRepo = useMemo(
    () => createJourneyRepository(MOCK_JOURNEY),
    [],
  );
  const commandRepo = useMemo(
    () => createCommandCenterRepository(MOCK_COMMAND_CENTER),
    [],
  );

  void journeyRepo;
  void commandRepo;

  const author = useMemo(
    () => ({
      id: user?.id ?? 'guest-coach-user',
      name: user?.fullName ?? 'Coach',
      academyId: 'academy-open-mat',
    }),
    [user?.fullName, user?.id],
  );

  const createTechnique = useCallback(
    async (input: CreateTechniqueInput) => {
      const created = await techniquesRepo.create(input, author);
      setTechniques((current) => [created, ...current]);
      return created;
    },
    [author, techniquesRepo],
  );

  const updateTechnique = useCallback(
    async (id: string, input: UpdateTechniqueInput) => {
      const updated = await techniquesRepo.update(id, input);
      if (updated) {
        setTechniques((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [techniquesRepo],
  );

  const toggleTechniqueFavorite = useCallback(
    async (id: string) => {
      const updated = await techniquesRepo.toggleFavorite(id);
      if (updated) {
        setTechniques((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [techniquesRepo],
  );

  const createChallenge = useCallback(
    async (input: CreateChallengeInput) => {
      const created = await challengesRepo.create(input, {
        academyId: author.academyId,
      });
      setChallenges((current) => [created, ...current]);
      return created;
    },
    [author.academyId, challengesRepo],
  );

  const updateChallenge = useCallback(
    async (id: string, input: UpdateChallengeInput) => {
      const updated = await challengesRepo.update(id, input);
      if (updated) {
        setChallenges((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [challengesRepo],
  );

  const createAchievement = useCallback(
    async (input: CreateAchievementInput) => {
      const created = await achievementsRepo.create(input, {
        academyId: author.academyId,
      });
      setAchievements((current) => [created, ...current]);
      return created;
    },
    [achievementsRepo, author.academyId],
  );

  const updateAchievement = useCallback(
    async (id: string, input: UpdateAchievementInput) => {
      const updated = await achievementsRepo.update(id, input);
      if (updated) {
        setAchievements((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [achievementsRepo],
  );

  const createEvent = useCallback(
    async (input: CreateEventInput) => {
      const created = await eventsRepo.create(input, {
        academyId: author.academyId,
      });
      setEvents((current) => [created, ...current]);
      return created;
    },
    [author.academyId, eventsRepo],
  );

  const updateEvent = useCallback(
    async (id: string, input: UpdateEventInput) => {
      const updated = await eventsRepo.update(id, input);
      if (updated) {
        setEvents((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [eventsRepo],
  );

  const createAlbum = useCallback(
    async (input: CreateMediaAlbumInput) => {
      const created = await mediaRepo.createAlbum(input, {
        academyId: author.academyId,
      });
      setAlbums((current) => [created, ...current]);
      return created;
    },
    [author.academyId, mediaRepo],
  );

  const createMediaItem = useCallback(
    async (input: CreateMediaItemInput) => {
      const created = await mediaRepo.createItem(input, {
        id: author.name,
        academyId: author.academyId,
      });
      setMediaItems((current) => [created, ...current]);
      if (created.albumId) {
        setAlbums((current) =>
          current.map((album) =>
            album.id === created.albumId
              ? { ...album, itemCount: album.itemCount + 1 }
              : album,
          ),
        );
      }
      return created;
    },
    [author.academyId, author.name, mediaRepo],
  );

  const createNotification = useCallback(
    async (input: CreateNotificationDraftInput) => {
      const created = await notificationsRepo.create(input);
      setNotifications((current) => [created, ...current]);
      return created;
    },
    [notificationsRepo],
  );

  const getJourneyMember = useCallback(
    (memberId: string) =>
      journey.snapshots.find((item) => item.memberId === memberId) ?? null,
    [journey.snapshots],
  );

  const value = useMemo<Phase2DataContextValue>(
    () => ({
      techniques,
      challenges,
      achievements,
      events,
      albums,
      mediaItems,
      notifications,
      journey,
      commandCenter,
      createTechnique,
      updateTechnique,
      toggleTechniqueFavorite,
      createChallenge,
      updateChallenge,
      createAchievement,
      updateAchievement,
      createEvent,
      updateEvent,
      createAlbum,
      createMediaItem,
      createNotification,
      getJourneyMember,
    }),
    [
      achievements,
      albums,
      challenges,
      commandCenter,
      createAchievement,
      createAlbum,
      createChallenge,
      createEvent,
      createMediaItem,
      createNotification,
      createTechnique,
      events,
      getJourneyMember,
      journey,
      mediaItems,
      notifications,
      techniques,
      toggleTechniqueFavorite,
      updateAchievement,
      updateChallenge,
      updateEvent,
      updateTechnique,
    ],
  );

  return (
    <Phase2DataContext.Provider value={value}>
      {children}
    </Phase2DataContext.Provider>
  );
}

export function usePhase2Data(): Phase2DataContextValue {
  const context = useContext(Phase2DataContext);
  if (!context) {
    throw new Error('usePhase2Data must be used within Phase2DataProvider');
  }
  return context;
}
