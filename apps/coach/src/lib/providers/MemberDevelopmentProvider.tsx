import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  createCoachNotesRepository,
  createMemberDevelopmentRepository,
  useAuth,
  type AddStripeInput,
  type CoachNote,
  type CreateCoachNoteInput,
  type MemberDevelopmentBundle,
  type PromoteBeltInput,
  type SetAcademyRolesInput,
  type UpdateCompetitionProfileInput,
} from '@openmat/shared';

import { COACH_ACADEMY_ID } from '../mocks/coachData';
import {
  MOCK_ACADEMY_ROLES,
  MOCK_COMPETITION_PROFILES,
  MOCK_DEVELOPMENT_SUMMARIES,
  MOCK_MEMBER_DEVELOPMENT,
  MOCK_PROMOTION_HISTORY,
} from '../mocks/memberDevelopmentData';
import { MOCK_MEMBERS } from '../mocks/coachData';

interface MemberDevelopmentContextValue {
  getBundle: (memberId: string) => Promise<MemberDevelopmentBundle | null>;
  addStripe: (input: AddStripeInput) => Promise<MemberDevelopmentBundle>;
  promoteBelt: (input: PromoteBeltInput) => Promise<MemberDevelopmentBundle>;
  updateCompetitionProfile: (
    input: UpdateCompetitionProfileInput,
  ) => Promise<void>;
  setAcademyRoles: (input: SetAcademyRolesInput) => Promise<void>;
  addNote: (input: CreateCoachNoteInput) => Promise<CoachNote>;
  updateNote: (id: string, body: string) => Promise<CoachNote | null>;
  removeNote: (id: string) => Promise<boolean>;
  searchNotes: (memberId: string, query: string) => Promise<CoachNote[]>;
  /** Local revision bump so detail screens can refresh. */
  revision: number;
}

const MemberDevelopmentContext =
  createContext<MemberDevelopmentContextValue | null>(null);

export function MemberDevelopmentProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [revision, setRevision] = useState(0);

  const notesRepo = useMemo(
    () =>
      createCoachNotesRepository(
        MOCK_MEMBERS.flatMap((member) => member.coachNotes),
      ),
    [],
  );

  const developmentRepo = useMemo(
    () =>
      createMemberDevelopmentRepository(
        {
          development: MOCK_MEMBER_DEVELOPMENT,
          history: MOCK_PROMOTION_HISTORY,
          competition: MOCK_COMPETITION_PROFILES,
          roles: MOCK_ACADEMY_ROLES,
          summaries: MOCK_DEVELOPMENT_SUMMARIES,
        },
        notesRepo,
      ),
    [notesRepo],
  );

  const author = useMemo(
    () => ({
      id: user?.id ?? 'guest-coach-user',
      name: user?.fullName ?? 'Coach Rivera',
      academyId: COACH_ACADEMY_ID,
    }),
    [user?.fullName, user?.id],
  );

  const bump = useCallback(() => {
    setRevision((value) => value + 1);
  }, []);

  const getBundle = useCallback(
    async (memberId: string) => developmentRepo.getByMemberId(memberId),
    [developmentRepo],
  );

  const addStripe = useCallback(
    async (input: AddStripeInput) => {
      const bundle = await developmentRepo.addStripe(input, author);
      bump();
      return bundle;
    },
    [author, bump, developmentRepo],
  );

  const promoteBelt = useCallback(
    async (input: PromoteBeltInput) => {
      const bundle = await developmentRepo.promoteBelt(input, author);
      bump();
      return bundle;
    },
    [author, bump, developmentRepo],
  );

  const updateCompetitionProfile = useCallback(
    async (input: UpdateCompetitionProfileInput) => {
      await developmentRepo.updateCompetitionProfile(input);
      bump();
    },
    [bump, developmentRepo],
  );

  const setAcademyRoles = useCallback(
    async (input: SetAcademyRolesInput) => {
      await developmentRepo.setAcademyRoles(input, author);
      bump();
    },
    [author, bump, developmentRepo],
  );

  const addNote = useCallback(
    async (input: CreateCoachNoteInput) => {
      const note = await notesRepo.create(input, {
        id: author.id,
        name: author.name,
        academyId: author.academyId,
      });
      bump();
      return note;
    },
    [author.academyId, author.id, author.name, bump, notesRepo],
  );

  const updateNote = useCallback(
    async (id: string, body: string) => {
      const note = await notesRepo.update(id, body);
      bump();
      return note;
    },
    [bump, notesRepo],
  );

  const removeNote = useCallback(
    async (id: string) => {
      const removed = await notesRepo.remove(id);
      bump();
      return removed;
    },
    [bump, notesRepo],
  );

  const searchNotes = useCallback(
    async (memberId: string, query: string) =>
      notesRepo.listByMember(memberId, query),
    [notesRepo],
  );

  const value = useMemo(
    () => ({
      getBundle,
      addStripe,
      promoteBelt,
      updateCompetitionProfile,
      setAcademyRoles,
      addNote,
      updateNote,
      removeNote,
      searchNotes,
      revision,
    }),
    [
      addNote,
      addStripe,
      getBundle,
      promoteBelt,
      removeNote,
      revision,
      searchNotes,
      setAcademyRoles,
      updateCompetitionProfile,
      updateNote,
    ],
  );

  return (
    <MemberDevelopmentContext.Provider value={value}>
      {children}
    </MemberDevelopmentContext.Provider>
  );
}

export function useMemberDevelopment(): MemberDevelopmentContextValue {
  const context = useContext(MemberDevelopmentContext);
  if (!context) {
    throw new Error(
      'useMemberDevelopment must be used within MemberDevelopmentProvider',
    );
  }
  return context;
}
