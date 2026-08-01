-- Expand coach_classes level/gi_type checks for Open Mat Academy flyer programs.
alter table if exists public.coach_classes
  drop constraint if exists coach_classes_gi_type_check;

alter table if exists public.coach_classes
  drop constraint if exists coach_classes_level_check;

alter table if exists public.coach_classes
  add constraint coach_classes_gi_type_check
  check (gi_type in ('gi', 'no_gi', 'gi_no_gi', 'none'));

alter table if exists public.coach_classes
  add constraint coach_classes_level_check
  check (
    level in (
      'adult_bjj',
      'youth_bjj',
      'pee_wee_bjj',
      'womens_bjj',
      'boxing',
      'muay_thai',
      'wrestling',
      'peak_performance',
      'taekwondo',
      'open_mat',
      'seminar'
    )
  );
