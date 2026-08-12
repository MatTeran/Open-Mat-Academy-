import type { MemberTechnique } from '../../types/technique';

const NOW = '2026-01-01T00:00:00.000Z';

function systemTechnique(
  partial: Omit<
    MemberTechnique,
    | 'sourceType'
    | 'createdByUserId'
    | 'academyId'
    | 'isPublic'
    | 'archived'
    | 'createdAt'
    | 'updatedAt'
    | 'notes'
  > & { notes?: string },
): MemberTechnique {
  return {
    ...partial,
    notes: partial.notes ?? '',
    sourceType: 'system',
    createdByUserId: null,
    academyId: null,
    isPublic: true,
    archived: false,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

/** Global Open Mat technique library — suggest, don't restrict. */
export const SYSTEM_TECHNIQUES: MemberTechnique[] = [
  systemTechnique({
    id: 'armbar',
    name: 'Armbar',
    category: 'submission',
    subcategory: 'Armbar',
    position: 'Closed Guard',
    format: 'both',
  }),
  systemTechnique({
    id: 'triangle',
    name: 'Triangle',
    category: 'submission',
    subcategory: 'Choke',
    position: 'Closed Guard',
    format: 'both',
  }),
  systemTechnique({
    id: 'kimura',
    name: 'Kimura',
    category: 'submission',
    subcategory: 'Shoulder Lock',
    position: 'Side Control',
    format: 'both',
  }),
  systemTechnique({
    id: 'rear_naked_choke',
    name: 'Rear Naked Choke',
    category: 'submission',
    subcategory: 'Choke',
    position: 'Back',
    format: 'both',
  }),
  systemTechnique({
    id: 'guillotine',
    name: 'Guillotine',
    category: 'submission',
    subcategory: 'Choke',
    position: 'Standing',
    format: 'both',
  }),
  systemTechnique({
    id: 'ankle_lock',
    name: 'Ankle Lock',
    category: 'submission',
    subcategory: 'Leg Lock',
    position: 'Open Guard',
    format: 'both',
  }),
  systemTechnique({
    id: 'sweep',
    name: 'Sweep',
    category: 'sweep',
    subcategory: null,
    position: 'Closed Guard',
    format: 'both',
  }),
  systemTechnique({
    id: 'hip_bump_sweep',
    name: 'Hip Bump Sweep',
    category: 'sweep',
    subcategory: 'Hip Bump',
    position: 'Closed Guard',
    format: 'both',
  }),
  systemTechnique({
    id: 'scissor_sweep',
    name: 'Scissor Sweep',
    category: 'sweep',
    subcategory: 'Scissor',
    position: 'Closed Guard',
    format: 'gi',
  }),
  systemTechnique({
    id: 'single_leg',
    name: 'Single Leg',
    category: 'takedown',
    subcategory: 'Single Leg',
    position: 'Standing',
    format: 'both',
  }),
  systemTechnique({
    id: 'double_leg',
    name: 'Double Leg',
    category: 'takedown',
    subcategory: 'Double Leg',
    position: 'Standing',
    format: 'both',
  }),
  systemTechnique({
    id: 'side_control_escape',
    name: 'Side Control Escape',
    category: 'escape',
    subcategory: 'Frame Escape',
    position: 'Side Control',
    format: 'both',
  }),
  systemTechnique({
    id: 'hip_escape',
    name: 'Hip Escape',
    category: 'escape',
    subcategory: 'Hip Escape',
    position: 'Side Control',
    format: 'both',
  }),
  systemTechnique({
    id: 'mount',
    name: 'Mount',
    category: 'position',
    subcategory: 'Mount',
    position: 'Mount',
    format: 'both',
  }),
  systemTechnique({
    id: 'back_control',
    name: 'Back Control',
    category: 'position',
    subcategory: 'Back Control',
    position: 'Back',
    format: 'both',
  }),
  systemTechnique({
    id: 'closed_guard',
    name: 'Closed Guard',
    category: 'guard',
    subcategory: 'Closed Guard',
    position: 'Closed Guard',
    format: 'both',
  }),
  systemTechnique({
    id: 'side_control',
    name: 'Side Control',
    category: 'position',
    subcategory: 'Side Control',
    position: 'Side Control',
    format: 'both',
  }),
  systemTechnique({
    id: 'guard_pass',
    name: 'Guard Pass',
    category: 'guard_pass',
    subcategory: null,
    position: 'Open Guard',
    format: 'both',
  }),
  systemTechnique({
    id: 'knee_cut',
    name: 'Knee Cut',
    category: 'guard_pass',
    subcategory: 'Knee Cut',
    position: 'Half Guard',
    format: 'both',
  }),
];
