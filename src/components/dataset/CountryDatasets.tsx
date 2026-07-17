import { useMemo } from "react";
import { Link } from "react-router";
import { Building2, GraduationCap } from "lucide-react";
import { getDatasets } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The supplementary-dataset launch controls for a country. Renders a link per dataset the
 *  country actually has (city scoreboard, university ranking); renders nothing when it has none. */
export function CountryDatasets({ iso, className }: { iso: string; className?: string }) {
  const { cities, universities } = useMemo(() => getDatasets(iso), [iso]);
  if (!cities && !universities) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {universities && (
        <Button asChild variant="outline" size="sm">
          <Link to={`/country/${iso}/universities`}>
            <GraduationCap aria-hidden />
            Universities
          </Link>
        </Button>
      )}
      {cities && (
        <Button asChild variant="outline" size="sm">
          <Link to={`/country/${iso}/cities`}>
            <Building2 aria-hidden />
            Cities
          </Link>
        </Button>
      )}
    </div>
  );
}
