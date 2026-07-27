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
 * Driven by weekly class progress — not belt/promotion state.
 */
export function getMotivationalMessage(input: {
  weeklyClassesCompleted: number;
  weeklyClassGoal: number;
}): string {
  const completed = Math.max(0, input.weeklyClassesCompleted);
  const goal = Math.max(1, input.weeklyClassGoal);
  const remaining = Math.max(0, goal - completed);

  if (completed <= 0) {
    return 'Your first training session of the week is waiting.';
  }
  if (remaining === 1) {
    return 'You’re one class away from your weekly goal.';
  }
  if (remaining === 0) {
    return 'Weekly goal complete. Keep the momentum going.';
  }
  return 'Keep building your week on the mat.';
}
