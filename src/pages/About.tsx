// src/pages/About.tsx
import { useMemo } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users, Route, SlidersHorizontal, Calculator, Dot,
  GraduationCap, Briefcase, Home, BadgeCheck, Plane,
  MapPin, Zap, Copy, type LucideIcon,
} from "lucide-react";

// Icon per pathway step, aligned to profile.pathway order.
const PATHWAY_ICONS: LucideIcon[] = [GraduationCap, Briefcase, Home, BadgeCheck, Plane];

export default function About() {
  const { profile, categories } = useData();
  const p = profile;
  const sortedCategories = useMemo(() => [...categories].sort((a, b) => b.weight - a.weight), [categories]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">About this tool</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">A transparent, personally-weighted ranking of candidate migration countries for a two-person household — both software engineers with equivalent profiles. Either partner can be the primary applicant and the other the dependent, so categories are weighted to suit whichever of us leads. Each country is scored 0–100% per category; a weighted sum (weights total 100%) gives the overall score.</p>
      </div>

      <Section title="The household" icon={Users}>
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
        <p className="text-sm text-muted-foreground">Both hold a {p.education.degree} from {p.education.institution}. With equivalent profiles, either of us can lead the application — the other joins as the dependent.</p>
      </Section>

      <Section title="Goal & pathway" icon={Route}>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {p.pathway.map((step, i) => {
            const StepIcon = PATHWAY_ICONS[i] ?? Dot;
            return (
              <span key={step} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-medium">
                  <StepIcon className="size-4 text-muted-foreground" aria-hidden />{step}
                </span>
                {i < p.pathway.length - 1 && <span className="text-muted-foreground" aria-hidden>→</span>}
              </span>
            );
          })}
        </div>
      </Section>

      <Section title="Preferences" icon={SlidersHorizontal}>
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0" aria-hidden />Regions: {p.preferences.regions.join(", ")}</li>
          <li className="flex items-center gap-2"><Briefcase className="size-4 shrink-0" aria-hidden />Profession priority: {p.preferences.professionPriority}</li>
          <li className="flex items-center gap-2"><Zap className="size-4 shrink-0" aria-hidden />Faster citizenship: {p.preferences.fasterCitizenship ? "yes" : "no"}</li>
          <li className="flex items-center gap-2"><Copy className="size-4 shrink-0" aria-hidden />Dual citizenship: {p.preferences.dualCitizenship}</li>
          <li className="flex items-center gap-2"><Users className="size-4 shrink-0" aria-hidden />Relocate together: {p.preferences.relocateTogether ? "yes" : "no"}</li>
        </ul>
      </Section>

      <Section title="Scoring methodology" icon={Calculator}>
        <p className="max-w-2xl text-sm text-muted-foreground">Each category carries a fixed weight (its percentage-point ceiling). A country's overall score is the weighted average of its category scores. Pending categories use a provisional placeholder score (flagged as not yet sourced) and are included in the overall — the country is then marked provisional. Categories entirely absent from the data are excluded and the remaining weights renormalised; nothing is silently counted as zero.</p>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow><TableHead>Category</TableHead><TableHead className="text-right">Weight</TableHead><TableHead>What it measures</TableHead></TableRow></TableHeader>
            <TableBody>
              {sortedCategories.map((c) => (
                <TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell className="text-right tabular-nums">{c.weight}%</TableCell><TableCell className="text-muted-foreground">{c.description}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>
    </div>
  );
}
