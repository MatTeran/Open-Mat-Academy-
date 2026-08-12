import type {
  TechniqueCategory,
  TechniqueFormat,
} from '../../types/technique';

export const TECHNIQUE_CATEGORY_OPTIONS: {
  value: TechniqueCategory;
  label: string;
}[] = [
  { value: 'submission', label: 'Submission' },
  { value: 'sweep', label: 'Sweep' },
  { value: 'takedown', label: 'Takedown' },
  { value: 'escape', label: 'Escape' },
  { value: 'position', label: 'Position' },
  { value: 'guard', label: 'Guard' },
  { value: 'guard_pass', label: 'Guard Pass' },
  { value: 'transition', label: 'Transition' },
  { value: 'defense', label: 'Defense' },
  { value: 'control', label: 'Control' },
  { value: 'grip', label: 'Grip / Hand Fighting' },
  { value: 'movement', label: 'Movement' },
  { value: 'other', label: 'Other' },
];

export const TECHNIQUE_FORMAT_OPTIONS: {
  value: TechniqueFormat;
  label: string;
}[] = [
  { value: 'gi', label: 'Gi' },
  { value: 'no_gi', label: 'No-Gi' },
  { value: 'both', label: 'Both' },
];

export const TECHNIQUE_POSITION_OPTIONS = [
  'Standing',
  'Closed Guard',
  'Open Guard',
  'Half Guard',
  'Side Control',
  'Mount',
  'Back',
  'Turtle',
  'North South',
  'Other',
] as const;

export const SUBCATEGORY_BY_CATEGORY: Partial<
  Record<TechniqueCategory, string[]>
> = {
  submission: [
    'Armbar',
    'Choke',
    'Shoulder Lock',
    'Leg Lock',
    'Wrist Lock',
    'Compression',
  ],
  guard: [
    'Closed Guard',
    'Half Guard',
    'Butterfly',
    'De La Riva',
    'Reverse De La Riva',
    'X Guard',
    'Single Leg X',
    'Spider Guard',
    'Lasso',
    'Other',
  ],
  sweep: ['Hip Bump', 'Scissor', 'Butterfly', 'Hook Sweep', 'Other'],
  takedown: ['Single Leg', 'Double Leg', 'Trip', 'Throw', 'Other'],
  escape: ['Hip Escape', 'Frame Escape', 'Bridge', 'Other'],
  position: ['Mount', 'Side Control', 'Back Control', 'Knee on Belly', 'Other'],
  guard_pass: ['Knee Cut', 'Toreando', 'Stack Pass', 'Leg Drag', 'Other'],
};

export function getCategoryLabel(category: TechniqueCategory): string {
  return (
    TECHNIQUE_CATEGORY_OPTIONS.find((item) => item.value === category)
      ?.label ?? category
  );
}

export function getFormatLabel(format: TechniqueFormat): string {
  return (
    TECHNIQUE_FORMAT_OPTIONS.find((item) => item.value === format)?.label ??
    format
  );
}

export function normalizeTechniqueName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}
