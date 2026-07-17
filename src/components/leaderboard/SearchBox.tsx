import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox({
  value,
  onChange,
  placeholder = "Search countries…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative max-w-xs">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input className="pl-8" placeholder={placeholder} aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
