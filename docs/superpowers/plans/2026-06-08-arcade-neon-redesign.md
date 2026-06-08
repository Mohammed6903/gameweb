# Arcade Neon Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic, inconsistent UI with a cohesive dark-only "Arcade Neon" theme (glowing cyan + hot-magenta on space-black) across the main UI and admin panel.

**Architecture:** The app already consumes OKLCH theme tokens via `tailwind.config.ts`, so most of the recolor cascades from rewriting the tokens in `globals.css`. We then add a display font (Orbitron) + body font (Chakra Petch), neon utility classes, neon button variants, and finally hand-tune each surface and strip hardcoded colors. No logic, data, routing, or schema changes — purely presentational.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS (class dark mode, OKLCH tokens), shadcn/Radix UI, `next/font/google`, framer-motion, ApexCharts.

**Verification model:** This is a styling change, so "tests" are: (a) `npm run build` succeeds, (b) `npm run lint` is clean, (c) visual eyeball via `npm run dev` (port 8080). Each task ends by running the relevant check and committing. There are no unit tests in this repo and none are added (YAGNI for pure CSS).

**Reference:** Design spec at `docs/superpowers/specs/2026-06-08-arcade-neon-redesign-design.md`.

**Palette quick-reference (OKLCH `L C H`, used throughout):**
- background `0.10 0.04 285` · card `0.16 0.05 285` · popover `0.16 0.05 285`
- foreground `0.95 0.02 285` · muted `0.20 0.04 285` · muted-foreground `0.72 0.04 285`
- primary (cyan) `0.85 0.16 200` · primary-foreground `0.12 0.03 250`
- secondary/accent (magenta) `0.65 0.27 350` · accent-foreground `0.98 0.01 350`
- violet (gradients only) `0.55 0.25 290`
- destructive `0.62 0.24 25` · border `0.30 0.06 285` · input `0.18 0.04 285` · ring `0.85 0.16 200`
- charts: cyan `0.85 0.16 200`, magenta `0.65 0.27 350`, violet `0.55 0.25 290`, amber `0.80 0.16 75`, lime `0.85 0.20 130`

**Hex equivalents (for ApexCharts, which needs hex/rgb not oklch):** cyan `#22e3ff`, magenta `#ff3 db` → use `#ff37d6`, violet `#8b3bff`, amber `#ffb43b`, lime `#9bf03b`, axis/grid muted `#9b8fc7` / `#2a1c52`.

---

## Task 1: Rewrite color tokens + body in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the `:root` block, delete `.dark` block and light sidebar overrides, retune body**

Replace everything from `:root {` through the end of the second `@layer base { :root {...} .dark {...} }` sidebar block with the following. Keep the `@tailwind` directives at top and the `.hide-scrollbar`/`@layer utilities .text-balance` blocks (the scrollbar block is retuned below).

```css
:root {
  /* Arcade Neon — single dark palette (no light mode) */
  --background: 0.10 0.04 285;
  --foreground: 0.95 0.02 285;
  --card: 0.16 0.05 285;
  --card-foreground: 0.95 0.02 285;
  --popover: 0.16 0.05 285;
  --popover-foreground: 0.95 0.02 285;

  /* Neon cyan primary */
  --primary: 0.85 0.16 200;
  --primary-foreground: 0.12 0.03 250;
  /* Hot magenta secondary/accent */
  --secondary: 0.65 0.27 350;
  --secondary-foreground: 0.98 0.01 350;

  --muted: 0.20 0.04 285;
  --muted-foreground: 0.72 0.04 285;
  --accent: 0.65 0.27 350;
  --accent-foreground: 0.98 0.01 350;

  --destructive: 0.62 0.24 25;
  --destructive-foreground: 0.98 0 0;
  --border: 0.30 0.06 285;
  --input: 0.18 0.04 285;
  --ring: 0.85 0.16 200;

  --chart-1: 0.85 0.16 200;
  --chart-2: 0.65 0.27 350;
  --chart-3: 0.55 0.25 290;
  --chart-4: 0.80 0.16 75;
  --chart-5: 0.85 0.20 130;

  --radius: 0.75rem;

  /* Sidebar (single dark set) */
  --sidebar-background: 0.13 0.045 285;
  --sidebar-foreground: 0.92 0.02 285;
  --sidebar-primary: 0.85 0.16 200;
  --sidebar-primary-foreground: 0.12 0.03 250;
  --sidebar-accent: 0.20 0.05 285;
  --sidebar-accent-foreground: 0.95 0.02 285;
  --sidebar-border: 0.30 0.06 285;
  --sidebar-ring: 0.85 0.16 200;
}
```

- [ ] **Step 2: Replace the `body` font rule and the `@layer base` body background**

Replace the `body { font-family: Arial, Helvetica, sans-serif; }` rule with nothing (the font is set via Tailwind class in Task 3). Replace the final `@layer base { body { ... } }` background with retuned neon glows:

```css
@layer base {
  * {
    border-color: oklch(var(--border));
    outline-color: oklch(var(--ring) / 0.5);
  }
  body {
    background-color: oklch(var(--background));
    color: oklch(var(--foreground));
    background-image:
      radial-gradient(1100px 550px at 12% -10%, oklch(var(--primary)/0.10), transparent 60%),
      radial-gradient(950px 520px at 88% -5%, oklch(var(--accent)/0.14), transparent 60%),
      radial-gradient(800px 600px at 50% 110%, oklch(0.55 0.25 290 / 0.10), transparent 60%);
    background-attachment: fixed;
  }
}
```

- [ ] **Step 3: Retune the custom scrollbar to cyan**

Replace the `.custom-scrollbar::-webkit-scrollbar-thumb` colors:

```css
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: oklch(var(--primary) / 0.4);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: oklch(var(--primary) / 0.7);
}
```
Also set `scrollbar-color: oklch(var(--primary)/0.4) transparent;` in `.custom-scrollbar`.

- [ ] **Step 4: Add neon utility classes**

Append to `globals.css`:

```css
@layer utilities {
  .font-display { font-family: var(--font-display), system-ui, sans-serif; }

  .text-glow-cyan { text-shadow: 0 0 18px oklch(var(--primary) / 0.55); }
  .text-glow-magenta { text-shadow: 0 0 18px oklch(var(--accent) / 0.55); }

  .neon-cyan { box-shadow: 0 0 18px oklch(var(--primary) / 0.45); }
  .neon-magenta { box-shadow: 0 0 18px oklch(var(--accent) / 0.5); }

  /* Glow border for cards on hover */
  .neon-border-hover {
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .neon-border-hover:hover {
    border-color: oklch(var(--primary));
    box-shadow: 0 0 26px oklch(var(--primary) / 0.40);
  }

  /* Glowing gradient accent rail before a section title */
  .section-rail::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1.1em;
    margin-right: 0.6rem;
    vertical-align: -0.15em;
    border-radius: 2px;
    background: linear-gradient(oklch(var(--primary)), oklch(var(--accent)));
    box-shadow: 0 0 10px oklch(var(--primary) / 0.8);
  }
}
```

- [ ] **Step 5: Verify build compiles the CSS**

Run: `npm run build`
Expected: Build completes without CSS/Tailwind errors. (App will look partially restyled; fonts come next.)

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): rewrite tokens to Arcade Neon dark palette + neon utilities"
```

---

## Task 2: Wire fonts + remove Geist + force dark in `layout.tsx` and `tailwind.config.ts`

**Files:**
- Modify: `src/app/layout.tsx:1-25` (font setup), `:130-145` (html/body)
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the font loaders in `layout.tsx`**

Replace the `localFont` Geist setup (lines ~10-22) with Google fonts:

```tsx
import { Orbitron, Chakra_Petch } from "next/font/google";

const fontDisplay = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const fontSans = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
```
Remove the `import localFont from "next/font/local";` line.

- [ ] **Step 2: Update `<html>`/`<body>` to force dark and apply the sans font**

Change the `<html lang="en">` open tag to `<html lang="en" className="dark">` and update the body className:

```tsx
<body className={`${fontDisplay.variable} ${fontSans.variable} font-sans antialiased`}>
```
(Remove references to `geistSans.variable` / `geistMono.variable`.)

- [ ] **Step 3: Remove the `ThemeProvider` wrapper**

In `layout.tsx`, remove `import { ThemeProvider } from "@/components/theme/theme-provider";` and unwrap its children — replace:
```tsx
<ThemeProvider defaultTheme="system" storageKey="gameweb-theme">
  {children}
</ThemeProvider>
```
with just `{children}`.

- [ ] **Step 4: Add font families to `tailwind.config.ts`**

In `theme.extend`, add alongside `colors`:
```ts
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  display: ['var(--font-display)', 'system-ui', 'sans-serif'],
},
```

- [ ] **Step 5: Delete the now-unused local Geist font files reference**

Leave the `.woff` files on disk (harmless), but confirm no code imports them: `grep -rn "GeistVF\|GeistMono\|font-geist" src/` returns nothing.

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds; Google fonts fetched at build time. If the build environment has no network for Google Fonts, note it and fall back to `next/font/local` is NOT needed — Next caches fonts; if it fails, report to user rather than working around.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx tailwind.config.ts
git commit -m "feat(theme): add Orbitron + Chakra Petch fonts, force dark, drop ThemeProvider"
```

---

## Task 3: Delete dead theme components + remove toggle from nav

**Files:**
- Delete: `src/components/theme/theme-provider.tsx`, `src/components/theme/theme-toggle.tsx`, `src/components/theme-switcher.tsx`
- Modify: `src/components/nav-bar.tsx`

- [ ] **Step 1: Remove the ThemeToggle from the nav bar**

In `src/components/nav-bar.tsx`, remove `import { ThemeToggle } from "./theme/theme-toggle"` and remove the `<ThemeToggle />` element (and the `{/* Theme Toggle Added Here */}` comment).

- [ ] **Step 2: Verify nothing else imports the theme files**

Run: `grep -rn "theme/theme-toggle\|theme/theme-provider\|theme-switcher\|ThemeSwitcher\|ThemeToggle\|useTheme" src/`
Expected: No results (other than the files about to be deleted). If any other file uses them, fix that import to remove the usage before deleting.

- [ ] **Step 3: Delete the files**

```bash
git rm src/components/theme/theme-provider.tsx src/components/theme/theme-toggle.tsx src/components/theme-switcher.tsx
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: Both succeed, no missing-module errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(theme): remove theme toggle/provider/switcher (dark-only)"
```

---

## Task 4: Add neon button + badge variants

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/badge.tsx`

- [ ] **Step 1: Add `neon` and `neonMagenta` variants to `button.tsx`**

In `buttonVariants` `variant` map, add:
```ts
neon:
  "font-display font-bold tracking-wide text-primary-foreground bg-primary shadow-[0_0_18px_oklch(var(--primary)/0.45)] hover:shadow-[0_0_26px_oklch(var(--primary)/0.65)] hover:bg-primary/90 transition-shadow",
neonMagenta:
  "font-display font-bold tracking-wide text-accent-foreground bg-accent shadow-[0_0_18px_oklch(var(--accent)/0.5)] hover:shadow-[0_0_26px_oklch(var(--accent)/0.7)] hover:bg-accent/90 transition-shadow",
```
Also update the base `focus-visible:ring-1 focus-visible:ring-ring` to add a glow: append `focus-visible:shadow-[0_0_14px_oklch(var(--ring)/0.5)]` to the base cva string.

- [ ] **Step 2: Read and update `badge.tsx`**

Read `src/components/ui/badge.tsx`. Add a `neon` variant (cyan glow) to its variants:
```ts
neon: "border-transparent bg-primary text-primary-foreground shadow-[0_0_12px_oklch(var(--primary)/0.6)]",
```
Keep `default`/`secondary`/`outline`/`destructive` but ensure `secondary` maps to the magenta accent (it already uses `bg-secondary`).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/badge.tsx
git commit -m "feat(ui): add neon button + badge variants with glow"
```

---

## Task 5: Restyle the nav bar

**Files:**
- Modify: `src/components/nav-bar.tsx`

- [ ] **Step 1: Logo mark + wordmark**

Replace the logo block so the mark is a gradient with glow and the wordmark uses the display font with a cyan→white clip:
```tsx
<Link href="/" className="flex items-center gap-3">
  <div className="size-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[oklch(0.55_0.25_290)] to-accent shadow-[0_0_16px_oklch(var(--accent)/0.6)]">
    <img src={favIcon?.publicUrl ? favIcon?.publicUrl : '/favicon.ico'} alt="icon" className="size-5" />
  </div>
  <span className="font-display font-extrabold tracking-wide text-lg bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
    {siteName ? siteName : process.env.NEXT_PUBLIC_SITE_NAME}
  </span>
</Link>
```

- [ ] **Step 2: Header border/blur + Sign In as neon**

Change the `<header>` className border to `border-b border-border bg-card/80 backdrop-blur-md shadow-[0_8px_30px_oklch(0_0_0/0.4)]`. Change the Sign In `<Button>` to `variant="neon"` and drop its custom `bg-primary...` classes (keep `size="sm"` and `className="hidden sm:inline-flex ml-1.5"`).

- [ ] **Step 3: Verify build + visual**

Run: `npm run build`
Expected: Succeeds. (Visual eyeball deferred to Task 12.)

- [ ] **Step 4: Commit**

```bash
git add src/components/nav-bar.tsx
git commit -m "feat(ui): neon nav bar — glowing logo, display wordmark, neon sign-in"
```

---

## Task 6: Restyle the app sidebar

**Files:**
- Modify: `src/components/app-sidebar.tsx`

- [ ] **Step 1: Display-font header + uppercase rail labels**

Change the `SidebarHeader` `<h1>` to add `font-display tracking-wide text-glow-cyan`. Group labels (`Navigation`, `Categories`) keep their uppercase tracking; no change needed beyond tokens.

- [ ] **Step 2: Active/hover glow rail on items**

For both nav items and category items, change the link className hover state from `hover:bg-muted ... hover:text-foreground` to:
```
text-muted-foreground hover:text-foreground rounded-md transition-all duration-200
hover:bg-[linear-gradient(90deg,oklch(0.55_0.25_290/0.22),transparent)] hover:shadow-[inset_3px_0_0_oklch(var(--primary))]
```
Category count chip: change to `text-xs bg-muted px-2 py-0.5 rounded text-primary border border-border`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/app-sidebar.tsx
git commit -m "feat(ui): neon app sidebar — glow rail active state, display header"
```

---

## Task 7: Restyle the dashboard hero + section headings

**Files:**
- Modify: `src/app/(dashboard)/page.tsx`

- [ ] **Step 1: Hero section**

In the Welcome `<section>`, change to display-font glowing title and neon glass chips:
- Outer section: keep `relative overflow-hidden bg-card border border-border rounded-xl p-6 md:p-8` and add `shadow-[0_0_40px_oklch(0.55_0.25_290/0.2)]`.
- Inner gradient overlay: change to `bg-gradient-to-br from-[oklch(0.55_0.25_290/0.35)] via-accent/15 to-transparent`.
- Icon tile: `bg-primary/15 border border-primary/30 shadow-[0_0_16px_oklch(var(--primary)/0.4)]`, icon `text-primary`.
- `<h1>`: add `font-display text-glow-cyan` to existing classes.
- The three stat `<Button variant="ghost">`: replace with chip styling `className="flex items-center gap-2 rounded-lg bg-card/70 border border-border px-4 py-2 hover:border-primary/50 transition-colors"`, keep icons but set the count icons to `text-primary` and number stays foreground.

- [ ] **Step 2: Section headings (Featured + categories)**

Add the glowing rail + display font to the two `<h2>` headings. Change `className="text-2xl font-bold mb-6 text-foreground"` (and the Featured one) to `className="text-2xl font-display font-bold mb-6 text-foreground section-rail flex items-center"`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(dashboard)/page.tsx"
git commit -m "feat(ui): neon dashboard hero + glowing section headings"
```

---

## Task 8: Rebuild the game grid (remove hardcoded purple/white)

**Files:**
- Modify: `src/components/game-grid.tsx`

- [ ] **Step 1: Replace hardcoded colors with tokens + neon hover**

- Card className: replace `bg-white/5 border-transparent hover:bg-white/10 transition-all duration-300 cursor-pointer ${cardSize}` with `bg-card border border-border neon-border-hover cursor-pointer ${cardSize}`.
- Tag badge: replace `bg-violet-600` with `bg-primary text-primary-foreground shadow-[0_0_12px_oklch(var(--primary)/0.6)]`.
- Overlay heading/desc text: keep `text-white` overlay text but change `text-gray-300` → `text-foreground/70` is wrong on the dark image overlay; keep light text for the image overlay — set heading to `text-white` and desc to `text-zinc-200`. (The overlay sits on a dark image gradient, so light text is correct here. This is intentional, not a token violation.)
- Category pills: replace `bg-white/20` with `bg-white/15 backdrop-blur-sm` (also on-image, light is correct).
- Play button: replace `bg-purple-600 hover:bg-purple-700 text-white` with `bg-primary hover:bg-primary/90 text-primary-foreground font-display shadow-[0_0_16px_oklch(var(--primary)/0.5)]`.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/game-grid.tsx
git commit -m "feat(ui): neon game grid — token colors, glow hover, neon play button"
```

---

## Task 9: Retune featured games + footer

**Files:**
- Modify: `src/components/featured-games.tsx`
- Modify: `src/components/footer.tsx`

- [ ] **Step 1: Featured cards**

- Card: add `neon-border-hover` to the card className (keep existing `bg-card border border-primary/20`, change border to `border-border`).
- Top glow div: change `from-primary/20` to `from-accent/20`.
- Featured badge: `variant`-equivalent — set className to `bg-primary text-primary-foreground border-0 shadow-[0_0_12px_oklch(var(--primary)/0.6)]`.
- Tag badge (secondary): keep `bg-accent/90 text-accent-foreground`.
- Title: change `group-hover:text-primary` to also add `group-hover:text-glow-cyan`; add `font-display` to the `<h3>`.
- Play circle: change `bg-primary/90` to `bg-primary shadow-[0_0_20px_oklch(var(--primary)/0.6)]`.
- Hover border ring: change `group-hover:border-primary/60` (already token, keep).

- [ ] **Step 2: Footer**

- `<footer>` className: change `border-t border-primary/20` to `border-t border-border` and shadow to `shadow-[0_-8px_30px_oklch(0_0_0/0.4)]`; add a top accent line via `relative` + a child `<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />`.
- Brand `<h1>`: add `font-display`.
- Links already use `hover:text-foreground`; change to `hover:text-primary` for the neon accent.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/featured-games.tsx src/components/footer.tsx
git commit -m "feat(ui): neon featured cards + footer accent glow"
```

---

## Task 10: Restyle admin layout + sidebar

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/components/admin/side-bar.tsx`

- [ ] **Step 1: Admin layout — tokens instead of hardcoded gray**

In `admin/layout.tsx`, replace:
- `<div className="flex h-screen bg-gray-900 text-gray-100">` → `<div className="flex h-screen bg-background text-foreground">`
- `<div className="bg-gray-800 border-r border-gray-700">` → `<div className="bg-card border-r border-border">`
- `<main className="flex-1 bg-gray-900 hide-scrollbar">` → `<main className="flex-1 bg-background hide-scrollbar">`

- [ ] **Step 2: Admin sidebar — remove per-item color maps, unify on neon**

In `admin/side-bar.tsx`:
- Delete the `activeColor`/`activeBackground`/`hoverColor`/`hoverBackground` keys from every `navItems` entry (keep `href`, `icon`, `label`).
- The link className already branches on `isActive` with token classes; change the active branch from `bg-primary text-primary-foreground shadow-md` to `bg-[linear-gradient(90deg,oklch(0.55_0.25_290/0.25),transparent)] text-foreground shadow-[inset_3px_0_0_oklch(var(--primary))]`, and the inactive hover to `hover:bg-muted hover:text-foreground`.
- The active dot `bg-primary-foreground` → `bg-primary shadow-[0_0_8px_oklch(var(--primary)/0.8)]`.
- The `Admin` `<h2>` titles (desktop + mobile): add `font-display text-glow-cyan`.
- Mobile trigger Button: change to `variant="neon"`.

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: Succeeds; confirm no unused-variable lint errors from removed keys.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.tsx src/components/admin/side-bar.tsx
git commit -m "feat(admin): neon admin layout + unified glow sidebar"
```

---

## Task 11: Restyle admin dashboard — stat cards + charts

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/components/admin/quick-stat-card.tsx`
- Modify: `src/components/admin/chart-card.tsx`

- [ ] **Step 1: Chart colors → neon palette**

In `admin/page.tsx`:
- `playsOverTimeOptions`: `colors: ["#22e3ff"]`; axis label `style.colors` cyan-muted `#9b8fc7` (both x and y); `grid.borderColor: "#2a1c52"`. Keep `theme.mode: "dark"`.
- `gameCategoryOptions`: `colors: ["#22e3ff", "#ff37d6", "#8b3bff", "#ffb43b", "#9bf03b"]`; `dataLabels.style.colors: ["#0b0618"]`.
- `quickStats` array: remove `color`/`bg` string fields OR repurpose — change to an `accent` field cycling `["cyan","magenta","violet"]`; simpler: drop `color`/`bg` and let the card cycle by index (see Step 2). Update the array to just `{ title, value, icon }`.
- Page `<h1>`: add `font-display text-glow-cyan`.
- Quick Actions: "Add New Game" Button → `variant="neon"`; "Manage Games" stays `variant="outline"` but className `border-border text-foreground hover:bg-muted hover:border-primary/50 bg-transparent`. The Quick Actions wrapper `bg-card border border-border` keep; add `shadow-[0_0_24px_oklch(0.55_0.25_290/0.15)]`.

- [ ] **Step 2: QuickStatsCard — neon card with glowing icon chip**

Rewrite `quick-stat-card.tsx`. Change the `QuickStat` interface to `{ title: string; value: number; icon: ...; }` and accept an `index` prop (or `accent` prop). Add an accent cycle:
```tsx
const ACCENTS = [
  { ring: "oklch(var(--primary))", text: "text-primary", glow: "shadow-[0_0_14px_oklch(var(--primary)/0.5)]" },
  { ring: "oklch(var(--accent))", text: "text-accent", glow: "shadow-[0_0_14px_oklch(var(--accent)/0.5)]" },
  { ring: "oklch(0.55 0.25 290)", text: "text-[oklch(0.7_0.22_290)]", glow: "shadow-[0_0_14px_oklch(0.55_0.25_290/0.5)]" },
];
```
Card className: `bg-card border border-border neon-border-hover`. Icon container: a rounded chip `h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${accent.glow}` with the icon in `${accent.text}`. Value: add `font-display`. Update the prop signature to `({ stat, index }: { stat: QuickStat; index: number })` and pick `ACCENTS[index % 3]`.

In `admin/page.tsx`, update the map to pass index: `{quickStats.map((stat, i) => (<QuickStatsCard key={stat.title} stat={stat} index={i} />))}`.

- [ ] **Step 3: ChartCard — read and add neon border + display title**

Read `src/components/admin/chart-card.tsx`. Set the wrapper card className to include `bg-card border border-border` and `shadow-[0_0_24px_oklch(0.55_0.25_290/0.12)]`; title to `font-display`. Replace any hardcoded gray/hex with tokens.

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: Succeeds. Confirm no references to removed `stat.color`/`stat.bg` remain (`grep -n "stat.color\|stat.bg" src/`).

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/page.tsx src/components/admin/quick-stat-card.tsx src/components/admin/chart-card.tsx
git commit -m "feat(admin): neon stat cards + chart palette + display headings"
```

---

## Task 12: Sweep remaining hardcoded colors + visual verification

**Files (spot-fix as needed):** `game-viewer.tsx`, `related-games.tsx`, `game-not-found.tsx`, `game-search.tsx`, `ad-type-settings.tsx`, `pagination.tsx`, `game-info.tsx`, `LikeDislikeButton.tsx`, `comment-section.tsx`, `comment.tsx`, `clientCategory.tsx`, auth pages (`sign-in`, `sign-up`, `forgot-password`, `reset-password`, `permission-denied`), `pages/contacts/page.tsx`, `manage-games/page.tsx`, and any others surfaced by grep.

- [ ] **Step 1: Find stray hardcoded colors**

Run:
```bash
grep -rIn -E "(bg|text|border|from|to|via|ring|fill|stroke)-(gray|slate|zinc|neutral|stone|purple|violet|indigo|blue|emerald|green|red|teal|orange|amber|pink|yellow)-[0-9]{2,3}" src/ | grep -v "node_modules"
```
This lists every remaining hardcoded color class with file:line.

- [ ] **Step 2: Fix each, by rule**

For each hit, apply this mapping (keep semantics):
- Neutral backgrounds (`gray/slate/zinc-800/900`) → `bg-card` or `bg-background`.
- Neutral text (`gray/slate-400/500`) → `text-muted-foreground`; (`-100/200/white`) → `text-foreground`.
- Borders (`gray/slate-700`) → `border-border`.
- Accent/brand colors (`purple/violet/indigo/blue`) used as primary actions → `primary` (cyan); used as secondary highlight → `accent` (magenta).
- Success `green/emerald` → keep meaning: use `text-[oklch(0.85_0.20_130)]` (lime) for "active/success" semantics; destructive `red` → `destructive` token.
- **Exception — text/overlays sitting on top of game thumbnail images** (dark gradient overlays) keep light literals (`text-white`, `text-zinc-200`, `bg-white/15`); these are intentional and already noted in Task 8.

Edit each file accordingly. Work file-by-file; after each file, it's fine to keep going (commit once at the end of the sweep).

- [ ] **Step 3: Auth pages neon CTA**

For `sign-in`/`sign-up`/`forgot-password`/`reset-password` pages: ensure the primary submit button uses `variant="neon"` (or the `SubmitButton` component — check `src/components/submit-button.tsx` and update its default styling to neon if it hardcodes a color). Ensure card/inputs use tokens. Add a subtle hero glow if the page has a heading: wrap heading area is optional — only if it currently looks bare.

- [ ] **Step 4: Re-run the grep to confirm only intentional literals remain**

Run the Step 1 grep again. Expected: only on-image overlay literals (game-grid, featured, viewer overlays) remain. Everything else uses tokens.

- [ ] **Step 5: Build + lint**

Run: `npm run build && npm run lint`
Expected: Both clean.

- [ ] **Step 6: Visual verification via dev server**

Run: `npm run dev` (serves on port 8080). Open and eyeball:
- `/` — hero glow, neon section rails, game tiles glow on hover, neon Play buttons.
- a `/play/[slug]` page — readable, themed, related games look right.
- `/sign-in` — neon CTA, themed inputs.
- `/admin` — dark themed, neon stat cards, charts in neon palette, sidebar glow rail.
- `/admin/manage-games` — table readable on dark.
Confirm no white-on-white / black-on-black / unreadable contrast. Fix any found, then re-run build.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(ui): sweep hardcoded colors onto Arcade Neon tokens across remaining surfaces"
```

---

## Task 13: Final review + branch wrap-up

**Files:** none (review only)

- [ ] **Step 1: Full build + lint one more time**

Run: `npm run build && npm run lint`
Expected: Clean.

- [ ] **Step 2: Confirm spec coverage**

Re-read the spec's surface list and confirm each was touched: globals/tokens ✓, fonts ✓, button/badge/card ✓, nav ✓, app sidebar ✓, dashboard ✓, game-grid ✓, featured ✓, footer ✓, admin layout ✓, admin sidebar ✓, admin dashboard/cards/charts ✓, sweep of play/auth/forms ✓.

- [ ] **Step 3: Stop the brainstorm visual companion server**

Run: `bash /home/mohammed/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/brainstorming/scripts/stop-server.sh /home/mohammed/dev/PortfolioProjects/gameweb/.superpowers/brainstorm/456810-1780913304`

- [ ] **Step 4: Hand off to user**

Summarize what changed and present finishing options (merge `redesign/arcade-neon` to `main`, open a PR, or keep iterating) via the `superpowers:finishing-a-development-branch` skill.

---

## Self-Review notes

- **Spec coverage:** Every surface in the spec maps to a task (Tasks 1–12); Task 13 verifies. ✓
- **No DB/schema work** — CLAUDE.md database rules don't apply. ✓
- **Card primitive:** the spec mentioned tuning `card.tsx`, but the glow is applied per-usage via `.neon-border-hover`; `card.tsx` itself needs no change (it already uses `bg-card`/tokens). Noted so the engineer doesn't hunt for a card.tsx edit.
- **ApexCharts needs hex** (not oklch) — Task 11 uses hex literals deliberately; this is the one place hex is correct.
- **On-image overlay literals** (`text-white` etc. over thumbnails) are intentionally preserved — called out in Tasks 8 and 12 so the sweep doesn't "fix" them into unreadable token colors.
- **Network dependency:** Google Fonts fetched at build (Task 2) — if the build host blocks it, report rather than work around.
