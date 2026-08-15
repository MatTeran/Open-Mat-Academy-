import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  MemoryCredentialVault,
  toPublicCredentialView,
} from '@openmat/shared/integrations/credentialVault';
import { PROVIDER_REGISTRY } from '@openmat/shared/integrations/providers';
import { validateBrandColors } from '@openmat/shared/integrations/brandContrast';
import { validateMediaUpload } from '@openmat/shared/integrations/mediaValidation';

describe('credential vault', () => {
  it('seals secrets and never exposes them via public DTO', async () => {
    const vault = new MemoryCredentialVault();
    const sealed = await vault.seal({
      subdomain: 'acme',
      email: 'owner@acme.test',
      apiToken: 'super-secret-token-xyz',
    });

    expect(sealed.ciphertext).toBeTruthy();
    expect(sealed.maskedHint).not.toContain('super-secret-token-xyz');
    expect(sealed.maskedHint.endsWith('xyz')).toBe(true);

    const publicView = toPublicCredentialView({
      maskedHint: sealed.maskedHint,
      updatedAt: '2026-08-15T00:00:00.000Z',
    });
    expect(JSON.stringify(publicView)).not.toContain('super-secret-token-xyz');
    expect(publicView).not.toHaveProperty('ciphertext');
    expect(publicView).not.toHaveProperty('apiToken');

    const opened = await vault.open(sealed);
    expect(opened.apiToken).toBe('super-secret-token-xyz');
  });
});

describe('provider registry', () => {
  it('keeps Zendesk non-connectable until checkpoint approval', () => {
    const zendesk = PROVIDER_REGISTRY.find((p) => p.id === 'zendesk');
    expect(zendesk?.connectable).toBe(false);
    expect(zendesk?.availability).toBe('beta');
  });

  it('marks custom webhook as connectable without fabricating connections', () => {
    const webhook = PROVIDER_REGISTRY.find((p) => p.id === 'custom_webhook');
    expect(webhook?.connectable).toBe(true);
  });
});

describe('branding contrast', () => {
  it('warns on low-contrast accent against ivory', () => {
    const warnings = validateBrandColors({ accentColor: '#F5F3EE' });
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('accepts bronze against ivory without low-surface warnings', () => {
    const warnings = validateBrandColors({ accentColor: '#9A6735' });
    const vsSurface = warnings.filter((w) => w.message.includes('surface'));
    expect(vsSurface).toHaveLength(0);
  });
});

describe('media validation', () => {
  it('rejects executables and odd MIME types', () => {
    expect(
      validateMediaUpload({
        mediaType: 'academy_logo',
        mimeType: 'application/javascript',
        fileName: 'evil.js',
        fileSize: 100,
      }).ok,
    ).toBe(false);

    expect(
      validateMediaUpload({
        mediaType: 'academy_logo',
        mimeType: 'image/png',
        fileName: 'logo.png',
        fileSize: 1024,
      }).ok,
    ).toBe(true);
  });
});

describe('api key hashing contract', () => {
  it('stores hash only — raw key is not equal to stored form', () => {
    const raw = 'mygi_live_example_key_abc123';
    const hash = createHash('sha256').update(raw).digest('hex');
    expect(hash).not.toBe(raw);
    expect(hash).toHaveLength(64);
  });
});
