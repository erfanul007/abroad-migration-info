import type { DatasetRow } from "@/types";

type Evidence = NonNullable<NonNullable<DatasetRow["detail"]>["immigration"]>;

export function ImmigrationEvidence({ evidence }: { evidence: Evidence }) {
  const confidenceLabel = `${evidence.confidence[0].toUpperCase()}${evidence.confidence.slice(1)} confidence`;
  const items = [
    ["Published time", evidence.publishedTime],
    ["What that time covers", evidence.timeScope],
    ["Application route", evidence.applicationChannel],
    ["When full-time work may start", evidence.workStart],
  ];
  return (
    <section aria-label="Conversion and work authorisation evidence" className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div><h4 className="font-semibold">Conversion & work authorisation</h4><p className="text-xs text-muted-foreground">Local authority evidence; card production is not treated as total processing time.</p></div>
        <div className="flex gap-2 text-xs"><span className="rounded-full bg-muted px-2 py-1 font-medium">{confidenceLabel}</span><span className="px-1 py-1 text-muted-foreground">Verified {evidence.asOf}</span></div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt><dd>{value}</dd></div>)}
      </dl>
    </section>
  );
}
