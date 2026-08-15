import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutDetails: { workoutId?: string } | undefined;
  YourGame: undefined;
  TechniqueDetail: { techniqueId: string };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Journey: undefined;
  AchievementGallery: undefined;
  LocalEvents: undefined;
};

export type CommunityStackParamList = {
  CommunityHome: undefined;
  AnnouncementDetail: { announcementId: string };
  TeamChat: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Membership: undefined;
  BeltRank: undefined;
  PaymentMethod: undefined;
  Attendance: undefined;
  Settings: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  LinkedFamily: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Schedule: undefined;
  Community: NavigatorScreenParams<CommunityStackParamList> | undefined;
  WorkoutLog: NavigatorScreenParams<WorkoutStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

/** High-level root routes — detailed params live in navigation/types.ts */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
