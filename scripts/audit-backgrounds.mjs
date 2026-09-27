// Audits the curated background list: HTTP status, byte size and real pixel
// dimensions. Run with: node scripts/audit-backgrounds.mjs
import fs from "node:fs";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function gifSize(buf) {
  if (buf.length < 10) return null;
  const sig = buf.toString("ascii", 0, 3);
  if (sig !== "GIF") return null;
  return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
}

function jpegSize(buf) {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    // SOF0..SOF15, excluding DHT(c4), JPG(c8) and DAC(cc)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

const src = process.argv[2] ?? "src/components/SettingsModal.tsx";
const raw = fs.readFileSync(src, "utf8");
const entries = [...raw.matchAll(/name:\s*"([^"]+)"[\s\S]*?url:\s*"(https:\/\/[^"]+)"/g)].map(
  (m) => ({ name: m[1], url: m[2] }),
);

console.log(`auditing ${entries.length} backgrounds from ${path.basename(src)}\n`);

const rows = [];
for (const e of entries) {
  try {
    const r = await fetch(e.url, { headers: { "User-Agent": UA } });
    const buf = Buffer.from(await r.arrayBuffer());
    const dim = gifSize(buf) ?? jpegSize(buf);
    rows.push({
      name: e.name,
      status: r.status,
      kb: Math.round(buf.byteLength / 1024),
      res: dim ? `${dim.w}x${dim.h}` : "?",
      url: e.url,
    });
  } catch (err) {
    rows.push({ name: e.name, status: "ERR", kb: 0, res: err.message, url: e.url });
  }
}

const bad = rows.filter((r) => r.status !== 200);
const lowRes = rows.filter((r) => r.status === 200 && r.res !== "?" && parseInt(r.res) < 1280);
const heavy = rows.filter((r) => r.status === 200 && r.kb > 2500);

for (const r of rows) {
  const flag =
    r.status !== 200 ? "DEAD" : r.res !== "?" && parseInt(r.res) < 1280 ? "LOW " : r.kb > 2500 ? "HEAVY" : "ok  ";
  console.log(`${flag} ${String(r.status).padEnd(4)} ${String(r.kb).padStart(6)}KB ${String(r.res).padEnd(11)} ${r.name}`);
}
console.log(`\ndead: ${bad.length}   low-res(<1280w): ${lowRes.length}   heavy(>2.5MB): ${heavy.length}   total: ${rows.length}`);
if (process.argv[3] === "--json") {
  fs.writeFileSync("background-audit.json", JSON.stringify(rows, null, 2));
  console.log("wrote background-audit.json");
}
