---
name: Industrial Data Engine
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  data-value:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  data-label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 24px
  gutter: 16px
  table-cell-padding-x: 12px
  table-cell-padding-y: 8px
  side-nav-width: 260px
---

## Brand & Style

This design system is engineered for high-velocity global e-commerce operations. The brand personality is authoritative, systematic, and ultra-productive, favoring utility over decoration. The target audience consists of inventory managers, logistics coordinators, and data analysts who require a "cockpit" experience where information density is a feature, not a flaw.

The visual style is **Corporate Modern with Industrial precision**. It utilizes a structured grid, high-contrast interactive elements, and a sophisticated layering system to organize complex datasets. The emotional response is one of "command and control"—providing the user with total confidence in the accuracy and timeliness of the global data they are managing.

## Colors

The palette is anchored by **Deep Navy (#1E293B)**, used for structural navigation to create a strong "frame" for the content. The primary driver of activity is **Cobalt Blue (#2563EB)**, reserved exclusively for interactive elements and primary call-to-actions. 

For data integrity, a semantic status system is strictly enforced: **Success Green**, **Warning Amber**, and **Danger Red** are used for audit logs and system health. A specialized **AI Suggestion** tint (#F5F3FF) is used as a background fill for automated insights, visually separating machine-generated logic from raw manual data entry.

## Typography

This design system utilizes **Inter** exclusively to leverage its exceptional legibility in data-heavy environments. The hierarchy is built on the contrast between **Data Labels** (small, uppercase, bold, Slate Gray) and **Data Values** (standard size, medium weight, Deep Navy). This distinction allows users to scan complex tables rapidly without losing context. Headings are kept tight with negative letter spacing to maintain an industrial, compact aesthetic.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid model**. The **Side-Nav** is a fixed 260px vertical bar, while the main content area utilizes a fluid grid that optimizes for wide-screen monitors. 

Spacing is based on a **4px baseline grid**. To achieve the "high-productivity" requirement, vertical padding in tables and lists is intentionally condensed (8px) while horizontal padding remains more generous (12px) to guide the eye across data rows. Margins between dashboard cards are set to a standard 16px to maximize screen real estate.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows. 

1.  **Level 0 (Canvas):** Light Gray (#F8FAFC) background.
2.  **Level 1 (Cards):** Pure White (#FFFFFF) with a 1px border (#E2E8F0). No shadow.
3.  **Level 2 (Dropdowns/Modals):** Pure White with a subtle, diffused 8px blur shadow (alpha 0.05) to indicate temporary overlay.

This flat, layered approach minimizes visual noise and keeps the user's focus on the data values themselves.

## Shapes

The design system uses a **Soft (0.25rem)** roundedness level to maintain a professional, structural feel. This subtle rounding prevents the UI from feeling "sharp" or dated while avoiding the playfulness of more rounded systems. 

- **Input Fields & Buttons:** 4px (0.25rem)
- **Dashboard Cards:** 8px (0.5rem)
- **Status Badges:** 2px (minimal rounding for a "tag" appearance)
- **Language Switchers:** 4px (0.25rem)

## Components

### Tables & Data Grids
Tables are the core component. Use alternating row stripes or 1px horizontal dividers. **Hover states** must use a subtle gray (#F1F5F9) to highlight the active row. Columns containing currency or numeric values must be right-aligned.

### Status Badges
Small, high-contrast badges with a subtle background tint (10% opacity) and a bold foreground text (100% opacity) of the same color. For example, a "Success" badge uses a #D1FAE5 background and #10B981 text.

### AI Suggestion Callouts
These components use the **Violet Tint (#F5F3FF)** background with a thin 1px border of #DDD6FE. They should feature a small "Sparkle" icon to denote machine-learning origins and are placed directly above or below the relevant data points.

### Multi-Language Tab Switcher
A segmented control style component. The active state uses a white "pill" background inside a Slate Gray container, allowing rapid switching between EN, ES, and PT views for global catalog management.

### Buttons
- **Primary:** Solid Cobalt Blue with white text. 
- **Secondary:** White background with 1px Slate Gray border.
- **Tertiary/Ghost:** No background or border, used for utility actions in tables.