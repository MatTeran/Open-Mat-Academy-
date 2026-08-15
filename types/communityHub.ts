/**
 * Tenant-aware Community hub types (mock-first; map cleanly to future backend).
 */

export type CommunityPriority = 'normal' | 'important' | 'urgent';

export interface CommunityAnnouncement {
  id: string;
  academyId: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  priority: CommunityPriority;
  authorName: string;
  createdAt: string;
  expiresAt?: string;
}

export interface CommunityMemberPreview {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  online?: boolean;
}

export interface CommunityFeedPost {
  id: string;
  academyId: string;
  memberId: string;
  authorName: string;
  authorInitials: string;
  avatarColor: string;
  content: string;
  createdAt: string;
  commentCount: number;
  interestedCount: number;
  interested: CommunityMemberPreview[];
}

export interface CommunityCompetition {
  id: string;
  academyId: string;
  name: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  location: string;
  academyAttendeeCount: number;
  attendees: CommunityMemberPreview[];
  isCompeting: boolean;
}

export interface CommunityAcademyEvent {
  id: string;
  academyId: string;
  title: string;
  imageUrl: string;
  dateLabel: string;
  monthLabel: string;
  dayLabel: string;
  description: string;
  coach?: string;
  audience?: string;
}

export interface CommunityAcademyGroup {
  id: string;
  academyId: string;
  name: string;
  imageUrl?: string;
  icon: 'trophy' | 'sunny' | 'people' | 'heart';
  memberCount: number;
  members: CommunityMemberPreview[];
}
