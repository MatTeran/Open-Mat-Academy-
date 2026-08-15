import { canManageAcademy } from '@openmat/shared/auth/membership';

import { MediaLibraryClient } from '@/components/settings/MediaLibraryClient';
import { requireCoachSession } from '@/lib/auth/session';
import { listMedia } from '@/lib/settings/academySettingsStore';

export default async function MediaSettingsPage() {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);
  const assets = listMedia(session.academyId);

  return <MediaLibraryClient assets={assets} canManage={canManage} />;
}
