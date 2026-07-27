export interface AcademyPulseMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
  tint: string;
  trendLabel?: string;
}

export type AttentionPriority = 'high' | 'medium' | 'low';

export type AttentionActionId =
  | 'viewMember'
  | 'messageMember'
  | 'manageClass'
  | 'approveWaitlist'
  | 'publishAnnouncement'
  | 'reviewWaiver'
  | 'viewEvent';

export interface AttentionItem {
  id: string;
  title: string;
  subtitle: string;
  priority: AttentionPriority;
  actionId: AttentionActionId;
  actionLabel: string;
  entityId?: string;
  icon: string;
  tint: string;
}

export interface MomentumCard {
  id: string;
  memberId: string;
  memberName: string;
  headline: string;
  detail: string;
  progressLabel: string;
  progressPercent: number;
  icon: string;
  tint: string;
}

export interface LiveFeedItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  category:
    | 'check_in'
    | 'challenge'
    | 'achievement'
    | 'member'
    | 'technique'
    | 'class'
    | 'announcement'
    | 'event';
  icon: string;
  tint: string;
}

export interface UpcomingCommandEvent {
  id: string;
  title: string;
  whenLabel: string;
  typeLabel: string;
  entityKind: 'class' | 'event';
  entityId: string;
}

export type QuickCommandId =
  | 'createAnnouncement'
  | 'startCheckIn'
  | 'createClass'
  | 'uploadTechnique'
  | 'createChallenge'
  | 'createEvent'
  | 'sendNotification'
  | 'manageMembers';

export interface QuickCommand {
  id: QuickCommandId;
  label: string;
  icon: string;
  tint: string;
}

export interface AiInsightCard {
  id: string;
  suggestion: string;
  confidenceLabel: string;
}

export interface AnalyticsSnapshot {
  id: string;
  label: string;
  value: string;
  helper: string;
  points: number[];
  tint: string;
}

export interface CommandCenterData {
  pulse: AcademyPulseMetric[];
  attention: AttentionItem[];
  momentum: MomentumCard[];
  liveFeed: LiveFeedItem[];
  upcoming: UpcomingCommandEvent[];
  quickCommands: QuickCommand[];
  aiInsights: AiInsightCard[];
  snapshots: AnalyticsSnapshot[];
}
