// Canonical `cn` helper (shadcn `utils` alias in components.json); resolves Tailwind class
// conflicts via tailwind-merge. Import from "@/lib/utils".
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
