export type IntegrationAvailability =
  | 'active'
  | 'beta'
  | 'internal'
  | 'coming_soon'
  | 'disabled';

export type IntegrationConnectionStatus =
  | 'not_connected'
  | 'connecting'
  | 'connected'
  | 'degraded'
  | 'error'
  | 'reauthorization_required'
  | 'disabled';

export type IntegrationProviderId =
  | 'zendesk'
  | 'stripe'
  | 'mailchimp'
  | 'hubspot'
  | 'google_calendar'
  | 'google_workspace'
  | 'zapier'
  | 'custom_webhook'
  | 'custom_api';

export interface IntegrationProviderMeta {
  id: IntegrationProviderId;
  name: string;
  category: string;
  availability: IntegrationAvailability;
  description: string;
  connectable: boolean;
}

export interface ConnectionHealth {
  status: IntegrationConnectionStatus;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastErrorCode: string | null;
  lastErrorSummary: string | null;
}

export interface TestConnectionResult {
  ok: boolean;
  errorCode?: string;
  errorSummary?: string;
}

/**
 * Provider adapter contract. Zendesk will implement this after checkpoint approval.
 * No adapter may return raw secrets to callers that serialize to the client.
 */
export interface IntegrationProviderAdapter {
  readonly id: IntegrationProviderId;
  testConnection(config: Record<string, unknown>): Promise<TestConnectionResult>;
  getConnectionHealth?(connectionId: string): Promise<ConnectionHealth>;
}

export const PROVIDER_REGISTRY: IntegrationProviderMeta[] = [
  {
    id: 'zendesk',
    name: 'Zendesk',
    category: 'support',
    availability: 'beta',
    description:
      'Customer support with academy context. Live connect awaits checkpoint approval.',
    connectable: false,
  },
  {
    id: 'custom_webhook',
    name: 'Custom Webhook',
    category: 'custom',
    availability: 'beta',
    description: 'Outbound signed My Gi events to your HTTPS endpoint.',
    connectable: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payments',
    availability: 'coming_soon',
    description: 'Payments and subscription sync.',
    connectable: false,
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'email',
    availability: 'coming_soon',
    description: 'Email marketing audiences.',
    connectable: false,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    availability: 'coming_soon',
    description: 'CRM contact sync.',
    connectable: false,
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'calendar',
    availability: 'coming_soon',
    description: 'Class and event calendar sync.',
    connectable: false,
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace',
    category: 'email',
    availability: 'coming_soon',
    description: 'Workspace identity and groups.',
    connectable: false,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'automation',
    availability: 'coming_soon',
    description: 'No-code automation bridge.',
    connectable: false,
  },
  {
    id: 'custom_api',
    name: 'My Gi API',
    category: 'custom',
    availability: 'coming_soon',
    description: 'Academy-facing My Gi API clients.',
    connectable: false,
  },
];

export function getProviderMeta(id: string): IntegrationProviderMeta | undefined {
  return PROVIDER_REGISTRY.find((p) => p.id === id);
}
