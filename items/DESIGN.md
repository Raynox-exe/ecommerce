# Design System Specification: The Curated Retail Experience

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Digital Curator."** In a market saturated with cluttered, grid-locked marketplaces, this system moves beyond the "commodity" feel of traditional e-commerce. It treats the interface not as a warehouse, but as a high-end editorial gallery. 

The aesthetic is defined by **Tonal Depth** and **Intentional Asymmetry**. We break the "template" look by utilizing generous whitespace, overlapping product photography, and a sophisticated hierarchy that guides the user’s eye through a narrative journey rather than a simple list of SKUs. The goal is to evoke "High-Trust Velocity"—a feeling that the platform is both elite and incredibly fast.

---

## 2. Colors & Atmospheric Depth
Our palette transitions from a high-energy primary "Burnt Saffron" to a series of sophisticated, cool-toned neutrals. 

### The Palette
- **Primary Action:** `primary` (#9e3c00) and `primary_container` (#ff7937). Use these for high-conversion moments.
- **Surface & Background:** `surface` (#f6f6f6) and `surface_container_lowest` (#ffffff).
- **Functional Accents:** `tertiary` (#7c5300) for highlighting special offers or loyalty status.

### The "No-Line" Rule
**Designers are strictly prohibited from using 1px solid borders for sectioning.** Conventional "boxes" make an interface feel dated and rigid. Instead, define boundaries through:
- **Background Shifts:** Place a `surface_container_low` section directly against a `surface` background.
- **Tonal Transitions:** Use the hierarchy of `surface_container` tokens to indicate containment.

### The "Glass & Gradient" Rule
To elevate the "retail-ready" feel into something premium:
- **Signature Textures:** Apply a subtle linear gradient from `primary` (#9e3c00) to `primary_container` (#ff7937) on primary CTA buttons. This adds a "physicality" and soul to the action.
- **Glassmorphism:** For floating navigation bars or "Quick Buy" overlays, use `surface_container_lowest` at 80% opacity with a `24px` backdrop blur. This ensures the product imagery remains visible, keeping the user grounded in the shopping context.

---

## 3. Typography: Editorial Authority
We utilize a pairing of **Plus Jakarta Sans** for character and **Inter** for utility.

- **Display & Headlines (Plus Jakarta Sans):** Used for "Brand Moments"—hero banners and category titles. The wider apertures and modern geometric shapes of `display-lg` (3.5rem) convey an authoritative, high-end editorial voice.
- **Body & Labels (Inter):** Used for "Utility Moments"—product descriptions, specs, and price points. `body-md` (0.875rem) is the workhorse for high-density information.
- **Hierarchy Tip:** Use `headline-sm` (1.5rem) for product names in cards to ensure they dominate the price, shifting the focus from "cost" to "desire."

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often a crutch for poor layout. In this system, we prioritize **Tonal Layering**.

- **The Layering Principle:** 
  - Base Layer: `surface` (#f6f6f6)
  - Section Layer: `surface_container_low` (#f0f1f1)
  - Interactive Card Layer: `surface_container_lowest` (#ffffff)
  *This stacking creates a natural lift that feels architectural rather than digital.*

- **Ambient Shadows:** When a card must "float" (e.g., a hovered state), use a shadow tinted with `on_surface` at 6% opacity with a `32px` blur and `8px` Y-offset. It should look like a soft glow of light, not a dark stain.
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., search inputs), use `outline_variant` (#acadad) at **15% opacity**. Never use a 100% opaque stroke.

---

## 5. Components

### Cards & Product Grids
- **Style:** Use `surface_container_lowest` for the card body. 
- **Radius:** `md` (0.75rem / 12px) for a soft, approachable feel.
- **Content Separation:** Forbid divider lines. Separate the product image from the metadata using a `16px` vertical padding scale.

### Buttons
- **Primary:** Gradient-filled (`primary` to `primary_container`) with `on_primary` text. Use `full` (9999px) roundedness for high-action buttons to make them feel "tappable."
- **Secondary:** `surface_container_high` background with `on_surface` text. No border.

### Chips (Filters & Categories)
- **State:** Active chips use `primary_container` with `on_primary_container` text. 
- **Shape:** `sm` (0.25rem) roundedness to distinguish them from the pill-shaped buttons.

### Input Fields
- **Background:** `surface_container_highest` (#dbdddd) to provide a clear "sink" for text entry.
- **Focus State:** A 2px "Ghost Border" using `primary` at 40% opacity.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** In hero sections, offset text and imagery to create a more dynamic, "editorial" layout.
- **Prioritize Breathing Room:** Use the `xl` spacing scale between major sections to prevent the "Temu-clutter" effect.
- **Use High-Contrast Type:** Make your `display-lg` headlines significantly larger than body text to create a clear visual entry point.

### Don’t:
- **Don't use 1px dividers:** If you feel the need for a line, try using a `surface_container_low` background block instead.
- **Don't use pure black:** Use `on_surface` (#2d2f2f) for text to maintain a softer, more sophisticated look.
- **Don't overcrowd the fold:** A premium experience allows the product imagery to speak. Limit the number of CTAs visible at once to one primary and one secondary.

### Retail-Specific Additions:
- **The "Scarcity Label":** Use `error_container` (#fb5151) with `on_error_container` (#570008) for "Low Stock" alerts. The high-saturation contrast creates immediate urgency without looking "cheap."
- **Floating Cart:** A `surface_container_lowest` glassmorphic circle in the bottom right, using a `primary` shadow to indicate its importance.