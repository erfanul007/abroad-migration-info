// src/lib/utils.ts
// Canonical `cn` helper (shadcn `utils` alias in components.json). Merges class lists with
// clsx and resolves Tailwind conflicts via tailwind-merge. Import from "@/lib/utils".
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
