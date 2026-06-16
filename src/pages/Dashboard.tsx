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
