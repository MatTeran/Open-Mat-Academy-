/**
 * Back-compat shim — gallery medals now render through AchievementMedal.
 * Prefer importing AchievementMedal directly for new code.
 */
export { AchievementMedal as EnamelMedal } from './AchievementMedal';
export { AchievementMedal } from './AchievementMedal';
