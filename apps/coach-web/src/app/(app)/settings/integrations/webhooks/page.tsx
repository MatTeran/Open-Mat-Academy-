import SettingsPlaceholder from '@/components/settings/SettingsPlaceholder';

export default function Page() {
  return (
    <SettingsPlaceholder
      title="Webhooks"
      description="Outbound signed My Gi events. Endpoint CRUD + secret rotation after checkpoint; schema already migrated."
    />
  );
}
