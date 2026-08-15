import { beforeEach, describe, expect, it } from 'vitest';

import { OPEN_MAT_ACADEMY_ID, TEST_ACADEMY_A_ID } from '@openmat/shared/types';

import {
  __resetAcademySettingsStoreForTests,
  getAcademyBranding,
  getPublishedBranding,
  publishBranding,
  saveBrandingDraft,
  saveAcademyProfile,
  getAcademyProfile,
} from '../lib/settings/academySettingsStore';

describe('academy branding isolation + draft/publish', () => {
  beforeEach(() => {
    __resetAcademySettingsStoreForTests();
  });

  it('keeps draft changes off the published experience', () => {
    saveBrandingDraft(OPEN_MAT_ACADEMY_ID, 'Open Mat', {
      displayName: 'Draft Name',
      accentColor: '#111111',
    });
    expect(getPublishedBranding(OPEN_MAT_ACADEMY_ID, 'Open Mat')).toBeNull();

    publishBranding(OPEN_MAT_ACADEMY_ID, 'Open Mat');
    const live = getPublishedBranding(OPEN_MAT_ACADEMY_ID, 'Open Mat');
    expect(live?.displayName).toBe('Draft Name');

    saveBrandingDraft(OPEN_MAT_ACADEMY_ID, 'Open Mat', {
      displayName: 'Only Draft',
    });
    expect(getPublishedBranding(OPEN_MAT_ACADEMY_ID, 'Open Mat')?.displayName).toBe('Draft Name');
    expect(getAcademyBranding(OPEN_MAT_ACADEMY_ID, 'Open Mat').displayName).toBe('Only Draft');
  });

  it('does not share profile state across academies', () => {
    saveAcademyProfile(OPEN_MAT_ACADEMY_ID, {
      name: 'Open Mat',
      email: 'a@openmat.test',
    });
    saveAcademyProfile(TEST_ACADEMY_A_ID, {
      name: 'Academy A',
      email: 'a@other.test',
    });

    expect(getAcademyProfile(OPEN_MAT_ACADEMY_ID, 'Open Mat').email).toBe('a@openmat.test');
    expect(getAcademyProfile(TEST_ACADEMY_A_ID, 'Academy A').email).toBe('a@other.test');
  });
});
