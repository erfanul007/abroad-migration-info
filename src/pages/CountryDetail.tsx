import { Link, useParams } from "react-router";
import { useCountry, useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { PendingBadge } from "@/components/common/PendingBadge";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { CategoryFactorDialog } from "@/components/country/CategoryFactorDialog";
import { byWeightDesc } from "@/lib/selectors";
import { RadarProfile } from "@/components/charts/RadarProfile";
import { ContributionBars } from "@/components/charts/ContributionBars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import { Radar, BarChart3, LayoutGrid, BookMarked } from "lucide-react";

export default function CountryDetail() {
  const { iso } = useParams();
  const country = useCountry(iso);
  const { categories } = useData();

  if (!country) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">Country not found</h1>
        <Link to="/leaderboard" className="text-primary hover:underline">← Back to leaderboard</Link>
      </div>
    );
  }

  // Heaviest-weight first, matching leaderboard column order.
  const orderedScored = [...country.scored].sort((a, b) => byWeightDesc(a.category, b.category));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{country.flag}</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{country.name}</h1>
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
        <Section title="Category profile" icon={Radar}><RadarProfile countries={[country]} categories={categories} /></Section>
        <Section title="Contribution to overall" icon={BarChart3}><ContributionBars country={country} /></Section>
      </div>

      <Section title="Category detail" icon={LayoutGrid}>
        <div className="grid gap-4 md:grid-cols-2">
          {orderedScored.map(({ category, cell, score }) => (
            <Card key={category.id}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{category.name}</CardTitle>
                {cell && cell.status === "scored" && score !== null ? (
                  <ScoreBadge score={score} />
                ) : cell ? (
                  <PendingBadge />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {!cell || cell.status === "pending" ? (
                  <p className="text-muted-foreground">Not yet assessed.</p>
                ) : (
                  <>
                    {cell.summary && <p>{cell.summary}</p>}
                    {cell.pros.length > 0 && (
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Pros</div>
                        <ul className="list-inside list-disc space-y-0.5">
                          {cell.pros.map((p) => (
                            <li key={p.text}>
                              {p.text}
                              {p.severity === "highlight" && <SeverityBadge severity="highlight" />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cell.cons.length > 0 && (
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">Cons</div>
                        <ul className="list-inside list-disc space-y-0.5">
                          {cell.cons.map((co) => (
                            <li key={co.text}>
                              {co.text}
                              {co.severity === "blocker" && <SeverityBadge severity="blocker" />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {score !== null && (
                      <div className="pt-1">
                        <CategoryFactorDialog category={category} cell={cell} score={score} />
                      </div>
                    )}
                    {cell.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {cell.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{l.title} ↗</a>)}
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
        <Section title="References" icon={BookMarked}>
          <ul className="space-y-1">
            {country.links.map((l) => <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{l.title} ↗</a></li>)}
          </ul>
        </Section>
      )}
    </div>
  );
}
