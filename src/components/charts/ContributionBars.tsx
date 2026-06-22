import type { ScoredCountry } from "@/types";
import { formatNumber, formatPercent, scoreTier, tierColor } from "@/lib/formatters";

// Per row: grey TRACK width = weight, coloured FILL runs to score%. So filled length =
// contribution ((score/100)·weight) and grey remainder = headroom. Fill colour = score tier
// (same palette as ScoreBadge). Heaviest weight first; pending → no fill, "n/a".
export function ContributionBars({ country }: { country: ScoredCountry }) {
  const rows = country.scored
    .map((s) => ({
      id: s.category.id,
      name: s.category.name,
      weight: s.category.weight,
      score: s.score, // 0..100 | null (pending/non-derivable)
      contribution: s.contribution, // (score/100)·weight, 0 when non-derivable
    }))
    .sort((a, b) => b.weight - a.weight);

  const maxWeight = Math.max(...rows.map((r) => r.weight), 1);

  return (
    <figure className="m-0" role="img" aria-label={`Category contribution breakdown for ${country.name}`}>
      <ul className="space-y-2">
        {rows.map((r) => {
          const trackPct = (r.weight / maxWeight) * 100; // track width ∝ weight
          const fillPct = r.score == null ? 0 : Math.max(0, Math.min(100, r.score)); // colour fills to score%
          const detail =
            r.score == null
              ? `${r.name}: not yet assessed (weight ${formatNumber(r.weight)})`
              : `${r.name}: ${formatNumber(r.contribution, 2)} of ${formatNumber(r.weight)} pts (${formatPercent(r.score)})`;
          return (
            <li key={r.id} className="flex items-center gap-3 text-xs">
              <span className="w-28 shrink-0 truncate text-muted-foreground" title={r.name}>
                {r.name}
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className="h-3.5 rounded-full bg-muted"
                  style={{ width: `${trackPct}%` }}
                  role="progressbar"
                  aria-label={detail}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={r.score == null ? undefined : Math.round(r.score)}
                  title={detail}
                >
                  {r.score != null && (
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${fillPct}%`, backgroundColor: tierColor(scoreTier(r.score)) }}
                    />
                  )}
                </div>
              </div>
              <span className="w-16 shrink-0 text-right tabular-nums text-muted-foreground">
                {r.score == null ? "n/a" : `${formatNumber(r.contribution, 1)} / ${formatNumber(r.weight)}`}
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 text-[11px] leading-snug text-muted-foreground">
        Bar width = category weight · coloured fill = score earned (tier colour) · grey = headroom
      </figcaption>
    </figure>
  );
}
