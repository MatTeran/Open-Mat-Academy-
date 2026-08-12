import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createAnnouncementsRepository,
  createAttendanceRepository,
  createClassesRepository,
  createCoachNotesRepository,
  createMembersRepository,
  useAuth,
  type AttendanceRecord,
  type CheckInInput,
  type CoachAnnouncement,
  type CoachClass,
  type CoachMemberListItem,
  type CoachMemberProfile,
  type CoachNote,
  type CreateAnnouncementInput,
  type CreateClassInput,
  type CreateCoachNoteInput,
  type DashboardOverview,
  type UpdateAnnouncementInput,
  type UpdateClassInput,
} from '@openmat/shared';

import {
  buildDashboardOverview,
  COACH_ACADEMY_ID,
  MOCK_ANNOUNCEMENTS,
  MOCK_ATTENDANCE,
  MOCK_CLASSES,
  MOCK_MEMBERS,
  QUICK_ACTIONS,
  QUICK_CARDS,
  CREATE_SHEET_ACTIONS,
  MOCK_ACTIVITY,
} from '../mocks/coachData';

interface CoachDataContextValue {
  classes: CoachClass[];
  announcements: CoachAnnouncement[];
  members: CoachMemberListItem[];
  attendance: AttendanceRecord[];
  overview: DashboardOverview;
  quickCards: typeof QUICK_CARDS;
  quickActions: typeof QUICK_ACTIONS;
  createActions: typeof CREATE_SHEET_ACTIONS;
  activity: typeof MOCK_ACTIVITY;
  refresh: () => Promise<void>;
  getClass: (id: string) => CoachClass | undefined;
  getMember: (id: string) => Promise<CoachMemberProfile | null>;
  searchMembers: (query: string) => Promise<CoachMemberListItem[]>;
  getAttendanceForClass: (classId: string) => AttendanceRecord[];
  createClass: (input: CreateClassInput) => Promise<CoachClass>;
  updateClass: (id: string, input: UpdateClassInput) => Promise<CoachClass | null>;
  cancelClass: (id: string) => Promise<CoachClass | null>;
  duplicateClass: (id: string, date?: string) => Promise<CoachClass | null>;
  checkIn: (input: CheckInInput) => Promise<AttendanceRecord>;
  updateAttendanceStatus: (
    id: string,
    status: AttendanceRecord['status'],
  ) => Promise<AttendanceRecord | null>;
  createAnnouncement: (
    input: CreateAnnouncementInput,
  ) => Promise<CoachAnnouncement>;
  updateAnnouncement: (
    id: string,
    input: UpdateAnnouncementInput,
  ) => Promise<CoachAnnouncement | null>;
  publishAnnouncement: (id: string) => Promise<CoachAnnouncement | null>;
  addCoachNote: (input: CreateCoachNoteInput) => Promise<CoachNote>;
  syncMemberRank: (
    memberId: string,
    belt: CoachMemberProfile['belt'],
    stripes: CoachMemberProfile['stripes'],
  ) => void;
}

const CoachDataContext = createContext<CoachDataContextValue | null>(null);

export function CoachDataProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [classes, setClasses] = useState<CoachClass[]>(MOCK_CLASSES);
  const [announcements, setAnnouncements] =
    useState<CoachAnnouncement[]>(MOCK_ANNOUNCEMENTS);
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [memberProfiles, setMemberProfiles] =
    useState<CoachMemberProfile[]>(MOCK_MEMBERS);

  const classesRepo = useMemo(
    () => createClassesRepository(MOCK_CLASSES),
    [],
  );
  const attendanceRepo = useMemo(
    () => createAttendanceRepository(MOCK_ATTENDANCE),
    [],
  );
  const announcementsRepo = useMemo(
    () => createAnnouncementsRepository(MOCK_ANNOUNCEMENTS),
    [],
  );
  const membersRepo = useMemo(
    () => createMembersRepository(MOCK_MEMBERS),
    [],
  );
  const notesRepo = useMemo(
    () =>
      createCoachNotesRepository(
        MOCK_MEMBERS.flatMap((member) => member.coachNotes),
      ),
    [],
  );

  const overview = useMemo(
    () => buildDashboardOverview(classes, attendance, user?.fullName),
    [attendance, classes, user?.fullName],
  );

  const members = useMemo<CoachMemberListItem[]>(
    () =>
      memberProfiles.map((profile) => ({
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        belt: profile.belt,
        stripes: profile.stripes,
        membershipStatus: profile.membershipStatus,
        lastAttendedAt: profile.recentClasses[0]?.date ?? null,
      })),
    [memberProfiles],
  );

  const quickCards = useMemo(
    () =>
      QUICK_CARDS.map((card) => {
        if (card.id === 'todaysClasses') {
          return { ...card, value: String(overview.todaysClasses) };
        }
        if (card.id === 'attendance') {
          return { ...card, value: String(overview.checkedIn) };
        }
        if (card.id === 'announcements') {
          return {
            ...card,
            value: String(
              announcements.filter((item) => item.status === 'published').length,
            ),
          };
        }
        return card;
      }),
    [announcements, overview.checkedIn, overview.todaysClasses],
  );

  const refresh = useCallback(async () => {
    const [nextClasses, nextAnnouncements, nextMembers] = await Promise.all([
      classesRepo.list(),
      announcementsRepo.list(COACH_ACADEMY_ID),
      membersRepo.listProfiles(),
    ]);
    setClasses(nextClasses);
    setAnnouncements(nextAnnouncements);
    // Sample mocks stay; live Supabase signups are merged inside the repo.
    setMemberProfiles(nextMembers);
  }, [announcementsRepo, classesRepo, membersRepo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getClass = useCallback(
    (id: string) => classes.find((item) => item.id === id),
    [classes],
  );

  const getMember = useCallback(
    async (id: string) => {
      const fromState = memberProfiles.find((profile) => profile.id === id);
      const profile = fromState ?? (await membersRepo.getById(id));
      if (!profile) {
        return null;
      }
      const notes = await notesRepo.listByMember(id);
      return { ...profile, coachNotes: notes };
    },
    [memberProfiles, membersRepo, notesRepo],
  );

  const searchMembers = useCallback(
    async (query: string) => {
      const needle = query.trim().toLowerCase();
      if (!needle) {
        return members;
      }
      return members.filter(
        (item) =>
          item.fullName.toLowerCase().includes(needle) ||
          item.email.toLowerCase().includes(needle),
      );
    },
    [members],
  );

  const getAttendanceForClass = useCallback(
    (classId: string) => attendance.filter((item) => item.classId === classId),
    [attendance],
  );

  const createClass = useCallback(
    async (input: CreateClassInput) => {
      const created = await classesRepo.create(input, {
        instructorId: user?.id ?? 'guest-coach-user',
        academyId: COACH_ACADEMY_ID,
      });
      setClasses((current) => [...current, created]);
      return created;
    },
    [classesRepo, user?.id],
  );

  const updateClass = useCallback(
    async (id: string, input: UpdateClassInput) => {
      const updated = await classesRepo.update(id, input);
      if (updated) {
        setClasses((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [classesRepo],
  );

  const cancelClass = useCallback(
    async (id: string) => {
      const cancelled = await classesRepo.cancel(id);
      if (cancelled) {
        setClasses((current) =>
          current.map((item) => (item.id === id ? cancelled : item)),
        );
      }
      return cancelled;
    },
    [classesRepo],
  );

  const duplicateClass = useCallback(
    async (id: string, date?: string) => {
      const duplicated = await classesRepo.duplicate(id, date);
      if (duplicated) {
        setClasses((current) => [...current, duplicated]);
      }
      return duplicated;
    },
    [classesRepo],
  );

  const checkIn = useCallback(
    async (input: CheckInInput) => {
      const record = await attendanceRepo.checkIn(input);
      setAttendance((current) => {
        const index = current.findIndex((item) => item.id === record.id);
        if (index >= 0) {
          return [
            ...current.slice(0, index),
            record,
            ...current.slice(index + 1),
          ];
        }
        const byMember = current.findIndex(
          (item) =>
            item.classId === input.classId &&
            ((input.memberId && item.memberId === input.memberId) ||
              item.memberName.toLowerCase() === input.memberName.toLowerCase()),
        );
        if (byMember >= 0) {
          return [
            ...current.slice(0, byMember),
            record,
            ...current.slice(byMember + 1),
          ];
        }
        return [...current, record];
      });
      setClasses((current) =>
        current.map((item) =>
          item.id === input.classId
            ? {
                ...item,
                checkedInCount: item.checkedInCount + 1,
                firstTimeVisitorCount:
                  item.firstTimeVisitorCount + (input.isFirstVisit ? 1 : 0),
              }
            : item,
        ),
      );
      return record;
    },
    [attendanceRepo],
  );

  const updateAttendanceStatus = useCallback(
    async (id: string, status: AttendanceRecord['status']) => {
      const updated = await attendanceRepo.updateStatus(id, status);
      if (updated) {
        setAttendance((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [attendanceRepo],
  );

  const createAnnouncement = useCallback(
    async (input: CreateAnnouncementInput) => {
      const created = await announcementsRepo.create(input, {
        id: user?.id ?? 'guest-coach-user',
        name: user?.fullName ?? 'Coach',
        academyId: COACH_ACADEMY_ID,
      });
      setAnnouncements((current) => [created, ...current]);
      return created;
    },
    [announcementsRepo, user?.fullName, user?.id],
  );

  const updateAnnouncement = useCallback(
    async (id: string, input: UpdateAnnouncementInput) => {
      const updated = await announcementsRepo.update(id, input);
      if (updated) {
        setAnnouncements((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      }
      return updated;
    },
    [announcementsRepo],
  );

  const publishAnnouncement = useCallback(
    async (id: string) => {
      const published = await announcementsRepo.publish(id);
      if (published) {
        setAnnouncements((current) =>
          current.map((item) => (item.id === id ? published : item)),
        );
      }
      return published;
    },
    [announcementsRepo],
  );

  const addCoachNote = useCallback(
    async (input: CreateCoachNoteInput) => {
      const note = await notesRepo.create(input, {
        id: user?.id ?? 'guest-coach-user',
        name: user?.fullName ?? 'Coach',
      });
      setMemberProfiles((current) =>
        current.map((profile) =>
          profile.id === input.memberId
            ? { ...profile, coachNotes: [note, ...profile.coachNotes] }
            : profile,
        ),
      );
      return note;
    },
    [notesRepo, user?.fullName, user?.id],
  );

  const syncMemberRank = useCallback(
    (
      memberId: string,
      belt: CoachMemberProfile['belt'],
      stripes: CoachMemberProfile['stripes'],
    ) => {
      setMemberProfiles((current) =>
        current.map((profile) =>
          profile.id === memberId
            ? {
                ...profile,
                belt,
                stripes,
                journey: { ...profile.journey, belt, stripes },
              }
            : profile,
        ),
      );
    },
    [],
  );

  const value = useMemo<CoachDataContextValue>(
    () => ({
      classes,
      announcements,
      members,
      attendance,
      overview,
      quickCards,
      quickActions: QUICK_ACTIONS,
      createActions: CREATE_SHEET_ACTIONS,
      activity: MOCK_ACTIVITY,
      refresh,
      getClass,
      getMember,
      searchMembers,
      getAttendanceForClass,
      createClass,
      updateClass,
      cancelClass,
      duplicateClass,
      checkIn,
      updateAttendanceStatus,
      createAnnouncement,
      updateAnnouncement,
      publishAnnouncement,
      addCoachNote,
      syncMemberRank,
    }),
    [
      addCoachNote,
      announcements,
      attendance,
      cancelClass,
      checkIn,
      classes,
      createAnnouncement,
      createClass,
      duplicateClass,
      getAttendanceForClass,
      getClass,
      getMember,
      members,
      overview,
      publishAnnouncement,
      quickCards,
      refresh,
      searchMembers,
      syncMemberRank,
      updateAnnouncement,
      updateAttendanceStatus,
      updateClass,
    ],
  );

  return (
    <CoachDataContext.Provider value={value}>
      {children}
    </CoachDataContext.Provider>
  );
}

export function useCoachData(): CoachDataContextValue {
  const context = useContext(CoachDataContext);
  if (!context) {
    throw new Error('useCoachData must be used within CoachDataProvider');
  }
  return context;
}
