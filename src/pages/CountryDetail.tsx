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
