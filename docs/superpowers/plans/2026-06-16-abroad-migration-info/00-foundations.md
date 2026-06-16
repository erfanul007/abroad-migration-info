# Milestone 0 — Foundations (scaffold & tooling)

Back to [plan index](./README.md). Tasks 1–3. Output: a booting Vite 8 + React 19 + Tailwind v4 + shadcn app with Vitest wired and all runtime libs installed.

---

## Task 1: Initialise Vite + React + TS, base config, Vitest

**Files:** Create `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/index.css`, `src/App.tsx`, `.gitignore`, `src/test/setup.ts`

- [ ] **Step 1: Scaffold Vite into the existing repo** (keeps `docs/`)

```bash
npm create vite@latest . -- --template react-ts
npm install
```
If prompted that the directory is not empty, choose **"Ignore files and continue"**. This scaffolds Vite 8 + React 19.

- [ ] **Step 2: Install Tailwind v4 + test tooling + alias resolver**

```bash
npm install tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D @types/node
```

- [ ] **Step 3: Write `vite.config.ts`** (Tailwind plugin, `@` alias, Pages base path, Vitest config)

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  base: "/abroad-migration-info/", // GitHub Pages project subpath (PRD §10.5)
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

> `@vitejs/plugin-react` is already a dev dependency from the Vite template. If a peer warning appears, run `npm install -D @vitejs/plugin-react`.

- [ ] **Step 4: Path alias + JSON imports + test setup + base CSS**

In `tsconfig.app.json` `compilerOptions`, add:

```jsonc
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] },
"resolveJsonModule": true
```

Add the same `paths` block to `tsconfig.json` `compilerOptions` (editor + shadcn resolution).

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom";
```

Replace `src/index.css` with (shadcn injects tokens here in Task 2):

```css
@import "tailwindcss";
```

Add scripts to `package.json` `"scripts"`:

```jsonc
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc -b --noEmit"
```

- [ ] **Step 5: Verify + commit**

```bash
npm run dev      # boots at printed URL → Ctrl+C
npm run test     # "No test files found" is OK now
```

```bash
git add -A
git commit -m @'
chore: scaffold Vite 8 + React 19 + TS + Tailwind v4 + Vitest

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
'@
```

> Every later commit ends with the same `Co-Authored-By` trailer (omitted below for brevity — always include it).

---

## Task 2: Initialise shadcn/ui (clean modern minimal)

**Files:** Create `components.json`, `src/lib/utils.ts` (CLI), `src/lib/cn.ts`; modify `src/index.css` (tokens)

- [ ] **Step 1: Run shadcn init** (new-york style, neutral base, Tailwind v4)

```bash
npx shadcn@latest init
```
Answer: style **new-york**, base colour **neutral**, CSS variables **yes**. Writes `components.json`, injects tokens into `src/index.css`, creates `src/lib/utils.ts` (`cn`).

- [ ] **Step 2: Add the full primitive set used across the app**

```bash
npx shadcn@latest add button card badge table tooltip select input switch separator popover tabs scroll-area
```

- [ ] **Step 3: Set the single accent token** (matches design-system §2.1)

In `src/index.css`, in the `:root` token block set:

```css
--primary: oklch(0.55 0.18 255);
--primary-foreground: oklch(0.98 0 0);
--ring: oklch(0.55 0.18 255);
```

In the `.dark` block set:

```css
--primary: oklch(0.7 0.16 255);
--primary-foreground: oklch(0.2 0 0);
--ring: oklch(0.7 0.16 255);
```

- [ ] **Step 4: Re-export `cn` at the path the plan imports**

Create `src/lib/cn.ts`:

```ts
export { cn } from "@/lib/utils";
```

- [ ] **Step 5: Verify + commit**

```bash
npm run typecheck
git add -A
git commit -m "chore: init shadcn/ui (new-york, neutral) + accent token"
```

---

## Task 3: Install runtime libraries

**Files:** `package.json`

- [ ] **Step 1: Install routing, table, charts, map**

```bash
npm install react-router @tanstack/react-table recharts d3-geo topojson-client world-atlas lucide-react
npm install -D @types/d3-geo @types/topojson-client topojson-specification
```

> React Router v7 ships in the `react-router` package; do **not** install `react-router-dom`. `world-atlas` provides the bundled `countries-110m.json` topojson (offline map data).

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add -A
git commit -m "chore: add react-router v7, tanstack-table, recharts, d3-geo map deps"
```
