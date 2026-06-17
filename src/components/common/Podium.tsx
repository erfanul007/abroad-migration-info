// src/components/common/Podium.tsx
import { Link } from "react-router";
import { Crown, Medal } from "lucide-react";
import type { ScoredCountry } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { topN } from "@/lib/selectors";
import { TOP_N } from "@/lib/config";

export function Podium({ countries }: { countries: ScoredCountry[] }) {
  const top = topN(countries, TOP_N.podium);
  const order = [1, 0, 2]; // visual: 2nd, 1st, 3rd
  return (
    <div className="grid grid-cols-3 gap-3">
      {order.map((i) => {
        const c = top[i];
        if (!c) return <div key={i} />;
        const raised = i === 0 ? "sm:-translate-y-3" : "";
        return (
          <Link key={c.id} to={`/country/${c.iso}`} className={`transition-transform ${raised}`}>
            <Card className="text-center hover:border-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                  {i === 0 ? <Crown className="size-4 text-primary" aria-hidden /> : <Medal className="size-4" aria-hidden />}#{c.rank}
                </div>
                <div className="my-1 text-3xl" aria-hidden>{c.flag}</div>
                <div className="truncate font-semibold">{c.name}</div>
                <div className="mt-2 flex justify-center"><ScoreBadge score={c.overall} /></div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
