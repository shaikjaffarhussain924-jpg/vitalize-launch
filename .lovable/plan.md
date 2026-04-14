

## Plan: Premium Clinic Visual Upgrade

The site has a solid structure but needs visual polish to feel like a premium medical brand. Here is what I will do:

### 1. Upgrade Typography
- Replace the Google Fonts import with a more premium combination: **DM Serif Display** (headings — more modern than Playfair) + **Plus Jakarta Sans** (body — cleaner, more premium than Inter)
- Add proper `font-display: swap` and optimize loading with preconnect
- Increase heading sizes and letter-spacing for elegance

### 2. Refine Color Palette for Premium Feel
- Soften the oklch values: warmer cream background, richer navy, more refined gold (less saturated, more luxe)
- Add subtle gradient tokens for hero and section backgrounds
- Introduce a `--gold-light` for soft badge/tag backgrounds

### 3. Enhance Global Components
- **Navbar**: Add a thin gold accent line at top, refined logo area with better spacing, smoother font weights
- **Footer**: Add subtle top border gradient (navy → gold → navy), better spacing, refined typography hierarchy
- **WhatsApp button**: Add a subtle glass-morphism ring effect
- **Buttons**: More refined border-radius (pill-shaped for primary CTAs), subtle shadow upgrades, letter-spacing on CTA text

### 4. Polish Homepage Sections
- **Hero**: Add subtle radial gradient overlay, refined badge styling, better text hierarchy with tracking/leading adjustments
- **Trust bar**: Add subtle gold left-border accent on each card
- **Service cards**: Add subtle gradient hover state, refined shadow system
- **Stats section**: Add subtle pattern/texture overlay on navy background
- **Testimonials**: Add decorative quote marks, refined card styling
- **Booking form**: Glass-morphism input styling on dark background

### 5. Add Premium CSS Details
- Subtle `::selection` color (gold)
- Refined scrollbar with thinner track
- Add subtle body texture/grain overlay for depth
- Better focus ring styling (gold-tinted)
- Smoother transitions (ease-out curves, longer durations)
- Add decorative section dividers (subtle curved SVG shapes between sections)

### Technical Details
- **Files modified**: `src/styles.css`, `src/routes/__root.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/routes/index.tsx`, `src/components/ui/button.tsx`
- **No new dependencies** — all changes are CSS/Tailwind + font swaps
- Fonts loaded via Google Fonts CDN (already set up with preconnect)

