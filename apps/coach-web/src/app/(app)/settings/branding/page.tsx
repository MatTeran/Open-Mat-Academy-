import { canManageAcademy } from '@openmat/shared/auth/membership';

import { BrandingStudio } from '@/components/settings/BrandingStudio';
import { requireCoachSession } from '@/lib/auth/session';
import {
  getAcademyBranding,
  getPublishedBranding,
} from '@/lib/settings/academySettingsStore';

export default async function BrandingSettingsPage() {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);
  const branding = getAcademyBranding(session.academyId, session.academyName);
  const published = getPublishedBranding(session.academyId, session.academyName);

  return (
    <BrandingStudio
      branding={branding}
      published={published}
      canManage={canManage}
      academyName={session.academyName}
    />
  );
}
