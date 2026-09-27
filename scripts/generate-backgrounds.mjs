// Generates src/lib/backgrounds.ts from the verified harvest output.
// Run: node scripts/generate-backgrounds.mjs
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("background-candidates.json", "utf8"));

/** Display labels for each category id. */
const LABELS = {
  focus: "Focus",
  cozy: "Cozy",
  nature: "Nature",
  anime: "Anime",
  city: "City",
  space: "Space",
  abstract: "Abstract",
  animals: "Animals",
};

const pad = (n) => String(n).padStart(2, "0");

const lines = [];
lines.push("// GENERATED FILE - do not edit by hand.");
lines.push("// Rebuild with: node scripts/harvest-backgrounds.mjs && node scripts/generate-backgrounds.mjs");
lines.push("//");
lines.push("// Every entry was downloaded and measured: width >= 1600px and aspect");
lines.push("// ratio >= 1.25, so it holds up as a full-screen background on a desktop.");
lines.push("");
lines.push("export interface Background {");
lines.push("  name: string;");
lines.push("  url: string;");
lines.push("  /** Intrinsic pixel width, used to show a resolution badge. */");
lines.push("  w: number;");
lines.push("  h: number;");
lines.push("}");
lines.push("");
lines.push("export interface BackgroundCategory {");
lines.push("  id: string;");
lines.push("  label: string;");
lines.push("  items: Background[];");
lines.push("}");
lines.push("");
lines.push("export const BACKGROUND_CATEGORIES: BackgroundCategory[] = [");

for (const [id, items] of Object.entries(data)) {
  if (!items.length) continue;
  const label = LABELS[id] ?? id;
  lines.push("  {");
  lines.push(`    id: ${JSON.stringify(id)},`);
  lines.push(`    label: ${JSON.stringify(label)},`);
  lines.push("    items: [");
  items.forEach((it, i) => {
    lines.push(
      `      { name: ${JSON.stringify(`${label} ${pad(i + 1)}`)}, url: ${JSON.stringify(it.url)}, w: ${it.w}, h: ${it.h} },`,
    );
  });
  lines.push("    ],");
  lines.push("  },");
}

lines.push("];");
lines.push("");
lines.push("/** Fallback category when a stored background is no longer in the list. */");
lines.push("export const DEFAULT_BACKGROUND = BACKGROUND_CATEGORIES[0]?.items[0]?.url ?? \"\";");
lines.push("");

fs.writeFileSync("src/lib/backgrounds.ts", lines.join("\n"));

const total = Object.values(data).reduce((n, v) => n + v.length, 0);
console.log(`wrote src/lib/backgrounds.ts — ${total} backgrounds across ${Object.keys(data).length} categories`);
