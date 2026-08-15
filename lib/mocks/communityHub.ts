import type {
  CommunityAcademyEvent,
  CommunityAcademyGroup,
  CommunityAnnouncement,
  CommunityCompetition,
  CommunityFeedPost,
  CommunityMemberPreview,
} from '../../types/communityHub';

/** Sample academy for mock community hub (tenant-aware shape). */
export const COMMUNITY_MOCK_ACADEMY_ID = 'academy-open-mat';

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

export const COMMUNITY_MEMBERS: CommunityMemberPreview[] = [
  { id: 'm-1', name: 'Carlos B.', initials: 'CB', avatarColor: '#7C5D49', online: true },
  { id: 'm-2', name: 'Maya Chen', initials: 'MC', avatarColor: '#1857A4', online: true },
  { id: 'm-3', name: 'Jordan Silva', initials: 'JS', avatarColor: '#60378C', online: false },
  { id: 'm-4', name: 'Alex Park', initials: 'AP', avatarColor: '#704021', online: true },
  { id: 'm-5', name: 'Sam Ortiz', initials: 'SO', avatarColor: '#A82020', online: false },
  { id: 'm-6', name: 'Riley Quinn', initials: 'RQ', avatarColor: '#2E6B4F', online: true },
  { id: 'm-7', name: 'Diego Alvarez', initials: 'DA', avatarColor: '#3D4F6F', online: false },
  { id: 'm-8', name: 'Nina Torres', initials: 'NT', avatarColor: '#8B5834', online: true },
];

export const COMMUNITY_ANNOUNCEMENTS: CommunityAnnouncement[] = [
  {
    id: 'hub-ann-1',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    category: 'ACADEMY ANNOUNCEMENT',
    title: 'Professor Rivera will be out Friday.',
    description: 'Coach Silva will be covering Advanced classes.',
    imageUrl:
      'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=80',
    priority: 'important',
    authorName: 'Coach Rivera',
    createdAt: hoursAgo(1),
  },
  {
    id: 'hub-ann-2',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    category: 'ACADEMY ANNOUNCEMENT',
    title: 'Competition Team Meeting — Friday',
    description:
      'Short meeting after Advanced. Brackets and travel for the next local tournament.',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    priority: 'important',
    authorName: 'Coach Rivera',
    createdAt: hoursAgo(5),
  },
  {
    id: 'hub-ann-3',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    category: 'ACADEMY ANNOUNCEMENT',
    title: 'New mats installed in Room B',
    description: 'Room B is back online. Wipe down after open mat — shoes off the surface.',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    priority: 'normal',
    authorName: 'My Gi Staff',
    createdAt: hoursAgo(30),
  },
];

export const COMMUNITY_FEED_POSTS: CommunityFeedPost[] = [
  {
    id: 'post-1',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    memberId: 'm-1',
    authorName: 'Carlos B.',
    authorInitials: 'CB',
    avatarColor: '#7C5D49',
    content: 'Anyone going to open mat Saturday morning?',
    createdAt: hoursAgo(2),
    commentCount: 8,
    interestedCount: 12,
    interested: COMMUNITY_MEMBERS.slice(1, 4),
  },
];

export const COMMUNITY_COMPETITIONS: CommunityCompetition[] = [
  {
    id: 'comp-1',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    name: 'Central Valley Open',
    imageUrl:
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&q=80',
    startDate: '2026-10-03',
    endDate: '2026-10-04',
    location: 'Ceres, CA',
    academyAttendeeCount: 14,
    attendees: COMMUNITY_MEMBERS.slice(0, 4),
    isCompeting: false,
  },
  {
    id: 'comp-2',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    name: 'NorCal BJJ Classic',
    imageUrl:
      'https://images.unsplash.com/photo-1599058945522-28d584b6f14f?w=1200&q=80',
    startDate: '2026-11-15',
    endDate: '2026-11-15',
    location: 'Sacramento, CA',
    academyAttendeeCount: 9,
    attendees: COMMUNITY_MEMBERS.slice(2, 5),
    isCompeting: true,
  },
];

export const COMMUNITY_ACADEMY_EVENTS: CommunityAcademyEvent[] = [
  {
    id: 'evt-1',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    title: 'Gi Fundamentals Seminar',
    imageUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    dateLabel: 'AUG 30',
    monthLabel: 'AUG',
    dayLabel: '30',
    description: 'Fundamentals focus for all white & blue belts.',
    coach: 'With Coach Mendes',
    audience: 'All belts',
  },
  {
    id: 'evt-2',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    title: 'Kids Belt Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1509192678466-7df5e6c8e9d8?w=800&q=80',
    dateLabel: 'SEP 12',
    monthLabel: 'SEP',
    dayLabel: '12',
    description: 'Celebrate promotions with families.',
    audience: 'All belts welcome',
  },
  {
    id: 'evt-3',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    title: "Women's Open Mat",
    imageUrl:
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
    dateLabel: 'SEP 20',
    monthLabel: 'SEP',
    dayLabel: '20',
    description: 'Supportive rolls and positional sparring.',
    audience: 'All levels',
  },
  {
    id: 'evt-4',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    title: 'Competition Training',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    dateLabel: 'OCT 2',
    monthLabel: 'OCT',
    dayLabel: '02',
    description: 'Intensity session ahead of Central Valley Open.',
    audience: 'Competition Team',
  },
];

export const COMMUNITY_ACADEMY_GROUPS: CommunityAcademyGroup[] = [
  {
    id: 'grp-1',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    name: 'Competition Team',
    icon: 'trophy',
    memberCount: 14,
    members: COMMUNITY_MEMBERS.slice(0, 3),
  },
  {
    id: 'grp-2',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    name: '5:30 AM Crew',
    icon: 'sunny',
    memberCount: 9,
    members: COMMUNITY_MEMBERS.slice(3, 6),
  },
  {
    id: 'grp-3',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    name: "Women's BJJ",
    icon: 'heart',
    memberCount: 18,
    members: COMMUNITY_MEMBERS.slice(5, 8),
  },
  {
    id: 'grp-4',
    academyId: COMMUNITY_MOCK_ACADEMY_ID,
    name: 'Parents',
    icon: 'people',
    memberCount: 24,
    members: COMMUNITY_MEMBERS.slice(1, 4),
  },
];
