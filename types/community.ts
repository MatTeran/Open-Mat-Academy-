export interface AnnouncementComment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  pinned?: boolean;
  comments: AnnouncementComment[];
}

export interface MemberBirthday {
  id: string;
  name: string;
  dateLabel: string; // e.g. "Jul 28"
  belt?: string;
}

export interface Seminar {
  id: string;
  title: string;
  instructor: string;
  dateLabel: string;
  timeLabel: string;
  priceLabel: string;
  spotsLeft: number;
  registered: boolean;
}

export interface OpenMatSession {
  id: string;
  title: string;
  dayLabel: string;
  timeLabel: string;
  giType: 'Gi' | 'No-Gi' | 'Gi / No-Gi';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  mine?: boolean;
}
