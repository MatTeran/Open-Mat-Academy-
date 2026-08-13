import type {
  Announcement,
  ChatMessage,
  MemberBirthday,
  OpenMatSession,
  Seminar,
} from '../../types/community';

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Competition Team Meeting — Friday',
    body: 'All competition team athletes: short meeting after Friday Advanced class. We’ll cover the next local tournament brackets and travel plan.',
    authorName: 'Coach Rivera',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    pinned: true,
    comments: [
      {
        id: 'c-1',
        authorName: 'Jordan Silva',
        body: 'I’ll be there. Bringing notes from last open mat.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: 'c-2',
        authorName: 'Maya Chen',
        body: 'Can we also talk weighing in strategy?',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
  },
  {
    id: 'ann-2',
    title: 'New mats installed in Room B',
    body: 'Room B is back online with fresh mats. Please wipe down after open mat and keep shoes off the surface.',
    authorName: 'My Gi Staff',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    comments: [
      {
        id: 'c-3',
        authorName: 'Alex Park',
        body: 'Looks clean. Thanks team.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: 'ann-3',
    title: 'Gi fundamentals — early morning reminder',
    body: 'Monday / Wednesday / Friday 5:30 AM GI still requires Band App roll call. Doors open at 5:15.',
    authorName: 'Coach Mendes',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
    comments: [],
  },
];

export const BIRTHDAYS: MemberBirthday[] = [
  { id: 'b-1', name: 'Diego Alvarez', dateLabel: 'Jul 26', belt: 'Purple' },
  { id: 'b-2', name: 'Sam Ortiz', dateLabel: 'Jul 28', belt: 'Blue' },
  { id: 'b-3', name: 'Riley Quinn', dateLabel: 'Jul 30', belt: 'White' },
];

export const SEMINARS: Seminar[] = [
  {
    id: 's-1',
    title: 'Guard Retention Intensive',
    instructor: 'Guest: Prof. Costa',
    dateLabel: 'Sat · Aug 9',
    timeLabel: '1:00 – 3:00 PM',
    priceLabel: '$60',
    spotsLeft: 12,
    registered: false,
  },
  {
    id: 's-2',
    title: 'Leg Entanglements for Competitors',
    instructor: 'Coach Rivera',
    dateLabel: 'Sun · Aug 17',
    timeLabel: '11:00 AM – 1:00 PM',
    priceLabel: '$45',
    spotsLeft: 8,
    registered: true,
  },
];

export const OPEN_MATS: OpenMatSession[] = [
  {
    id: 'om-1',
    title: 'Saturday Open Mat',
    dayLabel: 'Saturday',
    timeLabel: '10:00 AM – 12:00 PM',
    giType: 'Gi / No-Gi',
    notes: 'All belts welcome',
  },
  {
    id: 'om-2',
    title: 'Sunday Open Mat',
    dayLabel: 'Sunday',
    timeLabel: '10:00 AM – 12:00 PM',
    giType: 'Gi',
    notes: 'Flow rolls preferred before noon',
  },
];

export const TEAM_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    authorName: 'Coach Silva',
    body: 'Who’s rolling Saturday open mat?',
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: 'm-2',
    authorName: 'Jordan Silva',
    body: 'I’ll be there around 10:15.',
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    mine: true,
  },
  {
    id: 'm-3',
    authorName: 'Maya Chen',
    body: 'Same — bringing a spare gi if anyone needs one.',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'm-4',
    authorName: 'Coach Rivera',
    body: 'Competition film review after open mat for those interested.',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
];

export function getLatestAnnouncement(
  announcements: Announcement[] = ANNOUNCEMENTS,
): Announcement | undefined {
  return [...announcements].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  )[0];
}
