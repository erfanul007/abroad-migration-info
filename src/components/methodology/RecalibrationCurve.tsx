// src/components/methodology/RecalibrationCurve.tsx
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { recalibrate } from "@/lib/scoring";
import { RECALIBRATE } from "@/lib/config";

// Sample the actual recalibrate() across the scale — the curve IS the maths, so it can't drift.
const data = Array.from({ length: 21 }, (_, i) => {
  const raw = i * 5;
  return { raw, shown: Number(recalibrate(raw).toFixed(1)) };
});

/** Visualises the display-only contrast stretch: raw weighted score (x) → shown score (y),
 *  with the pivot (where shown == raw) marked. */
export function RecalibrationCurve() {
  const { pivot } = RECALIBRATE;
  return (
    <figure className="m-0" role="img" aria-label="Display recalibration curve: raw score mapped to shown score">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="raw" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11 }} label={{ value: "Raw weighted score", position: "insideBottom", offset: -4, fontSize: 11 }} />
          <YAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} width={32} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v}`, "Shown"]} labelFormatter={(l) => `Raw ${l}`} />
          <ReferenceLine x={pivot} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="shown" stroke="var(--primary)" dot={false} strokeWidth={2} />
          <ReferenceDot x={pivot} y={pivot} r={4} fill="var(--primary)" stroke="none" />
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
}
