/**
 * Time-aware greeting for the Home dashboard.
 */
export function getGreeting(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

export function getFirstName(fullName?: string | null): string {
  if (!fullName?.trim()) {
    return 'Athlete';
  }
  return fullName.trim().split(/\s+/)[0] ?? 'Athlete';
}

/**
 * Motivational supporting line under the Home greeting.
 * Driven by weekly class progress and streak — not belt/promotion state.
 */
export function getMotivationalMessage(input: {
  weeklyClassesCompleted: number;
  weeklyClassGoal: number;
  currentStreak?: number;
}): string {
  const completed = Math.max(0, input.weeklyClassesCompleted);
  const goal = Math.max(1, input.weeklyClassGoal);
  const remaining = Math.max(0, goal - completed);
  const streak = Math.max(0, input.currentStreak ?? 0);

  if (remaining === 0) {
    return 'Weekly goal complete. Keep the momentum going.';
  }
  if (remaining === 1) {
    return 'One more class completes your weekly goal.';
  }
  if (streak >= 7) {
    return `${streak}-day streak. Keep showing up.`;
  }
  if (completed <= 0) {
    return 'Your first training session of the week is waiting.';
  }
  if (streak >= 3) {
    return 'Your next milestone is getting close.';
  }
  return 'Keep building your week on the mat.';
}
