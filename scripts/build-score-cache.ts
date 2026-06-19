// scripts/build-score-cache.ts
// Regenerates src/data/cache/scoreboard.json from the factor data. Run: npm run cache:scores
// fs-loads JSON (NOT the Vite import.meta.glob loader in data.ts) but reuses the pure
// buildScoreboard projection so the cache can never diverge from runtime.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildScoreboard } from "../src/lib/scoreboard";
import { validateCategories, validateCountry } from "../src/lib/schema";
import type { Category, Country } from "../src/lib/schema";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const categories = JSON.parse(readFileSync(join(root, "src/data/categories.json"), "utf8")) as Category[];
const dir = join(root, "src/data/countries");
const countries = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as Country)
  .sort((a, b) => a.name.localeCompare(b.name));

const errors = [
  ...validateCategories(categories),
  ...countries.flatMap((c) => validateCountry(c, categories)),
];
if (errors.length) {
  console.error("Refusing to build cache — data invalid:\n- " + errors.join("\n- "));
  process.exit(1);
}

const board = buildScoreboard(countries, categories);
mkdirSync(join(root, "src/data/cache"), { recursive: true });
writeFileSync(join(root, "src/data/cache/scoreboard.json"), JSON.stringify(board, null, 2) + "\n");
console.log(`Wrote scoreboard.json (${board.countries.length} countries, ${board.categoryCount} categories)`);
