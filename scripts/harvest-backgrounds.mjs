// Harvests candidate background images from Pinterest idea pages and keeps
// only the ones that are actually good full-screen desktop backgrounds.
//
// Pinterest's CDN exposes the same asset under several size prefixes
// (236x / 474x / 736x / 1200x / originals). We normalise every hit to the
// largest available variant, dedupe by asset hash, then download and measure
// real pixel dimensions — a `1200x` prefix is only a hint, and an `originals`
// file can still be tiny.
//
// Source pages are chosen with desktop-leaning queries ("16:9", "laptop",
// "ultrawide", "monitor") because Pinterest's phone-wallpaper pages skew
// portrait, and `background-size: cover` crops a 9:16 image down to a thin
// horizontal band.
//
// Usage:
//   node scripts/harvest-backgrounds.mjs            # all categories
//   node scripts/harvest-backgrounds.mjs city       # just one category
//
// Results merge into background-candidates.json so partial runs are safe.

import fs from "node:fs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const PIN_URL =
  /https:\/\/i\.pinimg\.com\/(originals|\d+x)\/((?:[0-9a-f]{2}\/){3}[0-9a-f]{10,})\.(jpg|jpeg|png|gif)/gi;

const OUT = "background-candidates.json";

const widthOf = (prefix) => (prefix === "originals" ? Infinity : parseInt(prefix, 10));

const SOURCES = {
  focus: [
    "https://www.pinterest.com/ideas/lofi-wallpaper-4k/943876686912",
    "https://www.pinterest.com/ideas/cozy-wallpaper-4k-pc/906677927433",
    "https://www.pinterest.com/ideas/desktop-wallpaper-lofi/936491201019",
    "https://www.pinterest.com/ideas/pc-lofi-wallpapers/921096228566",
    "https://www.pinterest.com/ideas/study-room-wallpaper-4k/958407259160",
    "https://www.pinterest.com/ideas/study-table-aesthetic-wallpaper/897870662108",
  ],
  cozy: [
    "https://www.pinterest.com/ideas/4k-bedroom-wallpaper/893835352073",
    "https://www.pinterest.com/ideas/aesthetic-room-wallpaper/936967230226",
    "https://www.pinterest.com/ideas/cozy-room-wallpaper-desktop/904820866519",
    "https://www.pinterest.com/ideas/aesthetic-wallpaper-for-living-room/929527721659",
    "https://www.pinterest.com/ideas/aesthetic-wallpaper-room/905456053645",
    "https://www.pinterest.com/ideas/cozy-room-with-pixel-art-wallpaper/934671546792",
  ],
  nature: [
    "https://www.pinterest.com/ideas/4k-nature-wallpaper/930186350047",
    "https://www.pinterest.com/ideas/deep-forest-wallpaper-4k/934191124333",
    "https://www.pinterest.com/ideas/hd-forest-wallpaper/895314691400",
    "https://www.pinterest.com/ideas/mountain-valley-sunrise-wallpaper/937436211161",
    "https://www.pinterest.com/ideas/sunrise-landscape-wallpaper-4k/936762434815",
    "https://www.pinterest.com/ideas/desktop-wallpaper-3440-x-1440/898703037589",
  ],
  anime: [
    "https://www.pinterest.com/ideas/lofi-anime-wallpaper-4k-laptop/943204772232",
    "https://www.pinterest.com/ideas/lofi-aesthetic-anime-wallpaper-desktop/923259838527",
    "https://www.pinterest.com/ideas/lofi-anime-wallpapers-1920x1080/899070743166",
    "https://www.pinterest.com/ideas/anime-lofi-wallpaper-1920x1080/929154150286",
    "https://www.pinterest.com/ideas/chill-lofi-wallpaper-1920x1080/919821205015",
    "https://www.pinterest.com/ideas/lofi-aesthetic-anime-landscape-wallpaper-laptop/894600439602",
    "https://www.pinterest.com/ideas/anime-lofi-room/910441460617",
  ],
  city: [
    "https://www.pinterest.com/ideas/cyberpunk-city-rain-wallpaper-4k/946988245429",
    "https://www.pinterest.com/ideas/rainy-cyberpunk-city-wallpaper/941495802948",
    "https://www.pinterest.com/ideas/cyberpunk-wallpaper-rain/910710359821",
    "https://www.pinterest.com/ideas/city-skyline-wallpaper-4k/910780393699",
    "https://www.pinterest.com/ideas/city-night-laptop-wallpaper/905725081833",
    "https://www.pinterest.com/ideas/night-city-live-wallpaper-4k/914092932258",
  ],
  space: [
    "https://www.pinterest.com/ideas/4k-space-wallpaper/908696008089",
    "https://www.pinterest.com/ideas/galaxy-stars-4k-wallpaper-laptop/910082483452",
    "https://www.pinterest.com/ideas/space-wallpaper-desktop-hd/949807704950",
    "https://www.pinterest.com/ideas/4k-stars-wallpaper/902304397711",
    "https://www.pinterest.com/ideas/galaxy-wallpaper-desktop-hd/939131638705",
    "https://www.pinterest.com/ideas/galaxy-wallpaper/895228087529",
  ],
  abstract: [
    "https://www.pinterest.com/ideas/minimal-abstract-gradient-background-4k/954975281500",
    "https://www.pinterest.com/ideas/abstract-gradient-wallpaper-aesthetic/895419505037",
    "https://www.pinterest.com/ideas/dark-gradient-desktop-wallpaper/955893323758",
    "https://www.pinterest.com/ideas/abstract-wallpaper/959799600804",
    "https://www.pinterest.com/ideas/minimal-gradient-wallpaper/905053062797",
    "https://www.pinterest.com/ideas/minimal-abstract-gradient-mesh-background-4k/959703101024",
  ],
  animals: [
    "https://www.pinterest.com/ideas/cat-wallpaper-desktop-hd/918542660680",
    "https://www.pinterest.com/ideas/cute-cat-wallpaper-laptop/923907502173",
    "https://www.pinterest.com/ideas/cat-wallpaper-aesthetic-for-laptop/955821339515",
    "https://www.pinterest.com/ideas/cat-desktop-wallpaper/951004969403",
    "https://www.pinterest.com/ideas/cute-wallpapers-aesthetic-cat/937761370232",
  ],
};

const MIN_WIDTH = 1600;
/** Hard floor on aspect ratio — below this `cover` crops it into a band. */
const MIN_RATIO = 1.25;
const PER_CATEGORY = 6;
const CONCURRENCY = 4;
const MAX_KB = 4500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Prefer a large short edge, mild bonus for 16:9-ish, penalise heavy files. */
function score({ w, h, kb }) {
  const ratio = w / h;
  let s = Math.min(w, h);
  if (ratio >= 1.6 && ratio <= 2.1) s *= 1.35;
  else if (ratio >= 1.25) s *= 1.1;
  if (kb > 3000) s *= 0.75;
  return s;
}

async function getHtml(url, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.status === 429 || r.status >= 500) throw new Error(`status ${r.status}`);
      if (!r.ok) return null;
      return await r.text();
    } catch {
      if (i === attempts - 1) return null;
      await sleep(1500 * (i + 1));
    }
  }
  return null;
}

function gifSize(b) {
  return b.length >= 10 && b.toString("ascii", 0, 3) === "GIF"
    ? { w: b.readUInt16LE(6), h: b.readUInt16LE(8) }
    : null;
}
function pngSize(b) {
  return b.length >= 24 && b.readUInt32BE(12) === 0x49484452
    ? { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
    : null;
}
function jpegSize(b) {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

async function measure(url, attempts = 2) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) return null;
      const b = Buffer.from(await r.arrayBuffer());
      const d = gifSize(b) ?? pngSize(b) ?? jpegSize(b);
      if (!d) return null;
      return { ...d, kb: Math.round(b.byteLength / 1024) };
    } catch {
      if (i === attempts - 1) return null;
    }
  }
  return null;
}

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const results = {};
if (fs.existsSync(OUT)) {
  try { Object.assign(results, JSON.parse(fs.readFileSync(OUT, "utf8"))); } catch {}
}

process.on("unhandledRejection", (e) => console.warn("  [warn]", e?.message ?? e));
process.on("uncaughtException", (e) => console.warn("  [warn]", e?.message ?? e));

/** Asset hashes already used, so one image never lands in two categories. */
const claimed = new Set(
  Object.values(results).flat().map((v) => v.hash).filter(Boolean),
);

for (const [category, pages] of Object.entries(SOURCES)) {
  if (only.length && !only.includes(category)) continue;

  const best = new Map();
  for (const page of pages) {
    const html = await getHtml(page);
    if (!html) {
      console.log(`  [skip] ${page} (unreachable)`);
      continue;
    }
    let n = 0;
    for (const m of html.matchAll(PIN_URL)) {
      const [, prefix, hash, ext] = m;
      const hint = widthOf(prefix);
      const prev = best.get(hash);
      if (!prev || hint > prev.widthHint) {
        best.set(hash, {
          widthHint: hint,
          url: `https://i.pinimg.com/originals/${hash}.${ext === "jpeg" ? "jpg" : ext}`,
        });
      }
      n++;
    }
    console.log(`  [ok]   ${category} <- ${page} (${n} refs, ${best.size} unique)`);
    await sleep(800);
  }

  const candidates = [...best.entries()].filter(
    ([hash, v]) => v.widthHint >= 1200 && !claimed.has(hash),
  );
  console.log(`  ${category}: ${candidates.length} large candidates, verifying…`);

  const verified = [];
  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const batch = candidates.slice(i, i + CONCURRENCY);
    const done = await Promise.all(
      batch.map(async ([hash, v]) => {
        const d = await measure(v.url);
        if (!d || d.w < MIN_WIDTH || d.kb > MAX_KB) return null;
        if (d.w / d.h < MIN_RATIO) return null; // portrait / square — skip
        return { url: v.url, ...d, hash, score: Math.round(score(d)) };
      }),
    );
    verified.push(...done.filter(Boolean));
  }

  verified.sort((a, b) => b.score - a.score);
  results[category] = verified.slice(0, PER_CATEGORY);
  for (const v of results[category]) claimed.add(v.hash);
  console.log(
    `  ${category}: ${verified.length} pass >=${MIN_WIDTH}w & landscape, keeping ${results[category].length}\n`,
  );

  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
}

console.log("wrote " + OUT);
console.log(
  "\nsummary:",
  Object.entries(results).map(([k, v]) => `${k}=${v.length}`).join("  "),
);
