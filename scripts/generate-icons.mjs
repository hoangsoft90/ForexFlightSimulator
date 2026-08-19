/**
 * Generate all app icons for Forex Flight Simulator
 * Uses resvg-js to render SVG → PNG (no ImageMagick needed)
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const OUT = join(import.meta.dirname, '..', 'assets', 'images');

function render(svg, width, height) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'transparent',
  });
  return resvg.render().asPng();
}

// ─── Shared SVG elements ──────────────────────────────────────────────────

const CANDLE_CHART = (scale = 1) => {
  const s = scale;
  return `
  <line x1="${80*s}" y1="${230*s}" x2="${80*s}" y2="${310*s}" stroke="#BBF7D0" stroke-width="${8*s}" stroke-linecap="round"/>
  <rect x="${56*s}" y="${250*s}" width="${48*s}" height="${35*s}" rx="${5*s}" fill="#16A34A"/>
  <line x1="${136*s}" y1="${190*s}" x2="${136*s}" y2="${290*s}" stroke="#FECACA" stroke-width="${8*s}" stroke-linecap="round"/>
  <rect x="${112*s}" y="${210*s}" width="${48*s}" height="${48*s}" rx="${5*s}" fill="#DC2626"/>
  <line x1="${192*s}" y1="${130*s}" x2="${192*s}" y2="${260*s}" stroke="#BBF7D0" stroke-width="${8*s}" stroke-linecap="round"/>
  <rect x="${168*s}" y="${155*s}" width="${48*s}" height="${70*s}" rx="${5*s}" fill="#16A34A"/>
  <line x1="${248*s}" y1="${110*s}" x2="${248*s}" y2="${220*s}" stroke="#BBF7D0" stroke-width="${8*s}" stroke-linecap="round"/>
  <rect x="${224*s}" y="${130*s}" width="${48*s}" height="${50*s}" rx="${5*s}" fill="#16A34A"/>
  <line x1="${304*s}" y1="${90*s}" x2="${304*s}" y2="${200*s}" stroke="#BBF7D0" stroke-width="${8*s}" stroke-linecap="round"/>
  <rect x="${280*s}" y="${105*s}" width="${48*s}" height="${42*s}" rx="${5*s}" fill="#16A34A"/>
  <line x1="${55*s}" y1="${310*s}" x2="${310*s}" y2="${90*s}" stroke="#FFF" stroke-width="${6*s}" stroke-dasharray="${14*s},${10*s}" stroke-linecap="round" opacity="0.4"/>`;
};

// ─── 1. Main icon (1024x1024) ─────────────────────────────────────────────
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>
  ${CANDLE_CHART(1.4)}
  <text x="810" y="870" font-family="system-ui,-apple-system,sans-serif" font-size="160" font-weight="700" fill="#FFF" opacity="0.9" text-anchor="middle">FF</text>
</svg>`;

// ─── 2. Android foreground (432x432) ──────────────────────────────────────
const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  ${CANDLE_CHART(0.6)}
</svg>`;

// ─── 3. Android background (432x432) ──────────────────────────────────────
const backgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="432" y2="432" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="432" height="432" fill="url(#bgGrad)"/>
</svg>`;

// ─── 4. Monochrome (432x432) ──────────────────────────────────────────────
const monoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  <g fill="#000" stroke="#000">
    <line x1="80" y1="230" x2="80" y2="310" stroke-width="8" stroke-linecap="round" fill="none"/>
    <rect x="56" y="250" width="48" height="35" rx="5"/>
    <line x1="136" y1="190" x2="136" y2="290" stroke-width="8" stroke-linecap="round" fill="none"/>
    <rect x="112" y="210" width="48" height="48" rx="5"/>
    <line x1="192" y1="130" x2="192" y2="260" stroke-width="8" stroke-linecap="round" fill="none"/>
    <rect x="168" y="155" width="48" height="70" rx="5"/>
    <line x1="248" y1="110" x2="248" y2="220" stroke-width="8" stroke-linecap="round" fill="none"/>
    <rect x="224" y="130" width="48" height="50" rx="5"/>
    <line x1="304" y1="90" x2="304" y2="200" stroke-width="8" stroke-linecap="round" fill="none"/>
    <rect x="280" y="105" width="48" height="42" rx="5"/>
    <line x1="55" y1="310" x2="310" y2="90" stroke-width="6" stroke-dasharray="14,10" stroke-linecap="round" opacity="0.5" fill="none"/>
  </g>
</svg>`;

// ─── 5. Splash (200x200) ──────────────────────────────────────────────────
const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="sb" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#sb)"/>
  <line x1="38" y1="100" x2="38" y2="140" stroke="#BBF7D0" stroke-width="5" stroke-linecap="round"/>
  <rect x="28" y="108" width="20" height="16" rx="3" fill="#16A34A"/>
  <line x1="64" y1="80" x2="64" y2="130" stroke="#FECACA" stroke-width="5" stroke-linecap="round"/>
  <rect x="54" y="90" width="20" height="22" rx="3" fill="#DC2626"/>
  <line x1="90" y1="55" x2="90" y2="115" stroke="#BBF7D0" stroke-width="5" stroke-linecap="round"/>
  <rect x="80" y="68" width="20" height="30" rx="3" fill="#16A34A"/>
  <line x1="116" y1="45" x2="116" y2="100" stroke="#BBF7D0" stroke-width="5" stroke-linecap="round"/>
  <rect x="106" y="55" width="20" height="22" rx="3" fill="#16A34A"/>
  <line x1="142" y1="38" x2="142" y2="88" stroke="#BBF7D0" stroke-width="5" stroke-linecap="round"/>
  <rect x="132" y="46" width="20" height="20" rx="3" fill="#16A34A"/>
  <line x1="30" y1="142" x2="150" y2="38" stroke="#FFF" stroke-width="4" stroke-dasharray="10,8" stroke-linecap="round" opacity="0.4"/>
</svg>`;

// ─── 6. Favicon (48x48) ──────────────────────────────────────────────────
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <defs>
    <linearGradient id="fb" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="10" fill="url(#fb)"/>
  <line x1="10" y1="28" x2="10" y2="38" stroke="#BBF7D0" stroke-width="3" stroke-linecap="round"/>
  <rect x="7" y="30" width="6" height="4" rx="1" fill="#16A34A"/>
  <line x1="16" y1="22" x2="16" y2="34" stroke="#FECACA" stroke-width="3" stroke-linecap="round"/>
  <rect x="13" y="25" width="6" height="5" rx="1" fill="#DC2626"/>
  <line x1="22" y1="14" x2="22" y2="30" stroke="#BBF7D0" stroke-width="3" stroke-linecap="round"/>
  <rect x="19" y="18" width="6" height="8" rx="1" fill="#16A34A"/>
  <line x1="28" y1="12" x2="28" y2="25" stroke="#BBF7D0" stroke-width="3" stroke-linecap="round"/>
  <rect x="25" y="15" width="6" height="5" rx="1" fill="#16A34A"/>
  <line x1="34" y1="10" x2="34" y2="22" stroke="#BBF7D0" stroke-width="3" stroke-linecap="round"/>
  <rect x="31" y="13" width="6" height="4" rx="1" fill="#16A34A"/>
</svg>`;

// ─── Render all ───────────────────────────────────────────────────────────

console.log('Generating icons...');

const icons = [
  ['icon.png', iconSvg, 1024, 1024],
  ['android-icon-foreground.png', foregroundSvg, 432, 432],
  ['android-icon-background.png', backgroundSvg, 432, 432],
  ['android-icon-monochrome.png', monoSvg, 432, 432],
  ['splash-icon.png', splashSvg, 200, 200],
  ['favicon.png', faviconSvg, 48, 48],
];

for (const [name, svg, w, h] of icons) {
  writeFileSync(join(OUT, name), render(svg, w, h));
  console.log(`  ✓ ${name} (${w}x${h})`);
}

// Also copy icon.png to assets/expo.icon if it exists as directory
import { existsSync, mkdirSync } from 'fs';
const expoIconDir = join(import.meta.dirname, '..', 'assets', 'expo.icon');
if (existsSync(expoIconDir)) {
  // It's a directory — Expo expects a file. Let's just use the PNG from images.
  // Expo will use the icon from app.json "icon" field.
}

console.log('\nAll icons generated in assets/images/');
