---
name: HeritageHub
colors:
  surface: '#fff8f6'
  surface-dim: '#e7d7d1'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#fbeae5'
  surface-container-high: '#f5e5df'
  surface-container-highest: '#efdfd9'
  on-surface: '#221a17'
  on-surface-variant: '#54433c'
  inverse-surface: '#382e2b'
  inverse-on-surface: '#feede8'
  outline: '#87736b'
  outline-variant: '#dac1b8'
  surface-tint: '#944925'
  primary: '#823b18'
  on-primary: '#ffffff'
  primary-container: '#a0522d'
  on-primary-container: '#ffe1d6'
  inverse-primary: '#ffb596'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#005863'
  on-tertiary: '#ffffff'
  tertiary-container: '#007280'
  on-tertiary-container: '#aef2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb596'
  on-primary-fixed: '#360f00'
  on-primary-fixed-variant: '#76320f'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#9defff'
  tertiary-fixed-dim: '#7fd3e3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f59'
  background: '#fff8f6'
  on-background: '#221a17'
  surface-variant: '#efdfd9'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

The design system embodies a "Contemporary Heritage" aesthetic, blending the ancient architectural precision of Odisha’s stone carvings with the ethereal, fluid nature of modern AI. It is designed for a premium cultural archive that feels like a prestigious physical museum but operates with the speed and intelligence of a high-end SaaS platform.

The style is **Modern Editorial with Tactile Accents**. It utilizes expansive white space (Warm Ivory) to allow cultural artifacts to breathe, punctuated by high-contrast typography and subtle physical metaphors inspired by palm-leaf manuscripts. The emotional response is one of reverence, discovery, and technological empowerment.

**Key Visual Principles:**
- **Architectural Framing:** Use of structural lines and geometric grids inspired by the Konark Sun Temple’s symmetry.
- **Organic Precision:** A balance between raw, hand-drawn motifs (Pattachitra-inspired) and razor-sharp digital execution.
- **Phygital Depth:** Interfaces should feel layered, like a curated exhibition where digital overlays sit gracefully atop physical textures.

## Colors

The palette is rooted in the earth and craftsmanship of Odisha. 
- **Primary (Deep Terracotta):** Used for key actions, brand moments, and primary iconography. It evokes the clay and brickwork of heritage sites.
- **Secondary (Muted Gold):** Reserved for premium highlights, interactive states, and metadata labels. It reflects the brilliance of brass work and temple finials.
- **Background (Warm Ivory):** The primary canvas. It is softer than pure white, reducing eye strain and providing a "gallery wall" feel.
- **Accents (Maroon & Forest):** Used sparingly for semantic distinction—Maroon for deep history or warnings, Forest for community growth and success states.
- **Neutral (Charcoal):** The foundation for typography and structural borders, ensuring high legibility and a grounded feel.

## Typography

This design system employs a sophisticated typographic contrast to signal its "Heritage x Technology" narrative.

- **Headlines:** Use *Libre Caslon Text*. Its sharp serifs and classical proportions provide an authoritative, editorial feel reminiscent of museum placards and high-end publishing.
- **Body & UI:** Use *Plus Jakarta Sans*. Its modern, slightly rounded grotesque letterforms provide high legibility for long-form archival descriptions and a friendly, accessible feel for community features.
- **Styling Note:** Large display text should occasionally use "Italic" styles for emphasis in storytelling contexts. Use `label-caps` for metadata, breadcrumbs, and small UI buttons to maintain a clean, organized hierarchy.

## Layout & Spacing

The layout philosophy follows a **Classical Grid with Modern Flexibility**. 

- **Grid:** Use a 12-column grid for desktop with wide 64px outer margins to create an "matted print" effect. 
- **Rhythm:** Spacing follows an 8px incremental scale. Large gaps (Section Gaps) are encouraged between major content blocks to prevent visual clutter and maintain the premium "gallery" atmosphere.
- **Adaptive Behavior:** On mobile, margins shrink to 16px, and 12 columns collapse to 4. For AI-demo panels, use "off-grid" positioning (side-drawers or floating overlays) to signify they are technological tools sitting "above" the historical content.

## Elevation & Depth

Depth is achieved through **Tonal Layering and Material Textures** rather than heavy shadows.

1.  **The Base Layer:** Warm Ivory (#FAF9F6) represents the stone or paper background.
2.  **The Surface Layer:** Cards and containers use Warm Off-White (#F5F5F5) with a very thin Charcoal (#36454F) border at 10% opacity.
3.  **The Interactive Layer:** Elements use subtle, long "ambient" shadows—diffused and low-opacity—to suggest they are floating slightly above the page. 
4.  **Cultural Accents:** Use SVG patterns (based on Pattachitra border art) as "underlays" behind cards or as decorative separators. These should be set to 5-10% opacity in Terracotta or Charcoal.

## Shapes

The shape language is **Softly Structured**. 

- **Containers:** We use a `Soft` (0.25rem) radius for standard UI elements like inputs and small buttons to maintain a professional, precise feel.
- **Feature Cards:** Larger cards use `rounded-lg` (0.5rem) to feel more inviting.
- **Cultural Motifs:** Decorative elements, such as image frames for artifacts, may utilize custom "scalloped" corners or "archway" top-radii (inspired by temple entrances) to reinforce the heritage theme.
- **Interactive States:** Buttons expand slightly on hover but maintain their formal geometry.

## Components

### Premium Cards
Artifact cards should feature a large image ratio (3:4 or 1:1). The typography is bottom-aligned with a subtle gradient overlay. Metadata (Date/Region) uses the `label-caps` style in Muted Gold.

### Sleek Navigation
The top navigation is transparent on scroll-up and blurs the background. It uses a centered logo and minimalist serif links. Use a "Mega-menu" for the cultural archive categories, utilizing 3 columns of text and 1 column for a "Featured Artifact" image.

### Interactive Timelines
A horizontal scroller with a thick Terracotta (#A0522D) track. Milestones are represented by Muted Gold circles. On hover, milestones expand to show a "mini-card" preview of that era.

### AI-Demo Panels
These panels represent the "Hub" aspect. Use a slightly different background treatment—darker Charcoal backgrounds with Terracotta text—to signal a "Tool Mode." Use monospaced fonts (like Courier Prime) sparingly within these panels for data points to emphasize the analytical nature of the AI.

### Input Fields & Controls
Inputs use a "bottom-border only" style in default states to mimic the lines of a manuscript, transitioning to a full Warm Off-White box on focus. Checkboxes and radios use Muted Gold accents when active.

### Action Buttons
- **Primary:** Solid Terracotta with White text.
- **Secondary:** Transparent with a Charcoal border and Muted Gold text.
- **Ghost:** Minimal text with a "chevron" icon that animates on hover.