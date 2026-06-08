# Arcade Neon Redesign — Design Spec

**Date:** 2026-06-08
**Scope:** Visual + UX redesign of the entire game web app — public/main UI and the admin panel.
**Goal:** Replace the generic, inconsistent current look with a cohesive, distinctive "Arcade Neon" theme: high-energy, lights-off arcade feel with glowing cyan + hot-magenta accents on a deep space-black canvas.

## Decisions (locked with user)

- **Direction:** Arcade Neon.
- **Color mode:** Dark-only. Remove the light theme and the theme toggle entirely.
- **Effect intensity:** Full neon — glows on tiles/buttons, gradient backdrops, animated accent on hover, glowing focus rings.
- **Typography:** Add a display font (**Orbitron**) for logo / hero / section titles; **Chakra Petch** for UI/body text. Both via `next/font/google`.

## Current-state problems this fixes

1. **Font bug:** Geist is loaded in `layout.tsx` but `globals.css` overrides `body` with `Arial, Helvetica` — the whole site renders in system Arial. Replaced by the new font stack.
2. **Inconsistent color usage:** Main UI mostly uses OKLCH theme tokens (good), but `game-grid.tsx` hardcodes `bg-violet-600` / `bg-purple-600` / `bg-white/5`, and the admin panel hardcodes `gray-900`/`gray-800` and chart color `#8b5cf6`. The admin sidebar hardcodes light-mode classes (`bg-emerald-50`, etc.). Everything is unified onto theme tokens.
3. **No personality:** The "sporty electric blue" intent was never realized. Arcade Neon commits fully.

## Design system (the foundation — most change cascades from here)

### Color tokens (`src/app/globals.css`)
Rewrite `:root` with the Arcade Neon dark palette in OKLCH (keeping the existing `oklch(var(--x))` token contract so `tailwind.config.ts` and all `bg-primary`/`text-foreground`/etc. usages keep working). Approximate palette:

- `--background`: deep space-black indigo (~`0.10 0.04 285`)
- `--card` / `--popover`: raised panel (~`0.16 0.05 285`)
- `--foreground`: near-white lavender (~`0.95 0.02 285`)
- `--muted-foreground`: desaturated violet-grey (~`0.72 0.04 285`)
- `--primary`: **neon cyan** (~`0.85 0.16 200`), `--primary-foreground` near-black
- `--secondary` / **accent**: **hot magenta** (~`0.65 0.27 350`)
- A violet (`~0.55 0.25 290`) used in gradients
- `--border`: low-chroma violet (~`0.30 0.06 285`)
- `--ring`: cyan (matches primary) for glowing focus
- `--radius`: keep ~`0.75rem` (slightly rounded, arcade-friendly)
- `--chart-1..5`: cyan, magenta, violet, amber, lime — for admin charts.

Remove the entire `.dark { ... }` block and the light-mode `@layer base :root` sidebar overrides; collapse sidebar tokens to a single dark set (sidebar background slightly darker than `--card`, sidebar accent = cyan glow rail).

### Body / background (`globals.css`)
- Replace the `font-family: Arial...` rule with the Chakra Petch CSS variable.
- Keep the radial-gradient body background but retune to cyan/magenta/violet glows on the dark canvas.
- Add reusable neon utility classes in `globals.css` (`@layer utilities`):
  - `.text-glow` / `.text-glow-cyan` / `.text-glow-magenta` — text-shadow glows.
  - `.neon-border` — animated/`box-shadow` glow border for cards on hover.
  - `.neon-cyan` / `.neon-magenta` — `box-shadow` glow for buttons.
  - `.font-display` — applies the Orbitron variable.
- Retune `.custom-scrollbar` thumb to cyan-tinted.

### Fonts (`src/app/layout.tsx` + `tailwind.config.ts`)
- Remove the local Geist font loaders (or keep mono only if used by Monaco editor — verify; Monaco bundles its own, so safe to drop Geist).
- Add `Orbitron` (weights 500/700/900) → CSS var `--font-display`.
- Add `Chakra Petch` (400/600/700) → CSS var `--font-sans`.
- Set `<body>` to use `--font-sans`; expose `font-display` utility for titles.
- Add `fontFamily.sans` and `fontFamily.display` to `tailwind.config.ts` so `font-display` / default sans resolve to these.

### Shared UI primitives (`src/components/ui/`)
- **`button.tsx`:** Add a `neon` variant (cyan gradient + glow, Orbitron, used for primary CTAs / Play / Sign In) and a `neonMagenta` variant. Keep existing variants but ensure `outline`/`ghost` read well on dark. Add glow to `focus-visible` ring.
- **`card.tsx`:** Default to `bg-card border-border`; the glow-on-hover is applied per-usage via `.neon-border`, not globally.
- **`badge.tsx`:** Tune variants — featured/hot badge = cyan glow, secondary = magenta.
- Verify `input`, `select`, `dialog`, `dropdown-menu`, `sheet`, `tabs`, `table`, `tooltip`, `skeleton` all read correctly against the new dark tokens (they already consume tokens, so mostly automatic — spot-fix any hardcoded colors).

## Main UI surfaces

### Nav bar (`src/components/nav-bar.tsx`)
- Logo mark: gradient violet→magenta rounded square with cyan glow; wordmark in Orbitron with a cyan→white gradient text-clip.
- **Remove the `ThemeToggle`** (dark-only). Also remove its import.
- Search input: dark panel style, cyan focus glow.
- Heart / avatar buttons: dark panel chips with cyan hover.
- Sign In: `neon` button variant.
- Keep sticky + backdrop-blur; retune border/shadow to violet/cyan.

### App sidebar (`src/components/app-sidebar.tsx`)
- Section labels (`Navigation`, `Categories`) in small uppercase tracked Orbitron-ish caps.
- Active/hover item: left cyan glow rail + violet gradient wash (`box-shadow: inset 3px 0 0 cyan`).
- Category count chips: dark pill, cyan text.

### Dashboard home (`src/app/(dashboard)/page.tsx`)
- **Hero/welcome section:** gradient (violet→magenta→transparent) over `--card` with inner glow; site name in Orbitron with cyan text-glow; tagline in muted; the three stat buttons become neon-bordered glass "chips" with cyan-accented icons/numbers.
- **Section headings** (`Featured Games`, each category): `font-display`, with a glowing gradient accent bar before the text (the `::before` rail from the mockup) — implement as a small reusable `SectionHeading` element or shared className.

### Game grid (`src/components/game-grid.tsx`) — biggest cleanup
- Remove all hardcoded `bg-white/5`, `bg-violet-600`, `bg-purple-600`, `text-white`, `text-gray-300`.
- Tile: `bg-card border-border` rounded, lifts (`-translate-y`) + cyan `.neon-border` glow on hover.
- Tag badge: cyan glow badge (token-based).
- Hover overlay gradient kept (dark→transparent) but Play button uses the `neon` button variant; category pills use token-based pills.

### Featured games (`src/components/featured-games.tsx`)
- Already token-based and close to target — retune: top glow → cyan/magenta, featured badge → cyan glow, hover ring → cyan, title hover → cyan text-glow, Play circle → neon. Mostly className swaps.

### Footer (`src/components/footer.tsx`)
- Dark panel with top violet/cyan border glow; links muted → cyan hover.

### Play page, category, new, trending, auth pages, policy pages
- These consume tokens + the shared primitives, so they inherit the theme automatically. Pass: spot-fix any hardcoded colors (grep for `gray-`, `white/`, `purple-`, `violet-`, `slate-`, `zinc-`, `#` hex in `text-`/`bg-` across `src`). Auth pages (`sign-in`, `sign-up`, etc.): ensure cards/inputs/buttons use new tokens + a neon CTA; add subtle hero glow to match.

## Admin panel

### Admin layout (`src/app/admin/layout.tsx`)
- Replace hardcoded `bg-gray-900` / `bg-gray-800` / `text-gray-100` with theme tokens (`bg-background text-foreground`, sidebar `bg-card border-border`). Now consistent with the main app and the new palette.

### Admin sidebar (`src/components/admin/side-bar.tsx`)
- Remove the per-item hardcoded light color maps (`activeColor: text-emerald-500`, `bg-emerald-50`, etc.).
- Unify on token-based active state: cyan glow rail + violet wash (same language as the public sidebar). `Admin` title in `font-display` with cyan glow.

### Admin dashboard (`src/app/admin/page.tsx`)
- Chart colors: replace hardcoded `#8b5cf6` / hardcoded hex arrays and `theme.mode: dark`, `#9ca3af`, `#374151` with the new neon palette (cyan/magenta/violet/amber/lime); axis/grid colors pulled to muted-violet so charts sit on the dark canvas.
- `QuickStatsCard` (`src/components/admin/quick-stat-card.tsx`): neon-bordered cards, accent icon in a glowing chip, value in `font-display`. Replace the `stat.color`/`stat.bg` hardcoded `text-blue-400`/`bg-blue-900` scheme with token + accent-cycling (cyan/magenta/violet) per card.
- `ChartCard` (`src/components/admin/chart-card.tsx`): card with subtle neon border; title in `font-display`.
- Quick Actions: `neon` primary + outline secondary buttons.

### Admin forms & tables (`add-game`, `manage-games`, `import-games`, `settings`, `edit-pages`, `edit-game`, plus `base/create/update-game-form`, `user-list`, `provider-form`, `delete-game-dialog`, `ad-type-settings`)
- These use the UI primitives + tokens, so they inherit the theme. Pass: grep + spot-fix hardcoded colors, ensure tables/inputs/dialogs read on dark, primary actions use the neon variant.

## Non-goals (YAGNI)

- No new features, routes, data, or schema changes. **Purely presentational.**
- No light mode, no theme-switching (explicitly removed).
- No restructuring of data fetching / component logic beyond what's needed to swap classes and remove the theme toggle.
- No replacement of ApexCharts, Radix, or the carousel — only restyle.
- The Monaco code editor (admin) keeps its own dark theme; we only ensure its container fits.

## Implementation approach & sequencing

1. **Design-system foundation first** (`globals.css` tokens + utilities, `layout.tsx` fonts, `tailwind.config.ts` font families). Verify the app still builds and broadly recolors.
2. **Shared UI primitives** (`button`, `badge`, `card` tweaks). 
3. **Main UI surfaces** (nav, sidebar, dashboard, game-grid, featured, footer) — remove theme toggle here.
4. **Admin** (layout, sidebar, dashboard cards/charts, then forms/tables pass).
5. **Sweep** for stray hardcoded colors across `src` (grep `gray-|slate-|zinc-|white/|purple-|violet-|#[0-9a-fA-F]{3,6}` in class strings) and fix.
6. **Verify:** `npm run build` + `npm run lint` clean; manually run `npm run dev` (port 8080) and eyeball home, a play page, sign-in, and admin dashboard.

## Risk / verification notes

- **No DB or schema changes** → the CLAUDE.md database-safety rules do not apply to this work.
- Removing the theme toggle: confirm no other component imports `ThemeToggle` / relies on `next-themes` `useTheme`. Keep `ThemeProvider` only if something needs it; otherwise simplify to a forced-dark wrapper (add `class="dark"`-equivalent not needed since we collapse to a single palette). Verify `theme-switcher.tsx` / `theme/theme-toggle.tsx` removal doesn't break imports.
- Dropping Geist local fonts: confirm nothing else references `--font-geist-sans/mono`.
- ApexCharts in admin: colors are passed via options objects, straightforward to swap.
