export interface AcademyPulseMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
  tint: string;
  trendLabel?: string;
}

export type PulseInsightRange = '7d' | '30d' | '90d';

export type PulseInsightClassFilter =
  | 'all'
  | 'gi'
  | 'no_gi'
  | 'kids'
  | 'open_mat';

export type PulseInsightBeltFilter =
  | 'all'
  | 'white'
  | 'blue'
  | 'purple'
  | 'brown'
  | 'black';

export interface PulseChartPoint {
  label: string;
  value: number;
}

export interface PulseInsightChartSet {
  summaryValue: string;
  summaryHelper: string;
  trendLabel: string;
  line: PulseChartPoint[];
  bars: PulseChartPoint[];
  lineTitle: string;
  barsTitle: string;
}

export interface PulseInsightRow {
  id: string;
  label: string;
  value: string;
  helper?: string;
  classType?: Exclude<PulseInsightClassFilter, 'all'>;
  belt?: Exclude<PulseInsightBeltFilter, 'all'>;
  tint?: string;
}

export interface AcademyPulseInsight {
  pulseId: string;
  title: string;
  description: string;
  icon: string;
  tint: string;
  supportsClassFilter: boolean;
  supportsBeltFilter: boolean;
  charts: Record<PulseInsightRange, PulseInsightChartSet>;
  rows: PulseInsightRow[];
  takeaways: string[];
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
  pulseInsights: AcademyPulseInsight[];
}
