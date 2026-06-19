// scripts/migrate-country-cells.mjs
// One-off: for every src/data/countries/*.json — delete `other` from every cell's factors,
// delete `sponsorship-work-authorisation` from the job-market cell, and add a pending
// `direct-work-route` cell. Run: node scripts/migrate-country-cells.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "src", "data", "countries");
const REVIEWED = "2026-06-19";
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const path = join(dir, file);
  const country = JSON.parse(readFileSync(path, "utf8"));
  for (const [catId, cell] of Object.entries(country.categories)) {
    if (cell.factors && "other" in cell.factors) delete cell.factors.other;
    if (catId === "job-market" && cell.factors && "sponsorship-work-authorisation" in cell.factors) {
      delete cell.factors["sponsorship-work-authorisation"];
    }
  }
  if (!country.categories["direct-work-route"]) {
    country.categories["direct-work-route"] = {
      status: "pending", factors: {}, summary: "", pros: [], cons: [], links: [], lastReviewed: REVIEWED,
    };
  }
  writeFileSync(path, JSON.stringify(country, null, 2) + "\n");
}
console.log("Migrated", files.length, "country files");
