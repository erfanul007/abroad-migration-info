# Milestone 4 — Pages

Back to [plan index](./README.md). Tasks 20–23. Output: Dashboard, Country detail, Compare, About — composed from existing components, reading data via `useData`. Follows wireframes §1, §3, §4, §5.

> All router imports from `react-router`.

---

## Task 20: Dashboard (Podium + StatCard + Section + map + compact leaderboard)

**Files:** Create `src/components/common/Section.tsx`, `src/components/common/StatCard.tsx`, `src/components/common/Podium.tsx`; modify `src/pages/Dashboard.tsx`

- [ ] **Step 1: Write `Section.tsx`** (titled section wrapper, reused on every page)

```tsx
// src/components/common/Section.tsx
import { type ReactNode } from "react";

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Write `StatCard.tsx`**

```tsx
// src/components/common/StatCard.tsx
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
        {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Write `Podium.tsx`** (top-3, 1st raised — wireframe §1)

```tsx
// src/components/common/Podium.tsx
import { Link } from "react-router";
import type { ScoredCountry } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBadge } from "@/components/common/ScoreBadge";

export function Podium({ countries }: { countries: ScoredCountry[] }) {
  const top = countries.slice(0, 3);
  const order = [1, 0, 2]; // visual: 2nd, 1st, 3rd
  return (
    <div className="grid grid-cols-3 gap-3">
      {order.map((i) => {
        const c = top[i];
        if (!c) return <div key={i} />;
        const raised = i === 0 ? "sm:-translate-y-3" : "";
        return (
          <Link key={c.id} to={`/country/${c.iso}`} className={`transition-transform ${raised}`}>
            <Card className="text-center hover:border-primary">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-muted-foreground">#{c.rank}</div>
                <div className="my-1 text-3xl" aria-hidden>{c.flag}</div>
                <div className="truncate font-semibold">{c.name}</div>
                <div className="mt-2 flex justify-center"><ScoreBadge score={c.overall} /></div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Write `Dashboard.tsx`**

```tsx
// src/pages/Dashboard.tsx
import { Link } from "react-router";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { Podium } from "@/components/common/Podium";
import { StatCard } from "@/components/common/StatCard";
import { Choropleth } from "@/components/charts/Choropleth";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Button } from "@/components/ui/button";
import { formatDate, formatScore } from "@/lib/formatters";

export default function Dashboard() {
  const { countries, categories, profile } = useData();
  const reviewedDates = countries.map((c) => c.lastReviewed).sort();

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Migration Feasibility</h1>
        <p className="text-muted-foreground">
          Ranking countries for the goal: <span className="font-medium text-foreground">{profile.goal}</span>.{" "}
          <Link to="/about" className="text-primary hover:underline">About the method →</Link>
        </p>
      </div>

      <Section title="Top countries"><Podium countries={countries} /></Section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Countries" value={String(countries.length)} />
        <StatCard label="Categories" value={String(categories.length)} hint="weights sum to 100" />
        <StatCard label="Top score" value={formatScore(countries[0]?.overall ?? 0)} hint={countries[0]?.name} />
        <StatCard label="Last reviewed" value={formatDate(reviewedDates[reviewedDates.length - 1])} />
      </div>

      <Section title="World view"><Choropleth countries={countries} /></Section>

      <Section title="Leaderboard" action={<Button asChild variant="outline" size="sm"><Link to="/leaderboard">Full leaderboard →</Link></Button>}>
        <div className="divide-y rounded-lg border">
          {countries.slice(0, 5).map((c) => (
            <Link key={c.id} to={`/country/${c.iso}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted">
              <span className="flex items-center gap-2"><span className="w-6 tabular-nums text-muted-foreground">{c.rank}</span><span aria-hidden>{c.flag}</span><span className="font-medium">{c.name}</span></span>
              <ScoreBadge score={c.overall} />
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
```

- [ ] **Step 5: Verify + commit**

```bash
npm run dev    # podium, stats, map, compact leaderboard render; links work; Ctrl+C
npm run typecheck
git add -A
git commit -m "feat: dashboard — podium, stats, map, compact leaderboard"
```

---

## Task 21: Country detail page

**Files:** Modify `src/pages/CountryDetail.tsx`

- [ ] **Step 1: Write the page** (header, radar, contribution bars, per-category evidence cards, references; placeholder-safe — wireframe §4)

```tsx
// src/pages/CountryDetail.tsx
import { Link, useParams } from "react-router";
import { useCountry, useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { PendingBadge } from "@/components/common/PendingBadge";
import { RadarProfile } from "@/components/charts/RadarProfile";
import { ContributionBars } from "@/components/charts/ContributionBars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";

export default function CountryDetail() {
  const { iso } = useParams();
  const country = useCountry(iso);
  const { categories } = useData();

  if (!country) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Country not found</h1>
        <Link to="/leaderboard" className="text-primary hover:underline">← Back to leaderboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{country.flag}</span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{country.name}</h1>
              <p className="text-sm text-muted-foreground">{country.region} · Rank #{country.rank} · Reviewed {formatDate(country.lastReviewed)}</p>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">{country.summary}</p>
          {country.hasPending && <div className="mt-2"><PendingBadge /> <span className="text-xs text-muted-foreground">Some categories are not yet assessed — overall is provisional.</span></div>}
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Overall</div>
          <ScoreBadge score={country.overall} className="mt-1 text-lg" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Category profile"><RadarProfile countries={[country]} categories={categories} /></Section>
        <Section title="Contribution to overall"><ContributionBars country={country} /></Section>
      </div>

      <Section title="Category detail">
        <div className="grid gap-4 md:grid-cols-2">
          {country.scored.map(({ category, cell }) => (
            <Card key={category.id}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{category.name}</CardTitle>
                {cell ? (cell.status === "pending" ? <PendingBadge /> : <ScoreBadge score={cell.score} />) : <span className="text-muted-foreground">—</span>}
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {!cell || cell.status === "pending" ? (
                  <p className="text-muted-foreground">Not yet assessed.</p>
                ) : (
                  <>
                    {cell.summary && <p>{cell.summary}</p>}
                    {cell.reasoning && <p className="text-muted-foreground">{cell.reasoning}</p>}
                    {cell.evidence && cell.evidence.length > 0 && (
                      <ul className="list-inside list-disc text-muted-foreground">{cell.evidence.map((e, i) => <li key={i}>{e}</li>)}</ul>
                    )}
                    {cell.links && cell.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {cell.links.map((l, i) => <a key={i} href={l.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{l.title} ↗</a>)}
                      </div>
                    )}
                    {cell.lastReviewed && <div className="pt-1 text-xs text-muted-foreground">Reviewed {formatDate(cell.lastReviewed)}</div>}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {country.links.length > 0 && (
        <Section title="References">
          <ul className="space-y-1">
            {country.links.map((l, i) => <li key={i}><a href={l.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{l.title} ↗</a></li>)}
          </ul>
        </Section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify a flagship and a pending country, then commit**

```bash
npm run dev    # /country/DE shows full evidence + sources; /country/NL shows pending placeholders + provisional note; Ctrl+C
npm run typecheck
git add -A
git commit -m "feat: country detail — header, radar, bars, evidence cards, refs"
```

---

## Task 22: Compare page

**Files:** Modify `src/pages/Compare.tsx`

- [ ] **Step 1: Write the page** (pick up to 3; overlaid radar + side-by-side table; per-category winner highlight — wireframe §3)

```tsx
// src/pages/Compare.tsx
import { useState } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { RadarProfile } from "@/components/charts/RadarProfile";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";

export default function Compare() {
  const { countries, categories } = useData();
  const [selected, setSelected] = useState<string[]>(countries.slice(0, 2).map((c) => c.iso));

  const chosen = selected.map((iso) => countries.find((c) => c.iso === iso)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  function setSlot(index: number, iso: string) {
    setSelected((prev) => { const next = [...prev]; next[index] = iso; return next; });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compare</h1>
        <p className="text-sm text-muted-foreground">Compare up to three countries side by side.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[0, 1, 2].map((i) => (
          <Select key={i} value={selected[i] ?? ""} onValueChange={(v) => setSlot(i, v)}>
            <SelectTrigger className="w-48"><SelectValue placeholder={`Country ${i + 1}`} /></SelectTrigger>
            <SelectContent>
              {countries.map((c) => <SelectItem key={c.iso} value={c.iso}>{c.flag} {c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        ))}
        {selected.length > 2 && <Button variant="ghost" size="sm" onClick={() => setSelected((s) => s.slice(0, 2))}>Reset to 2</Button>}
      </div>

      {chosen.length >= 2 && (
        <>
          <Section title="Profiles"><RadarProfile countries={chosen} categories={categories} /></Section>
          <Section title="Category scores">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    {chosen.map((c) => <TableHead key={c.iso} className="text-center">{c.flag} {c.name}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell>Overall</TableCell>
                    {chosen.map((c) => <TableCell key={c.iso} className="text-center"><ScoreBadge score={c.overall} /></TableCell>)}
                  </TableRow>
                  {categories.map((cat) => {
                    const scores = chosen.map((c) => c.categories[cat.id]?.score ?? null);
                    const max = Math.max(...scores.map((s) => s ?? -1));
                    return (
                      <TableRow key={cat.id}>
                        <TableCell title={cat.name}>{cat.shortLabel}</TableCell>
                        {chosen.map((c, idx) => {
                          const s = scores[idx];
                          return (
                            <TableCell key={c.iso} className={cn("text-center", s != null && s === max && "bg-primary/5")}>
                              {s == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={s} />}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run dev    # change selectors; radar overlays; per-category winner highlighted; Ctrl+C
npm run typecheck
git add -A
git commit -m "feat: compare page — selectors, overlaid radar, winner highlight"
```

---

## Task 23: About page

**Files:** Modify `src/pages/About.tsx`

- [ ] **Step 1: Write the page** (profile, goal/pathway, preferences, methodology + weights, links — wireframe §5)

```tsx
// src/pages/About.tsx
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function About() {
  const { profile, categories } = useData();
  const p = profile;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About this tool</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">A transparent, personally-weighted ranking of candidate migration countries. Each country is scored 0–100 per category; a weighted sum (weights total 100) gives the overall score.</p>
      </div>

      <Section title="The household">
        {/* Two peers of equivalent profiles — either can be primary applicant / dependent. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {p.household.people.map((person) => (
            <Card key={person.name}><CardContent className="space-y-1 p-4 text-sm">
              <div className="font-semibold">{person.name}</div>
              <div className="text-muted-foreground">{person.role} · {person.company}</div>
              <div className="text-muted-foreground">{person.location}</div>
              <div className="flex gap-3 pt-1">
                <a href={person.links.portfolio} target="_blank" rel="noreferrer" className="text-primary hover:underline">Portfolio ↗</a>
                <a href={person.links.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">LinkedIn ↗</a>
              </div>
            </CardContent></Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Both hold a {p.education.degree} from {p.education.institution}; either of us can lead the application.</p>
      </Section>

      <Section title="Goal & pathway">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {p.pathway.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className="rounded-md bg-muted px-2.5 py-1 font-medium">{step}</span>
              {i < p.pathway.length - 1 && <span className="text-muted-foreground">→</span>}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Preferences">
        <ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          <li>Regions: {p.preferences.regions.join(", ")}</li>
          <li>Profession priority: {p.preferences.professionPriority}</li>
          <li>Faster citizenship: {p.preferences.fasterCitizenship ? "yes" : "no"}</li>
          <li>Dual citizenship: {p.preferences.dualCitizenship}</li>
          <li>Relocate together: {p.preferences.relocateTogether ? "yes" : "no"}</li>
        </ul>
      </Section>

      <Section title="Scoring methodology">
        <p className="max-w-2xl text-sm text-muted-foreground">Each category carries a fixed weight (its percentage-point ceiling). A country's overall score is the weighted average of its category scores, renormalised over assessed categories. Pending categories are excluded and flagged, not counted as zero.</p>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow><TableHead>Category</TableHead><TableHead className="text-right">Weight</TableHead><TableHead>What it measures</TableHead></TableRow></TableHeader>
            <TableBody>
              {[...categories].sort((a, b) => b.weight - a.weight).map((c) => (
                <TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell className="text-right tabular-nums">{c.weight}</TableCell><TableCell className="text-muted-foreground">{c.description}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* Per-person Portfolio/LinkedIn links live inside each household card above. */}
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run dev    # profile, pathway chips, preferences, weight table render; Ctrl+C
npm run typecheck
git add -A
git commit -m "feat: about page — profile, pathway, preferences, methodology"
```
