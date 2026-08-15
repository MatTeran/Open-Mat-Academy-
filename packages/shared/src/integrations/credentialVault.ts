/**
 * Server-only credential vault.
 * Secrets are encrypted at rest. Plaintext is never returned to clients.
 *
 * Production: set INTEGRATION_CREDENTIALS_MASTER_KEY (32-byte base64).
 * Without a key, vault refuses to seal/open (fail closed) except in demo memory mode.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

export type SecretPayload = Record<string, string>;

export interface SealedSecret {
  ciphertext: string;
  iv: string;
  keyVersion: string;
  maskedHint: string;
}

export interface CredentialVault {
  seal(secrets: SecretPayload, hintField?: string): Promise<SealedSecret>;
  open(sealed: Pick<SealedSecret, 'ciphertext' | 'iv' | 'keyVersion'>): Promise<SecretPayload>;
}

function getMasterKey(): Buffer | null {
  const raw = process.env.INTEGRATION_CREDENTIALS_MASTER_KEY;
  if (!raw) return null;
  try {
    const buf = Buffer.from(raw, 'base64');
    if (buf.length >= 32) return buf.subarray(0, 32);
    return scryptSync(raw, 'mygi-integration-vault', 32);
  } catch {
    return null;
  }
}

function mask(value: string): string {
  if (value.length <= 4) return '••••';
  return `${'•'.repeat(Math.min(12, value.length - 4))}${value.slice(-4)}`;
}

export class AesGcmCredentialVault implements CredentialVault {
  async seal(secrets: SecretPayload, hintField = 'apiToken'): Promise<SealedSecret> {
    const key = getMasterKey();
    if (!key) {
      throw new Error(
        'INTEGRATION_CREDENTIALS_MASTER_KEY is not configured. Refusing to store secrets.',
      );
    }
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const plaintext = Buffer.from(JSON.stringify(secrets), 'utf8');
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    const hintSource = secrets[hintField] ?? Object.values(secrets)[0] ?? '';
    return {
      ciphertext: Buffer.concat([encrypted, tag]).toString('base64'),
      iv: iv.toString('base64'),
      keyVersion: 'v1-aes-256-gcm',
      maskedHint: mask(hintSource),
    };
  }

  async open(
    sealed: Pick<SealedSecret, 'ciphertext' | 'iv' | 'keyVersion'>,
  ): Promise<SecretPayload> {
    const key = getMasterKey();
    if (!key) {
      throw new Error('INTEGRATION_CREDENTIALS_MASTER_KEY is not configured.');
    }
    if (!sealed.keyVersion.startsWith('v1')) {
      throw new Error(`Unsupported credential key version: ${sealed.keyVersion}`);
    }
    const buf = Buffer.from(sealed.ciphertext, 'base64');
    const iv = Buffer.from(sealed.iv, 'base64');
    const tag = buf.subarray(buf.length - 16);
    const data = buf.subarray(0, buf.length - 16);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(plaintext.toString('utf8')) as SecretPayload;
  }
}

/** In-memory vault for unit tests / demo — still never exposes secrets via UI DTOs. */
export class MemoryCredentialVault implements CredentialVault {
  async seal(secrets: SecretPayload, hintField = 'apiToken'): Promise<SealedSecret> {
    const hintSource = secrets[hintField] ?? Object.values(secrets)[0] ?? '';
    return {
      ciphertext: Buffer.from(JSON.stringify(secrets), 'utf8').toString('base64'),
      iv: 'memory',
      keyVersion: 'memory',
      maskedHint: mask(hintSource),
    };
  }

  async open(
    sealed: Pick<SealedSecret, 'ciphertext' | 'iv' | 'keyVersion'>,
  ): Promise<SecretPayload> {
    return JSON.parse(
      Buffer.from(sealed.ciphertext, 'base64').toString('utf8'),
    ) as SecretPayload;
  }
}

export function createCredentialVault(): CredentialVault {
  if (process.env.NEXT_PUBLIC_PLATFORM_WEB_DEMO === '1' || process.env.VITEST) {
    return new MemoryCredentialVault();
  }
  return new AesGcmCredentialVault();
}

/** Safe DTO — never includes ciphertext or plaintext secrets. */
export function toPublicCredentialView(input: {
  maskedHint: string | null;
  updatedAt?: string | null;
}) {
  return {
    maskedHint: input.maskedHint,
    updatedAt: input.updatedAt ?? null,
    secretAvailable: Boolean(input.maskedHint),
  };
}
