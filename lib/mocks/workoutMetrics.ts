/**
 * Baseline weekly mat volume for Progress chart demo.
 * Live logged sessions override the current week (and any week with data).
 */
export const MOCK_WEEKLY_METRIC_BASELINE: Array<{
  sessions: number;
  matMinutes: number;
  rounds: number;
  giSessions: number;
  noGiSessions: number;
}> = [
  { sessions: 2, matMinutes: 150, rounds: 8, giSessions: 1, noGiSessions: 1 },
  { sessions: 3, matMinutes: 210, rounds: 14, giSessions: 2, noGiSessions: 1 },
  { sessions: 1, matMinutes: 75, rounds: 4, giSessions: 1, noGiSessions: 0 },
  { sessions: 4, matMinutes: 300, rounds: 20, giSessions: 2, noGiSessions: 2 },
  { sessions: 2, matMinutes: 180, rounds: 10, giSessions: 1, noGiSessions: 1 },
  { sessions: 3, matMinutes: 225, rounds: 15, giSessions: 2, noGiSessions: 1 },
  { sessions: 2, matMinutes: 160, rounds: 9, giSessions: 0, noGiSessions: 2 },
  { sessions: 4, matMinutes: 280, rounds: 18, giSessions: 3, noGiSessions: 1 },
  { sessions: 3, matMinutes: 240, rounds: 16, giSessions: 2, noGiSessions: 1 },
  { sessions: 1, matMinutes: 90, rounds: 5, giSessions: 1, noGiSessions: 0 },
  { sessions: 3, matMinutes: 200, rounds: 12, giSessions: 1, noGiSessions: 2 },
  { sessions: 2, matMinutes: 165, rounds: 11, giSessions: 1, noGiSessions: 1 },
];
