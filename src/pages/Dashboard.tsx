import { Link } from "react-router";
import { useData } from "@/hooks/useData";
import { useScoreboard } from "@/hooks/useScoreboard";
import { Section } from "@/components/common/Section";
import { Podium } from "@/components/common/Podium";
import { StatCard } from "@/components/common/StatCard";
import { Choropleth } from "@/components/charts/Choropleth";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import { TOP_N } from "@/lib/config";
import { Globe, Scale, Trophy, CalendarClock, Map, ListOrdered, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { countries, categories, profile } = useData();
  const board = useScoreboard();
  const reviewedDates = countries.map((c) => c.lastReviewed).sort();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Migration Feasibility</h1>
        <p className="text-sm text-muted-foreground">
          Ranking countries for the goal: <span className="font-medium text-foreground">{profile.goal}</span>.{" "}
          <Link to="/methodology" className="text-primary hover:underline">How scoring works →</Link>
        </p>
      </div>

      <Section title="Top countries" icon={Trophy}><Podium countries={countries} /></Section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Countries" value={String(countries.length)} icon={Globe} />
        <StatCard label="Categories" value={String(categories.length)} hint="weights total 100%" icon={Scale} />
        <StatCard label="Top score" badge={<ScoreBadge score={board.countries[0]?.overall ?? 0} />} hint={board.countries[0]?.name} icon={Trophy} />
        <StatCard label="Last reviewed" value={reviewedDates.length ? formatDate(reviewedDates[reviewedDates.length - 1]) : "—"} icon={CalendarClock} />
      </div>

      <Section title="World view" icon={Map}><Choropleth countries={countries} /></Section>

      <Section title="Leaderboard" icon={ListOrdered} action={<Button asChild variant="outline" size="sm"><Link to="/leaderboard">Full leaderboard <ArrowRight className="size-4" /></Link></Button>}>
        <div className="divide-y rounded-lg border">
          {board.countries.slice(0, TOP_N.dashboard).map((c) => (
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
