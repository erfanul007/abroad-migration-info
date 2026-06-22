import { useMemo } from "react";
import board from "@/data/cache/scoreboard.json";
import type { Scoreboard } from "@/lib/scoreboard";

/** Read-only access to the generated scoreboard without recomputing.
 *  Drift-guarded by src/data/cache/scoreboard.test.ts. */
export function useScoreboard(): Scoreboard {
  return useMemo(() => board as Scoreboard, []);
}
