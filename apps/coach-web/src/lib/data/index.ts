import {
  createAnnouncementsRepository,
  createAttendanceRepository,
  createClassesRepository,
  createCoachNotesRepository,
  createCommandCenterRepository,
  createMemberDevelopmentRepository,
  createMembersRepository,
} from '@openmat/shared/services';
import type {
  AttendanceRecord,
  CoachAnnouncement,
  CoachClass,
  CoachMemberProfile,
  CommandCenterData,
  MemberDevelopmentRecord,
  PromotionHistoryEntry,
  CompetitionProfile,
  AcademyRoleAssignment,
} from '@openmat/shared/types';

import { webFixtures } from './fixtures';

let singleton: ReturnType<typeof buildDataLayer> | null = null;

function buildDataLayer() {
  const notesRepo = createCoachNotesRepository(
    webFixtures.members.flatMap((member) => member.coachNotes),
  );

  return {
    members: createMembersRepository(webFixtures.members),
    classes: createClassesRepository(webFixtures.classes),
    attendance: createAttendanceRepository(webFixtures.attendance),
    announcements: createAnnouncementsRepository(webFixtures.announcements),
    commandCenter: createCommandCenterRepository(webFixtures.commandCenter),
    development: createMemberDevelopmentRepository(
      {
        development: webFixtures.development,
        history: webFixtures.promotionHistory,
        competition: webFixtures.competitionProfiles,
        roles: webFixtures.academyRoles,
        summaries: webFixtures.developmentSummaries,
      },
      notesRepo,
    ),
    notes: notesRepo,
    academyId: webFixtures.academyId,
  };
}

/** Process-local data layer (demo/memory). Shared repositories — not duplicated logic. */
export function getCoachWebData() {
  if (!singleton) {
    singleton = buildDataLayer();
  }
  return singleton;
}

export type CoachWebData = ReturnType<typeof buildDataLayer>;

export type {
  AttendanceRecord,
  CoachAnnouncement,
  CoachClass,
  CoachMemberProfile,
  CommandCenterData,
  MemberDevelopmentRecord,
  PromotionHistoryEntry,
  CompetitionProfile,
  AcademyRoleAssignment,
};
