import { useMemo } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { TierLegend } from "@/components/common/TierLegend";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { CategoryWeightPie } from "@/components/methodology/CategoryWeightPie";
import { CategoryTile } from "@/components/methodology/CategoryTile";
import { INCLUSION_MIN } from "@/lib/config";
import { categoryColor } from "@/lib/palette";
import { byWeightDesc } from "@/lib/selectors";
import { formatPercent } from "@/lib/formatters";
import { Calculator, Palette, Flag, Scale } from "lucide-react";

export default function Methodology() {
  const { categories } = useData();
  const sortedCategories = useMemo(() => [...categories].sort(byWeightDesc), [categories]);
  const colorById = useMemo(
    () => Object.fromEntries(categories.map((c, i) => [c.id, categoryColor(i, categories.length)])),
    [categories],
  );

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Methodology</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          How every country's score is built — from individual factor sub-scores up to the overall ranking.
          Each factor is scored 0–100% on an absolute scale; every weight and threshold below is read live from
          the scoring data and configuration, not hardcoded.
        </p>
      </div>

      <Section title="How the score is built" icon={Calculator}>
        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">Factor → category.</span> A category's score is the weighted mean of its factor sub-scores (factor weights sum to {formatPercent(100)} within the category). A category is scored only once all its factors are sourced; otherwise it stays pending.</li>
          <li><span className="font-medium text-foreground">Category → overall.</span> The overall is the weighted mean of category scores (category weights sum to {formatPercent(100)}). Pending or absent categories are excluded and the remaining weights renormalised — never counted as zero. The result is the exact value shown and ranked — no display curve is applied.</li>
          <li><span className="font-medium text-foreground">Tiering & inclusion.</span> Scores map to colour tiers (below). Countries scoring below {formatPercent(INCLUSION_MIN)} overall are surfaced for removal, not silently dropped.</li>
        </ol>
        <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
          category = Σ(factorScore × factorWeight) ÷ Σ(factorWeight)<br />
          overall&nbsp;&nbsp;= Σ(categoryScore × categoryWeight) ÷ Σ(categoryWeight present)
        </div>
      </Section>

      <Section title="Score tiers" icon={Palette}>
        <p className="max-w-2xl text-sm text-muted-foreground">Every score maps to five absolute tiers, used across the whole app:</p>
        <TierLegend />
      </Section>

      <Section title="Flags" icon={Flag}>
        <p className="max-w-2xl text-sm text-muted-foreground">Two flags annotate a country without changing its number — they surface a decisive tradeoff:</p>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-emerald-700 dark:text-emerald-300">Open direct work visa for Bangladeshi engineers</span>
            <SeverityBadge severity="highlight" />
            <span className="text-muted-foreground"> — a positive highlight: the country can be entered via a direct skilled-work route, not only the study-first path.</span>
          </li>
          <li>
            <span className="text-muted-foreground">Dual citizenship not retained when naturalising</span>
            <SeverityBadge severity="blocker" />
            <span className="text-muted-foreground"> — a blocker flag: a known hard tradeoff to weigh, not an automatic disqualifier.</span>
          </li>
        </ul>
      </Section>

      <Section title="Category weights" icon={Scale}>
        <p className="max-w-2xl text-sm text-muted-foreground">How the overall {formatPercent(100)} splits across the {categories.length} categories. Hover a slice for its weight; each tile below carries its colour. Open any category for its full factor table.</p>
        <CategoryWeightPie categories={categories} colorById={colorById} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map((c) => <CategoryTile key={c.id} category={c} color={colorById[c.id]} />)}
        </div>
      </Section>
    </div>
  );
}
