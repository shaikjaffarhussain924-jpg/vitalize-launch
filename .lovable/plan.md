

# Performance Fixes for Site Speed

## Problems Identified

1. **Render-blocking Google Fonts** — Two font families (Cormorant Garamond + Outfit) loaded via `@import url()` in CSS, blocking first paint.
2. **Heavy homepage** — 606-line single component with 12+ sections, multiple heavy UI components (ImageComparison, InteractiveImageAccordion, StaggerTestimonials, MultistepForm with framer-motion), all loaded eagerly.
3. **Unnecessary third-party scripts on every page** — Meta Pixel (with invalid/null ID causing console errors), GTM, and GA4 all injected in the root route head, even though IDs are placeholder values (`YOUR_PIXEL_ID`, `GTM-XXXXXXX`, `G-XXXXXXXXXX`).
4. **Multiple Unsplash images loaded eagerly** — ~15+ external images on homepage without `loading="lazy"`.
5. **Duplicate content rendering** — Two separate booking forms on the same homepage (inline form + MultistepConsultationForm).
6. **Backdrop-blur overuse** — Heavy `backdrop-blur-xl` and `backdrop-blur-md` on multiple stacked elements causes GPU thrashing, especially on mobile.

## Plan

### Step 1: Remove placeholder analytics scripts
Remove Meta Pixel, GTM, and GA4 script injection from `__root.tsx` head since all IDs are placeholders. This eliminates 3 render-blocking scripts and the console error. Users can re-enable once they have real IDs.

### Step 2: Optimize font loading
Replace the CSS `@import url(...)` with `<link rel="preload">` in the root head for the two Google Fonts, using `display=swap` to prevent render blocking.

### Step 3: Lazy-load below-fold sections
Wrap heavy below-fold components with React `lazy()` + `Suspense`:
- `StaggerTestimonials`
- `MultistepConsultationForm` (framer-motion heavy)
- `ImageComparison` sections
- `InteractiveImageAccordion`
- `Gallery4`
- `LocationMap`

### Step 4: Add `loading="lazy"` to all images
Add native lazy loading to all `<img>` tags except the hero image (which should stay eager). This includes doctor photos, blog images, before/after images, and accordion images.

### Step 5: Remove duplicate booking form
Remove one of the two booking forms on the homepage (keep the MultistepConsultationForm, remove the inline 4-field form) to reduce DOM size and duplicate server function imports.

### Step 6: Reduce backdrop-blur usage
Downgrade `backdrop-blur-xl` to `backdrop-blur-sm` on non-essential decorative elements (trust bar items, accreditation marquee) to reduce GPU compositing cost on mobile.

## Files Changed
- `src/routes/__root.tsx` — remove placeholder analytics scripts, optimize font loading
- `src/routes/index.tsx` — lazy-load heavy components, add image lazy loading, remove duplicate form, reduce blur
- `src/components/ui/interactive-image-accordion.tsx` — add `loading="lazy"` to images
- `src/components/blocks/gallery4.tsx` — add `loading="lazy"` to images

