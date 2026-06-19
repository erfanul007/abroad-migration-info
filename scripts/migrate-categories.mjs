// scripts/migrate-categories.mjs
// One-off structural migration of src/data/categories.json to the 15-category factor model:
//   1. set the rebalanced category weights (sum 100),
//   2. move `sponsorship-work-authorisation` out of job-market,
//   3. append the new `direct-work-route` category,
//   4. remove every `other` catch-all factor and renormalise each category's remaining
//      factor weights to INTEGER values summing exactly 100 (largest-remainder / Hamilton).
// Run: node scripts/migrate-categories.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const path = join(here, "..", "src", "data", "categories.json");
const cats = JSON.parse(readFileSync(path, "utf8"));

const CAT_WEIGHTS = {
  "job-market": 10, "visa-access": 9, "citizenship": 9, "post-study-work": 8,
  "spouse-family": 8, "msc-study": 7, "pr-pathway": 7, "income-cost": 6,
  "healthcare": 5, "culture-language": 6, "safety-law": 5, "politics": 4,
  "tax": 3, "muslim-diaspora": 3, "direct-work-route": 10,
};

const DIRECT_WORK_ROUTE = {
  id: "direct-work-route",
  name: "Direct Work-Visa Route (Bangladesh)",
  shortLabel: "Direct Work",
  weight: 10,
  description:
    "Bangladeshi lens: can a Dhaka-based engineer be hired directly from overseas on a skilled-work visa and migrate that way — the alternative to the study-first route. Owns the entry-route / employer-sponsorship signal (moved out of job-market).",
  factors: [
    {
      id: "work-visa-accessibility-bd",
      label: "Skilled-work visa accessibility (BD national)",
      description:
        "Legal/regulatory accessibility of the main skilled-work visa (EU Blue Card, UK Skilled Worker, Canada Express Entry/PGWP-to-work, Australia skilled streams, Ireland Critical Skills) for a Bangladeshi software/AI engineer: eligibility, salary floor, occupation/shortage-list status, quotas. Owns the regulatory route only (employer behaviour lives in employer-sponsorship-willingness). Anchors: ~90 = open, low salary floor, IT on shortage list, no quota; ~50 = available with salary/quota friction; ~20 = high floors, quota-locked, or no realistic direct route.",
      weight: 24,
    },
    {
      id: "overseas-direct-hire",
      label: "Overseas direct-hire feasibility",
      description:
        "Can a firm hire and relocate a candidate directly from Bangladesh with no in-country presence / local-job-offer precondition (global-talent, employer-led, intra-company routes; recognition of remote-built experience). Anchors: ~90 = routine overseas hiring + relocation from Dhaka; ~50 = possible but employer must take extra steps; ~20 = effectively requires in-country presence first.",
      weight: 22,
    },
    {
      id: "bd-direct-work-track-record",
      label: "BD direct-work migration track record",
      description:
        "Established flow of Bangladeshis who actually migrated via a direct skilled-work visa (proof the route works for this nationality). Proxies allowed (BMET outbound stats, OECD migration database, destination work-permit-by-nationality where published); mark confidence in reasoning. Anchors: ~90 = large, established BD skilled-work inflow; ~50 = modest/emerging; ~20 = negligible.",
      weight: 16,
    },
    {
      id: "employer-sponsorship-willingness",
      label: "Employer sponsorship willingness & friction",
      description:
        "Employer behaviour (distinct from regulatory accessibility above): prevalence of sponsor licences, labour-market-test / LMIA burden, sponsorship cost and willingness to sponsor non-resident hires. Anchors: ~90 = employers routinely sponsor, low friction; ~50 = sponsorship with cost/test friction; ~20 = few sponsors, heavy test, high cost.",
      weight: 16,
    },
    {
      id: "route-onward-pr-citizenship",
      label: "Route continuity to PR & citizenship",
      description:
        "Whether THIS work visa is a recognised on-ramp onward to settlement (counts toward PR, leads to citizenship) versus a dead-end temporary permit. ROUTE LINKAGE ONLY — the difficulty/timeline of PR lives in pr-pathway and of citizenship in citizenship; do not re-score those here. Anchors: ~90 = work visa is a clear settlement track; ~50 = onward route exists with switches/conditions; ~20 = temporary/dead-end, no settlement linkage.",
      weight: 14,
    },
    {
      id: "current-openness",
      label: "Current openness / policy direction (2025-26)",
      description:
        "Is the direct skilled-work route currently open/expanding versus restricting/quota-capped right now (2025-26). Anchors: ~90 = open/expanding, actively recruiting skilled non-EU; ~50 = stable/neutral; ~20 = tightening, new caps/fees, route shrinking.",
      weight: 8,
    },
  ],
};

function hamilton(weights) {
  const total = weights.reduce((a, w) => a + w, 0);
  const scaled = weights.map((w) => (w / total) * 100);
  const floors = scaled.map((s) => Math.floor(s));
  const remainder = 100 - floors.reduce((a, f) => a + f, 0);
  const order = scaled
    .map((s, i) => ({ i, frac: s - Math.floor(s) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  const result = [...floors];
  for (let k = 0; k < remainder; k++) result[order[k].i] += 1;
  return result;
}

// 2. move sponsorship out of job-market
const jobMarket = cats.find((c) => c.id === "job-market");
jobMarket.factors = jobMarket.factors.filter((f) => f.id !== "sponsorship-work-authorisation");

// 3. append the new category (guard against double-run)
if (!cats.some((c) => c.id === "direct-work-route")) cats.push(DIRECT_WORK_ROUTE);

for (const cat of cats) {
  // 1. category weight
  if (CAT_WEIGHTS[cat.id] === undefined) throw new Error(`No weight mapping for category "${cat.id}"`);
  cat.weight = CAT_WEIGHTS[cat.id];
  // 4. drop `other`, renormalise remaining factor weights to integers summing 100
  cat.factors = cat.factors.filter((f) => f.id !== "other");
  const newWeights = hamilton(cat.factors.map((f) => f.weight));
  cat.factors.forEach((f, i) => (f.weight = newWeights[i]));
}

writeFileSync(path, JSON.stringify(cats, null, 2) + "\n");
const catSum = cats.reduce((a, c) => a + c.weight, 0);
console.log(`categories: ${cats.length}, weight sum: ${catSum}`);
console.log("factor-weight sums:", cats.map((c) => `${c.id}:${c.factors.reduce((a, f) => a + f.weight, 0)}`).join(" "));
