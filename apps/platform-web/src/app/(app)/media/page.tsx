import { PlatformMediaLibrary } from '@/components/media/PlatformMediaLibrary';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function MediaPage() {
  await requirePlatformSession();
  // Live media_assets query attaches when ops schema is applied; empty is honest.
  return <PlatformMediaLibrary assets={[]} />;
}
