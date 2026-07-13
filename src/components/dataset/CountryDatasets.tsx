import { useMemo } from "react";
import { Building2, GraduationCap } from "lucide-react";
import { getDatasets } from "@/lib/data";
import { DatasetModal } from "@/components/dataset/DatasetModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The supplementary-dataset launch buttons for a country. Renders a button per dataset the
 *  country actually has (city scoreboard, university ranking); renders nothing when it has none. */
export function CountryDatasets({ iso, className }: { iso: string; className?: string }) {
  const { cities, universities } = useMemo(() => getDatasets(iso), [iso]);
  if (!cities && !universities) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {cities && (
        <DatasetModal
          dataset={cities}
          trigger={
            <Button variant="outline" size="sm">
              <Building2 aria-hidden />
              Cities
            </Button>
          }
        />
      )}
      {universities && (
        <DatasetModal
          dataset={universities}
          trigger={
            <Button variant="outline" size="sm">
              <GraduationCap aria-hidden />
              Universities
            </Button>
          }
        />
      )}
    </div>
  );
}
