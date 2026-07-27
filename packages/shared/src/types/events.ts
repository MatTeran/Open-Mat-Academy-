export type EventType =
  | 'seminar'
  | 'competition'
  | 'holiday_closure'
  | 'promotion'
  | 'academy_bbq'
  | 'open_mat'
  | 'other';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface CoachEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  location: string;
  startAt: string;
  endAt: string;
  capacity: number | null;
  rsvpCount: number;
  waitlistCount: number;
  allowRsvp: boolean;
  academyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  type: EventType;
  location: string;
  startAt: string;
  endAt: string;
  capacity?: number | null;
  allowRsvp?: boolean;
  status?: EventStatus;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface EventRsvp {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  status: 'going' | 'waitlist' | 'declined';
  createdAt: string;
}
