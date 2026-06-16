// src/pages/About.tsx
import { useMemo } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function About() {
  const { profile, categories } = useData();
  const p = profile;
  const sortedCategories = useMemo(() => [...categories].sort((a, b) => b.weight - a.weight), [categories]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About this tool</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">A transparent, personally-weighted ranking of candidate migration countries. Each country is scored 0–100 per category; a weighted sum (weights total 100) gives the overall score.</p>
      </div>

      <Section title="Who this is for">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card><CardContent className="space-y-1 p-4 text-sm">
            <div className="font-semibold">{p.applicant.name}</div>
            <div className="text-muted-foreground">{p.applicant.role} · {p.applicant.company}</div>
            <div className="text-muted-foreground">{p.applicant.location}</div>
          </CardContent></Card>
          <Card><CardContent className="space-y-1 p-4 text-sm">
            <div className="font-semibold">Spouse</div>
            <div className="text-muted-foreground">{p.spouse.role} · {p.spouse.company} · {p.spouse.experienceYears}+ yrs</div>
            <div className="text-muted-foreground">{p.spouse.location}</div>
          </CardContent></Card>
        </div>
        <p className="text-sm text-muted-foreground">Both hold {p.education.degree} from {p.education.institution}.</p>
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
          <li>Spouse accompanies: {p.preferences.spouseAccompanies ? "yes" : "no"}</li>
        </ul>
      </Section>

      <Section title="Scoring methodology">
        <p className="max-w-2xl text-sm text-muted-foreground">Each category carries a fixed weight (its percentage-point ceiling). A country's overall score is the weighted average of its category scores, renormalised over assessed categories. Pending categories are excluded and flagged, not counted as zero.</p>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow><TableHead>Category</TableHead><TableHead className="text-right">Weight</TableHead><TableHead>What it measures</TableHead></TableRow></TableHeader>
            <TableBody>
              {sortedCategories.map((c) => (
                <TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell className="text-right tabular-nums">{c.weight}</TableCell><TableCell className="text-muted-foreground">{c.description}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Links">
        <div className="flex gap-3 text-sm">
          <a href={p.links.portfolio} target="_blank" rel="noreferrer" className="text-primary hover:underline">Portfolio ↗</a>
          <a href={p.links.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">LinkedIn ↗</a>
        </div>
      </Section>
    </div>
  );
}
