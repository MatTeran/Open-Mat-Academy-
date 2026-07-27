export type BeltRank =
  | 'white'
  | 'blue'
  | 'purple'
  | 'brown'
  | 'black';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  academyId: string | null;
  avatarUrl: string | null;
  createdAt: string;
}
