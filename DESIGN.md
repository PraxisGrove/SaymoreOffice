---
name: Saymore Office
description: The public website for Saymore, local-first voice typing for macOS and Windows.
colors:
  canvas: "oklch(1 0 0)"
  surface: "oklch(0.97 0 0)"
  surface-raised: "oklch(0.985 0 0)"
  ink: "oklch(0.205 0 0)"
  text: "oklch(0.37 0 0)"
  muted: "oklch(0.49 0 0)"
  border: "oklch(0.89 0 0)"
  primary: "oklch(0.623 0.214 259)"
  primary-strong: "oklch(0.54 0.22 259)"
  primary-soft: "oklch(0.96 0.025 259)"
  success: "oklch(0.49 0.13 151)"
  success-soft: "oklch(0.96 0.035 151)"
typography:
  display:
    fontFamily: "Geist Sans, PingFang SC, sans-serif"
    fontSize: "72px"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist Sans, PingFang SC, sans-serif"
    fontSize: "44px"
    fontWeight: 620
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Sans, PingFang SC, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label:
    fontFamily: "Geist Sans, PingFang SC, sans-serif"
    fontSize: "14px"
    fontWeight: 560
    lineHeight: 1.4
    letterSpacing: "0"
  mono:
    fontFamily: "Geist Mono, SFMono-Regular, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  control: "6px"
  panel: "8px"
  window: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  demo-window:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.window}"
    padding: "12px"
---

# Design System: Saymore Office

## Overview

**Creative North Star: "The Visible Pipeline"**

The website behaves like a precise desktop instrument placed in a bright working environment. Visitors first see a large Saymore laptop scene move through onboarding, shortcut validation, spoken dictation, conservative refinement, spelling normalization, and delivery. Interface chrome stays quiet so that this transformation remains the visual subject.

The system inherits Saymore's neutral surfaces, blue interaction language, and green success language. It rejects generic AI SaaS landing pages, voice-agent theatre, and competitor imitation. Pages should feel engineered, inspectable, and calm.

**Key Characteristics:**
- Product demonstration before marketing explanation.
- Pure neutral surfaces with blue reserved for action and progress.
- Compact desktop controls inside spacious page compositions.
- Honest placeholders wherever pricing or production measurements are unresolved.
- Responsive motion that always preserves an already-visible default state.

## Colors

The palette is monochrome at rest and uses color only to communicate action, progress, and verified success.

### Primary
- **Signal Blue:** The active recording, progress, link, focus, and primary-action color.
- **Signal Blue Strong:** Hover and selected emphasis on light surfaces.
- **Signal Blue Soft:** Selected backgrounds and quiet process highlights.

### Secondary
- **Verified Green:** Ready, local, downloaded, delivered, and successful states only.
- **Verified Green Soft:** Background for successful status messages.

### Neutral
- **Open Canvas:** The page background and the negative space around product demonstrations.
- **Instrument Surface:** Secondary bands and simulated desktop workspaces.
- **Carbon Ink:** Titles, primary commands, and the final delivered text.
- **Working Gray:** Supporting copy and inactive interface labels.
- **Hairline:** Structural separation without ornamental shadows.

**The Sparse Signal Rule.** Blue may occupy no more than ten percent of a typical viewport. Green is never decorative.

## Typography

**Display Font:** Geist Sans (with PingFang SC and sans-serif fallbacks)
**Body Font:** Geist Sans (with PingFang SC and sans-serif fallbacks)
**Label/Mono Font:** Geist Mono (with SFMono-Regular and monospace fallbacks)

**Character:** A single technical sans family gives the page the confidence of a native utility. The mono face is limited to shortcuts, model names, provider endpoints, and measurable output.

### Hierarchy
- **Display** (650, 72px desktop / 48px mobile, 1.02): Product name and the literal offer in the opening viewport.
- **Headline** (620, 44px desktop / 34px mobile, 1.1): Section-level claims.
- **Title** (600, 24px, 1.25): Feature and comparison titles.
- **Body** (400, 18px, 1.65): Explanatory copy capped at 70 characters per line.
- **Label** (560, 14px, 1.4): Controls and compact interface metadata. Labels use normal case and zero letter spacing.

**The Chinese First Rule.** Chinese line breaks must be read as designed, not as an afterthought to an English layout.

## Elevation

The page is flat by default. Depth comes from tonal layering and one restrained shadow around the macOS demonstration window. Controls use either a border or a compact shadow, never both as decoration.

### Shadow Vocabulary
- **Window Lift** (`0 10px 30px oklch(0.2 0 0 / 0.10)`): The outer macOS demonstration only.
- **Pressed Control** (`0 2px 6px oklch(0.2 0 0 / 0.12)`): Keyboard shortcut keys and transient recording controls.

**The One Window Rule.** Only the product demonstration may look like a floating application window.

## Components

### Buttons
- **Shape:** Compact and mechanical (6px radius).
- **Primary:** Carbon Ink with Open Canvas text and 12px by 18px padding.
- **Hover / Focus:** Small luminance shift; focus uses a 2px Signal Blue outline with a 2px offset.
- **Secondary:** Open Canvas, Carbon Ink, and a Hairline border with no shadow.

### Chips
- **Style:** Used only for real platform, provider, or state metadata.
- **State:** Selected uses Signal Blue Soft with Signal Blue Strong text; success uses Verified Green Soft with Verified Green text.

### Cards / Containers
- **Corner Style:** 8px for individual comparisons and pricing plans; page sections remain unframed.
- **Background:** Open Canvas or Instrument Surface.
- **Shadow Strategy:** Flat except for the demonstration window.
- **Border:** Hairline only when a boundary is necessary for comparison.
- **Internal Padding:** 24px to 40px depending on density.

### Inputs / Fields
- **Style:** White surface, 6px radius, 1px Hairline border.
- **Focus:** Signal Blue outline without glow.
- **Error / Disabled:** Text plus icon or explanation; color alone is insufficient.

### Navigation

The navigation is transparent in the opening scene and becomes a compact white bar after the hero. It fades away while scrolling down and returns while scrolling up. Mobile navigation uses a menu icon, a native dialog, and large touch targets.

### Dictation Demonstration

The signature component is a large laptop demonstration with a visible cursor, shortcut key, recording waveform, pipeline status, spoken sample, before/after text, and delivered result. It supports three scenarios, playback controls, browser-generated speech, and product feedback tones, but never implies screen reading, answer generation, or automatic sending.

## Do's and Don'ts

### Do:
- **Do** make the actual dictation pipeline the first-viewport signal.
- **Do** use the formal Saymore mark and real product capability boundaries.
- **Do** label development benchmarks as development benchmarks.
- **Do** provide keyboard, focus, reduced-motion, and high-contrast states.
- **Do** say “source-available” and link to PolyForm Shield 1.0.0.

### Don't:
- **Don't** build a generic AI SaaS landing page from repeated rounded cards, purple gradients, or inflated claims.
- **Don't** imply screen reading, reply generation, task execution, or automatic sending.
- **Don't** visually clone Typeless, Shandianshuo, Type-X, or any single competitor.
- **Don't** fabricate performance metrics, app compatibility, testimonials, prices, or release availability.
- **Don't** call Saymore open source.
- **Don't** use gradient text, decorative glassmorphism, colored side-stripe cards, or nested cards.
