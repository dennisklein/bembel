#!/usr/bin/env node
// Screenshots of the mockups for the design record.
//
// Usage: node tools/site/shots.mjs [name ...] [--out DIR] [--brand gsi] [--no-mobile]
//
//   name     ui/overview, term/status, ui-overview, term-status, or a bare name
//            (overview, graph); a bare name matches the UI page and the
//            terminal frame of that name. No name: all pages.
//   --out    output directory (default docs/design/img)
//   --brand  design system of the shots: gsi opens each page with ?brand=gsi
//            and names the files ui-<page>-gsi.webp. Default: bembel.
//   --no-mobile  skip the shots at phone width
//
// Every shot is taken at deviceScaleFactor 2, so it stays sharp on 2x screens.
// Web UI pages: 1440x900 CSS px, light, full page -> ui-<page>.webp (2880 px wide).
// Pages with data-shot-mobile also at 390x844, full page ->
// ui-<page>-mobile.webp (780 px wide). Terminal frames: the frame element (#shot:
// the window and its shadow, transparent page; else the window, else body)
// -> term-<frame>.webp. build.py shows every ui-*.webp and term-*.webp at half
// its pixel size. PNG -> WebP with python3 + Pillow (quality 82, method 6).
// Missing pages are skipped.

import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
const mockups = join(repo, 'docs', 'design', 'mockups');

// The pages that have a screenshot: every page in ui/ and term/. A web UI page
// with <body data-shot-mobile> also gets a shot at phone width. A page with
// <body data-shot="none"> gets no shot (for example a page that only other
// pages link to).
const listDir = kind => {
  const dir = join(mockups, kind);
  return existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)).sort() : [];
};
const headOf = (kind, name) => readFileSync(join(mockups, kind, `${name}.html`), 'utf8').match(/<body[^>]*>/)?.[0] || '';
const UI = listDir('ui').filter(p => !/data-shot="none"/.test(headOf('ui', p)));
const MOBILE = new Set(UI.filter(p => /data-shot-mobile/.test(headOf('ui', p))));
const TERM = listDir('term');
// The area of a terminal frame that a screenshot captures: the frame container
// (the window or windows with room for the shadow), else the one window, else body.
const FRAME = ['[data-shot]', '#shot', '.shot', '.win', '.term-window', '.window', '.terminal'];
// Transparent page behind the window, so the image sits on any site background.
const CLEAR = 'html,body,#shot,.shot,main{background:transparent!important}';
const WEBP_MAX = 16383;

const PY = `
import io, sys
from PIL import Image
im = Image.open(io.BytesIO(sys.stdin.buffer.read()))
cut = im.height > ${WEBP_MAX}
if cut:
    im = im.crop((0, 0, im.width, ${WEBP_MAX}))
im.save(sys.argv[1], "WEBP", quality=82, method=6)
print(im.width, im.height, "cut" if cut else "")
`;

function parseArgs(argv) {
  const names = [];
  let out = join(repo, 'docs', 'design', 'img');
  let brand = null, mobile = true;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') out = resolve(argv[++i]);
    else if (argv[i] === '--brand') brand = argv[++i] === 'bembel' ? null : argv[i];
    else if (argv[i] === '--no-mobile') mobile = false;
    else if (argv[i] === '-h' || argv[i] === '--help') {
      console.log('usage: node tools/site/shots.mjs [name ...] [--out DIR] [--brand gsi] [--no-mobile]');
      process.exit(0);
    } else names.push(argv[i]);
  }
  return { names, out, brand, mobile };
}

function jobs(names) {
  const all = [];
  for (const p of UI) {
    all.push({ kind: 'ui', name: p, out: `ui-${p}.webp`, mobile: false });
    if (MOBILE.has(p)) all.push({ kind: 'ui', name: p, out: `ui-${p}-mobile.webp`, mobile: true });
  }
  for (const f of TERM) all.push({ kind: 'term', name: f, out: `term-${f}.webp` });
  if (!names.length) return all;
  const pick = [];
  for (const raw of names) {
    const n = raw.replace(/\.html$/, '').replace(/\.webp$/, '');
    const m = n.match(/^(ui|term)[/-](.+?)(-mobile)?$/);
    const found = all.filter(j => m
      ? j.kind === m[1] && j.name === m[2] && (!m[3] || j.mobile)
      : j.name === n);
    if (!found.length) console.warn(`warning: no mockup named ${raw}`);
    for (const j of found) if (!pick.includes(j)) pick.push(j);
  }
  return pick;
}

function toWebp(png, dest) {
  const r = spawnSync('python3', ['-c', PY, dest], { input: png, encoding: 'buffer', maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`python3/Pillow failed: ${String(r.stderr || r.error)}`);
  const [w, h, cut] = String(r.stdout).trim().split(' ');
  return { w, h, cut: cut === 'cut' };
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; }))));
  await page.waitForTimeout(150);
}

async function main() {
  const { names, out, brand, mobile } = parseArgs(process.argv.slice(2));
  const todo = jobs(names)
    .filter(j => mobile || !j.mobile)
    .map(j => brand ? { ...j, out: j.out.replace(/\.webp$/, `-${brand}.webp`) } : j);
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  let done = 0, skipped = 0, bytes = 0;
  try {
    for (const j of todo) {
      const file = join(mockups, j.kind, `${j.name}.html`);
      if (!existsSync(file)) {
        console.warn(`warning: skip ${j.out}: ${j.kind}/${j.name}.html does not exist yet`);
        skipped++;
        continue;
      }
      const options = j.kind === 'term'
        ? { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 }
        : j.mobile
          ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
          : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 };
      const ctx = await browser.newContext({ ...options, colorScheme: 'light', reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      page.on('pageerror', e => console.warn(`warning: ${j.kind}/${j.name}.html: ${e.message}`));
      const url = pathToFileURL(file);
      if (brand) url.searchParams.set('brand', brand);
      await page.goto(url.href, { waitUntil: 'networkidle' });
      await settle(page);
      let png;
      if (j.kind === 'term') {
        await page.addStyleTag({ content: CLEAR });
        let target = page.locator('body');
        for (const sel of FRAME) {
          if (await page.locator(sel).count() === 1) { target = page.locator(sel); break; }
        }
        png = await target.screenshot({ type: 'png', omitBackground: true, animations: 'disabled' });
      } else {
        // Grow the viewport to the page height, so fixed parts (drawers, dialogs
        // with their scrim, sticky footers) cover the whole image.
        for (let pass = 0; pass < 2; pass++) {
          const h = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
          const cur = page.viewportSize();
          if (h <= cur.height) break;
          await page.setViewportSize({ width: cur.width, height: h });
          await settle(page);
        }
        png = await page.screenshot({ type: 'png', fullPage: true, animations: 'disabled' });
      }
      await ctx.close();
      const dest = join(out, j.out);
      const { w, h, cut } = toWebp(png, dest);
      const size = statSync(dest).size;
      bytes += size;
      done++;
      console.log(`${j.out.padEnd(34)} ${`${w}x${h}`.padStart(10)} ${(size / 1024).toFixed(0).padStart(5)} KiB` +
        (cut ? `  (cut to ${WEBP_MAX} px, the WebP limit)` : ''));
    }
  } finally {
    await browser.close();
  }
  console.log(`\n${done} screenshots, ${(bytes / 1048576).toFixed(1)} MiB` + (skipped ? `, ${skipped} skipped` : '') + ` -> ${out}`);
}

main().catch(e => { console.error(e); process.exit(1); });
