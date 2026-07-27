#!/usr/bin/env node
/**
 * Generate Expo Go QR PNGs for Member + Coach demo tunnels.
 *
 * Reads live URLs from:
 *   - assets/demo/member-expo-url.txt
 *   - assets/demo/coach-expo-url.txt
 * Or from CLI args / env MEMBER_EXPO_URL + COACH_EXPO_URL.
 *
 * Usage:
 *   node scripts/generate-demo-qr.js
 *   node scripts/generate-demo-qr.js "exp://..." "exp://..."
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'assets', 'demo');
const coachOutDir = path.join(root, 'apps', 'coach', 'assets', 'demo');

function readUrl(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch {
    return '';
  }
}

function ensureQrcode() {
  try {
    require.resolve('qrcode');
  } catch {
    console.log('Installing qrcode…');
    execSync('npm install --no-save qrcode', { cwd: root, stdio: 'inherit' });
  }
}

async function writeQr(url, pngPath, txtPath, label) {
  if (!url || !url.startsWith('exp')) {
    console.warn(`Skip ${label}: no valid exp:// URL (${url || 'empty'})`);
    return false;
  }
  const QRCode = require('qrcode');
  fs.mkdirSync(path.dirname(pngPath), { recursive: true });
  fs.writeFileSync(txtPath, `${url}\n`);
  await QRCode.toFile(pngPath, url, {
    type: 'png',
    width: 720,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#FFFFFF' },
  });
  console.log(`✓ ${label}: ${url}`);
  console.log(`  → ${path.relative(root, pngPath)}`);
  return true;
}

async function main() {
  ensureQrcode();
  const memberUrl =
    process.argv[2] ||
    process.env.MEMBER_EXPO_URL ||
    readUrl(path.join(outDir, 'member-expo-url.txt'));
  const coachUrl =
    process.argv[3] ||
    process.env.COACH_EXPO_URL ||
    readUrl(path.join(outDir, 'coach-expo-url.txt')) ||
    readUrl(path.join(root, 'apps/coach/assets/expo-qr-url.txt'));

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(coachOutDir, { recursive: true });

  const a = await writeQr(
    memberUrl,
    path.join(outDir, 'member-qr.png'),
    path.join(outDir, 'member-expo-url.txt'),
    'Member app',
  );
  const b = await writeQr(
    coachUrl,
    path.join(outDir, 'coach-qr.png'),
    path.join(outDir, 'coach-expo-url.txt'),
    'Coach app',
  );

  // Mirror coach QR into coach package assets for convenience
  if (b) {
    fs.copyFileSync(
      path.join(outDir, 'coach-qr.png'),
      path.join(coachOutDir, 'coach-qr.png'),
    );
    fs.copyFileSync(
      path.join(outDir, 'coach-expo-url.txt'),
      path.join(coachOutDir, 'coach-expo-url.txt'),
    );
    fs.copyFileSync(
      path.join(outDir, 'coach-qr.png'),
      path.join(root, 'apps/coach/assets/expo-qr.png'),
    );
    fs.writeFileSync(
      path.join(root, 'apps/coach/assets/expo-qr-url.txt'),
      `${coachUrl}\n`,
    );
  }

  if (!a && !b) {
    console.error(
      'No Expo URLs found. Start tunnels first:\n  npm run start:member:tunnel\n  npm run start:coach:tunnel\nThen re-run with the exp:// URLs.',
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
