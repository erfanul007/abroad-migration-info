import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { FeedbackForm } from "@/components/about/FeedbackForm";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/formatters";
import {
  Users, Route, SlidersHorizontal, Dot,
  GraduationCap, Briefcase, Home, BadgeCheck, Plane,
  MapPin, Zap, Copy, MessageSquare, type LucideIcon,
} from "lucide-react";

// Aligned to profile.pathway order.
const PATHWAY_ICONS: LucideIcon[] = [GraduationCap, Briefcase, Home, BadgeCheck, Plane];

export default function About() {
  const { profile } = useData();
  const p = profile;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">About this tool</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">A transparent, personally-weighted ranking of candidate migration countries for a two-person household. The household pathway and Tanima’s study application have separate requirements. Each country is scored 0–100% per category; a weighted sum (weights total 100%) gives the overall score.</p>
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
        <p className="text-sm text-muted-foreground">Both hold a {p.education.degree} from {p.education.institution}. Individual qualifications and admission conditions are assessed separately.</p>
      </Section>

      {p.household.people.filter((person) => person.study).map((person) => {
        const study = person.study!;
        return <Section key={person.name} title="Tanima’s study profile" icon={GraduationCap}>
          <Card><CardContent className="space-y-4 p-4 text-sm">
            <div><div className="font-semibold">{study.degree} · {study.institution}</div>
              <p>CGPA {formatNumber(study.cgpa, 2)} / {formatNumber(4)} · {formatNumber(study.localCredits)} local credits · {study.nationality}</p>
              <p className="text-muted-foreground">German grade approximately {formatNumber(study.germanGrade, 2)} — {study.gradeEvidence}</p>
            </div>
            <div><p>{study.english.test}: {formatNumber(study.english.overall, 1)} · tested {formatDate(study.english.date)}</p>
              <p className="text-muted-foreground">Listening {formatNumber(study.english.listening, 1)} · Reading {formatNumber(study.english.reading, 1)} · Writing {formatNumber(study.english.writing, 1)} · Speaking {formatNumber(study.english.speaking, 1)}</p>
            </div>
            <div><p>{study.language} · {study.intakes.join("; ")}</p><p>{study.funding}</p>
              <p className="text-muted-foreground">Preferred cities: {study.preferredCities.join(", ")}</p>
              <p className="text-muted-foreground">Research interests: {study.researchInterests.join("; ")}</p>
            </div>
            {study.admissions.map((offer) => <div key={offer.institution} className="rounded-md border p-3">
              <p className="font-medium">{offer.institution} · {offer.programme} · {offer.intake}</p>
              <p>{offer.status}{!offer.documentVerified && " — offer letter not inspected; conditions and acceptance deadline still need checking."}</p>
            </div>)}
            <div><p className="font-medium">Application preparation</p><ul className="list-disc space-y-1 pl-5 text-muted-foreground">{study.checks.map((check) => <li key={check}>{check}</li>)}</ul></div>
            <p className="text-xs text-muted-foreground">Evidence: {study.evidence.join("; ")}. Reviewed {formatDate(study.lastReviewed)}. Local credit hours are not a universal ECTS certificate.</p>
          </CardContent></Card>
        </Section>;
      })}

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

      <Section title="Feedback" icon={MessageSquare}>
        <FeedbackForm />
      </Section>
    </div>
  );
}
