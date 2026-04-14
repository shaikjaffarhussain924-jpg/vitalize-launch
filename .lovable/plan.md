

## Plan: Integrate 6 New UI Components

### Components to Add and Where to Use Them

| Component | File | Where to Use |
|---|---|---|
| **Interfaces Accordion** | `src/components/ui/interfaces-accordion.tsx` | Replace the `<details>` FAQ on `/faq` page and service page FAQ sections |
| **Animated Gradient Border** | `src/components/ui/animated-gradient-border.tsx` | Wrap "Why Choose Us" cards on homepage and doctor cards on homepage spotlight |
| **Shiny Button** | `src/components/ui/shiny-button.tsx` | Replace the main hero "Book Free Consultation" CTA button on homepage |
| **Get Started Button** | `src/components/ui/get-started-button.tsx` | Use on the booking page as the submit/next-step button |
| **Logos3 (Auto-scroll carousel)** | `src/components/blocks/logos3.tsx` | Replace the static "Awards & Accreditations" strip on homepage (line 338-348) with auto-scrolling logos |
| **Gallery4 (Image carousel)** | `src/components/blocks/gallery4.tsx` | Replace the static Before/After grid on homepage (line 351-388) with an interactive carousel, and enhance the `/gallery` page |

### Dependencies to Install
- `embla-carousel-auto-scroll` (new -- needed for Logos3)
- All others (`framer-motion`, `lucide-react`, `embla-carousel-react`, `@radix-ui/react-accordion`, `@radix-ui/react-slot`, `class-variance-authority`) are already installed.

### CSS Addition
Add `@keyframes gradient-rotate` to `src/styles.css` with `@property --gradient-angle` for the animated border component.

### Files to Create
1. `src/components/ui/interfaces-accordion.tsx`
2. `src/components/ui/animated-gradient-border.tsx`
3. `src/components/ui/shiny-button.tsx`
4. `src/components/ui/get-started-button.tsx`
5. `src/components/blocks/logos3.tsx`
6. `src/components/blocks/gallery4.tsx`

### Files to Modify
1. `src/styles.css` -- add gradient-rotate keyframes
2. `src/routes/index.tsx` -- use ShinyButton in hero, AnimatedGradientBorder on Why Choose Us cards, Logos3 for awards strip, Gallery4 for Before/After section
3. `src/routes/faq.tsx` -- replace `<details>` with InterfacesAccordion
4. `src/routes/services.$slug.tsx` -- replace FAQ section with InterfacesAccordion
5. `src/routes/book-appointment.tsx` -- use GetStartedButton for form actions

### Notes
- The existing `src/components/ui/accordion.tsx` (shadcn default) will remain untouched. The new `interfaces-accordion.tsx` is a separate, enhanced version used specifically on FAQ/service pages.
- The existing button component stays as-is; `get-started-button.tsx` imports from it.
- Logos3 will display clinic accreditations (NABH, ISO, etc.) with medical-themed placeholder logos instead of the demo tech logos.
- Gallery4 will show clinic results with medical-appropriate Unsplash images.

