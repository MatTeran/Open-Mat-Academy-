import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  CheckIn: { classId?: string } | undefined;
  AnnouncementForm: { announcementId?: string } | undefined;
  ClassForm: { classId?: string } | undefined;
};

export type ScheduleStackParamList = {
  ScheduleHome: undefined;
  ClassDetail: { classId: string };
  ClassForm: { classId?: string } | undefined;
  CheckIn: { classId?: string } | undefined;
};

export type MembersStackParamList = {
  MembersHome: undefined;
  MemberDetail: { memberId: string };
  JourneyMember: { memberId: string };
  AddStripe: { memberId: string };
  PromoteBelt: { memberId: string };
  CompetitionProfileEdit: { memberId: string };
};

export type MoreStackParamList = {
  MoreHome: undefined;
  Announcements: undefined;
  AnnouncementForm: { announcementId?: string } | undefined;
  CommandCenter: undefined;
  PulseInsight: { pulseId: string };
  Techniques: undefined;
  TechniqueForm: { techniqueId?: string } | undefined;
  Challenges: undefined;
  ChallengeForm: { challengeId?: string } | undefined;
  Achievements: undefined;
  AchievementForm: { achievementId?: string } | undefined;
  Events: undefined;
  EventForm: { eventId?: string } | undefined;
  MediaLibrary: undefined;
  MediaUpload: undefined;
  Journey: undefined;
  JourneyMember: { memberId: string };
  Notifications: undefined;
  NotificationForm: undefined;
};

export type MainTabParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  Schedule: NavigatorScreenParams<ScheduleStackParamList>;
  Members: NavigatorScreenParams<MembersStackParamList>;
  Create: undefined;
  More: NavigatorScreenParams<MoreStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  CreateModal: undefined;
};
