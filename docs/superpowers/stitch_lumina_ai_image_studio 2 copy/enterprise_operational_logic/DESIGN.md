---
name: Enterprise Operational Logic
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  table-data:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base-unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  layout-margin: 24px
  gutter: 16px
---

## Brand & Style
This design system is engineered for high-stakes enterprise environments where data density and operational speed are paramount. The brand personality is authoritative, precise, and utilitarian, evoking a sense of institutional stability and "calm under pressure."

The aesthetic follows a **Corporate Minimalist** approach. It prioritizes functional clarity over decorative flair, utilizing a rigid structural grid to organize vast amounts of information without overwhelming the user. The style leverages sharp boundaries and a systematic color application to differentiate global navigation from the focused workspace, ensuring that users can navigate complex workflows with cognitive ease.

## Colors
The color strategy employs a high-contrast "Dark-to-Light" transition. 

*   **Navigation & Chrome:** Deep navy (`#0F172A`) and Slate provide a heavy visual anchor for the sidebar and top-level headers, creating a clear distinction between the "system" and the "data."
*   **Workspace:** A crisp white background (`#FFFFFF`) is used for the main content area to maximize legibility and ensure that data points are the primary focus.
*   **Action & Feedback:** Emerald green is reserved exclusively for primary success actions and positive status indicators. Subtle grays are utilized for borders to define zones without adding visual noise.

## Typography
This design system utilizes **Inter** exclusively for its neutral, systematic qualities and exceptional legibility at small sizes. 

To support high information density, the scale is compressed. The base body size is set to 14px, while data-heavy components like tables and sidebars utilize a 13px "compact" size. Uppercase labels with slight letter-spacing are used for section headers to create hierarchy without needing large font sizes. Tabular figures (monospaced numbers) should be enabled for all numerical data within tables to ensure vertical alignment.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column system, allowing the dashboard to scale across various enterprise monitor resolutions. 

Spacing is based on a strict 4px baseline grid. Padding within cards and table cells is kept to a functional minimum (`8px` or `12px`) to prioritize data visibility. Large margins are avoided; instead, clear logical grouping is achieved through the use of borders and subtle background shifts. The sidebar is fixed at 240px, while content areas expand to fill the remaining viewport width.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 

The background of the application uses a very light gray (`#F8FAFC`), while primary content containers (cards) use a pure white background with a 1px border (`#E2E8F0`). This "flat-stacked" approach maintains a clean aesthetic while clearly defining boundaries. Shadows are used sparingly, only for transient elements like dropdown menus or modals, and are characterized by a very large blur and low opacity (4-8%) to avoid disrupting the grid-like structure.

## Shapes
The shape language is **Soft (0.25rem)**. 

This subtle rounding provides a modern touch to an otherwise rigid, professional layout without sacrificing the "serious" tone of the enterprise system. Buttons and form inputs utilize this 4px radius, while larger containers like cards may use the `rounded-lg` (8px) variant to create a slight visual distinction between the container and the elements held within it.

## Components
Consistent component behavior is essential for operational efficiency:

*   **Sidebar Navigation:** Vertical orientation with 20px icons and 13px text. Active states use a subtle left-border accent in emerald green and a slate-navy background shift.
*   **Data Tables:** High-density rows (32px height). Header cells use `label-caps` typography with a subtle bottom border. Hover states on rows are mandatory for tracking.
*   **Tabbed Navigation:** Underline style with no background container. Active tabs use a 2px emerald green bottom border.
*   **Standardized Forms:** Input fields use a 1px slate border that thickens slightly on focus. Labels are positioned above the input to maximize horizontal space for field width.
*   **Cards:** Pure white background, 1px border (`#E2E8F0`), and no default shadow. Headers within cards should be separated by a thin horizontal rule.
*   **Buttons:** Primary buttons are emerald green with white text. Secondary buttons are white with a slate border. All buttons use a compact padding (8px top/bottom, 16px left/right).
*   **Status Badges:** Small, pill-shaped indicators with low-saturation background tints and high-saturation text for immediate category recognition.