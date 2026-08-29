# HYDRONE — Website Development Brief
**Version:** 1.0  
**Date:** 2026-07-05  
**Prepared by:** Hydrone Librarian  
**Audience:** Front-end Developer (UI Demo / Video Purpose)  
**Source:** Hydrone Bible v0.2.0 (locked decisions only)

> **Scope note:** This website is a UI demo for video purposes.
> Sensor data is mock/animated. Control panel is UI-only (no backend).
> Full functional website with real telemetry is planned post-field-testing.

---

# PART 1 — PROJECT SPECIFICATION REFERENCE

## 1.1 Project Identity

| Field | Value |
|---|---|
| Product name | **Hydrone** |
| Category | Underwater ROV (Remotely Operated Vehicle) |
| Mission | River debris collection + real-time water quality monitoring |
| Target environment | Shallow river (0–10m depth), specifically Sungai Dengkeng, Central Java |
| Built by | 5-person high school team, Mersiflab |
| Competition | IID INNOPA (International Invention, Innovation, and Technology Exhibition) |
| Competition deadline | August 31, 2026 |

### Tagline Options (pick one for hero section)
- **"Cleaning Rivers. Reading Water."** ← recommended — concise, dual-mission
- "Autonomous. Intelligent. Underwater."
- "River Intelligence, Built from Scratch."

### One-paragraph product description (for About page / hero sub-copy)
> Hydrone is a student-built underwater ROV designed to tackle river plastic pollution at the source. It collects macroplastic debris using a passive net mechanism, filters microplastics down to 0.1 microns, and simultaneously streams real-time water quality data — pH, turbidity, dissolved solids, and temperature — to a live dashboard. Built entirely from 3D-printed PETG and off-the-shelf components by a five-person high school team, Hydrone demonstrates that impactful environmental technology doesn't require a corporate lab.

---

## 1.2 Engineering Specifications (LOCKED — Bible v0.2.0)

### Body

| Parameter | Value |
|---|---|
| Dimensions (L × W × H) | 500 × 200 × 120 mm |
| Total width incl. thruster pods | ~350 mm |
| Target weight | ~7.5 kg |
| Buoyancy | ~7.4 kg (slightly negative — intentional for stability) |
| Body material | PETG (3D printed) |
| Operating depth | 0–10 m |

### Propulsion System

| Parameter | Value |
|---|---|
| Total thrusters | 4 units |
| Horizontal thrusters | 2× (1 CW + 1 CCW) — position at ¾ body (375mm from bow), external pods, port & starboard |
| Vertical thrusters | 2× — position at ¼ body (125mm from bow), external brackets, port & starboard |
| V-angle (vertical thrusters) | 75° from horizontal (≈15° from vertical) |
| Effective vertical thrust | 96.6% (sin 75°) |
| Bracket arm length | ~74mm from hull edge to thruster center |
| Propeller clearance | ~52mm from hull edge to propeller disc |
| Steering method | Differential thrust (horizontal pair) |
| Depth control method | Active — vertical thrusters (primary); ballast trim (secondary) |
| Thruster spec | T200-equivalent brushless underwater motor, 12–24V, 20A max |
| Thruster source | Tokopedia — fawwazzshop, Rp 750,000/unit |
| Hull penetration | Cable only — 1× IP68 cable gland per vertical thruster |
| Propulsion voltage | 14.8V nominal (Li-Ion 4S) |

### Ballast System

| Parameter | Value |
|---|---|
| Configuration | Dual-chamber, physically separated |
| Air chamber | 500ml — forward-lower position |
| Water chamber | 500ml — mid-forward-lower position |
| Total volume | 1,000ml (1 liter) |
| Material | PETG (3D printed), interior epoxy-coated |
| Depth control logic | Fill water = descend; expel water via compressed air = ascend; hold = hover |
| Key components | Mini water pump DC 12V + mini compressor 12V + solenoid valve(s) + water level sensor |

### Net Mechanism

| Parameter | Value |
|---|---|
| Mechanism type | Passive flap door + servo latch |
| Frame material | Fiberglass rod or HDPE strip |
| Net material | Nylon/polyester mesh |
| Locking method | Servo-actuated sliding latch |
| Deployment | 1× per session, manual reset by operator |
| Collection logic | ROV advances → water flow opens net → debris collected passively → ROV stops → net closes hydrodynamically |

### Filtration System

| Parameter | Value |
|---|---|
| Filter stages | 2-stage series |
| Stage 1 | Pre-filter 20–50 micron (sediment/silt removal) |
| Stage 2 | Final filter 0.1 micron (microplastic capture) |
| Housing | 10-inch filter housing × 2 (series topology) |
| Suction source | Bilge pump submersible DC 12V |
| Pre-intake screen | Hexagonal grid (3D printed) |
| Collector | Transparent removable container |
| Output | Filtered water discharged from rear of body |

### Sensor Suite

| Sensor | Measures | Interface |
|---|---|---|
| pH sensor (analog + board) | Water acidity/alkalinity | Analog → Arduino A1 |
| TDS sensor | Total Dissolved Solids (ppm) | Analog → Arduino A2 |
| Turbidity sensor | Water clarity (NTU) | Analog → Arduino A0 / ESP32 GPIO34 |
| DS18B20 temperature | Water temperature (°C) | OneWire → ESP32 GPIO32 |
| MPU6050 IMU | Orientation & tilt | I2C → ESP32 GPIO21/22 |

> Sensor probes are mounted on the underside of the body, facing the water column.

### Camera & Lighting

| Component | Spec | Position |
|---|---|---|
| ESP32-CAM | Onboard camera + WiFi | Front exterior, fixed waterproof housing |
| LED spotlight (white) | Waterproof × 2 | Front of body |
| LED DRL (orange) | Waterproof, aesthetic + alert | Sides of body |

### Power System

| Pack | Config | Nominal Voltage | Capacity | Powers |
|---|---|---|---|---|
| Pack A | Li-Ion 18650, 4S5P | 14.8V | ~12,500mAh | Propulsion (all 4 thrusters + ESCs) |
| Pack B | Li-Ion 18650, 3S2P | 11.1V | ~5,000mAh | Electronics (MCU, sensors, relay, LED, servo, pumps) |

- Battery trays are **hot-swappable** (top-access panel)
- BMS protection on each pack (fixed inside body, not part of tray)
- Emergency waterproof switch on body exterior

### Communication & Control

| Parameter | Value |
|---|---|
| Link type | Physical tether |
| Tether length | 20m |
| Tether content | USB/Ethernet waterproof cable |
| Operator interface | Tablet / laptop on surface |
| Data streamed | Sensor readings, camera feed, telemetry |
| Dashboard backend | Firebase (real deployment) |

### Electronics Architecture

| Component | Role |
|---|---|
| Arduino Mega | Motor control, relay switching, sensor acquisition |
| ESP32 | Dashboard comms, sensor aggregation, Firebase uplink |
| Relay module (8ch) | Controls bilge pump, solenoid valves, ballast pump, compressor, LEDs |
| BMS × 2 | Independent protection per battery pack |
| Buck converter 5V 3A | Powers relay, servo, sensors |
| Buck converter 3.3V | Powers ESP32, digital sensors |
| Level shifter 3.3V–5V | Safe comms bridge between Arduino and ESP32 |
| Conformal coating | Acrylic-based PCB protection (MG Chemicals 419C or equivalent) |

---

## 1.3 Competitive Positioning

Hydrone addresses five documented gaps in existing river robotics platforms:

1. **No river-specific ROV** — Most cleanup platforms are ocean-targeted; rivers are the primary plastic entry point into oceans (8M tons/year — Meijer et al., 2021)
2. **No active depth control in river ROVs** — Hydrone uses active thrusters for precision depth control, not ballast-only approaches
3. **No integrated dual collection** — Simultaneous macro debris (net) + microplastic filtration (0.1 µm)
4. **No sensor integration** — Existing platforms collect without monitoring water quality; Hydrone streams pH, TDS, turbidity, and temperature in real time
5. **Student-built accessibility** — Demonstrates that river intervention technology can be built affordably with 3D printing and off-the-shelf components

---

# PART 2 — WEBSITE CONTENT GUIDE

## 2.1 Brand Design System

### Color Palette

```
--brand-blue:       #1A56DB   /* Primary — logo blue, CTAs, headings */
--brand-navy:       #0D1B3E   /* Page background (dark mode) */
--brand-surface:    #111827   /* Card / panel background */
--brand-surface-2:  #1C2A4A   /* Elevated card, hover states */
--brand-orange:     #F05A22   /* Accent — from ROV trim and team vest */
--brand-orange-dim: #7A2D11   /* Dimmed orange for subtle use */
--brand-white:      #F8FAFF   /* Primary text */
--brand-muted:      #8B9EC7   /* Secondary text, labels */
--brand-border:     #1E2D50   /* Borders, dividers */
--brand-success:    #22C55E   /* Online/active status */
--brand-warn:       #F59E0B   /* Warning, partial states */
```

> The page is **dark mode only** — `--brand-navy` as `<body>` background throughout.

### Typography

```
Display / Hero heading:  "Space Grotesk", sans-serif — weight 700
  → Geometric, slightly technical, not the usual Poppins/Inter default
  → Use for H1, section titles, large stat numbers

Body / Prose:            "Inter", sans-serif — weight 400/500
  → Clean, legible for specs and descriptions

Data / Mono readouts:    "JetBrains Mono", monospace — weight 500
  → Used exclusively for sensor values, coordinates, status codes
  → This is the signature typographic choice: monospace data feels
     more "live instrument" than the standard tabular number approach
```

**CDN import (add to `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

### Spacing & Radius

```css
--radius-sm:  6px;
--radius-md:  12px;
--radius-lg:  20px;
--section-gap: 96px;   /* between page sections */
--card-pad:   24px;
```

### Signature Design Element
**The glowing sensor tile** — each sensor card on the Dashboard has a faint blue-to-orange radial glow behind the live value, pulsing every 3s to simulate an "active reading" state. This creates the "live instrument" feel that distinguishes the page from a static mockup.

---

## 2.2 Navigation

```
[Logo + "Hydrone"]    |    Home    Dashboard    About    Specs    |    [● LIVE]
```

- `● LIVE` = always-visible indicator in nav, green pulsing dot with text "LIVE"
- Nav is sticky, `background: rgba(13,27,62,0.9)`, `backdrop-filter: blur(12px)`
- Mobile: hamburger menu, full-screen overlay
- Active page: underline in `--brand-blue`

---

## 2.3 Page: Home / Landing

### Section 1 — Hero

**Layout:** Full viewport height, split 55/45 (text left, image right)

**Left side — copy:**
```
[eyebrow label]  RIVER ROV  ·  IID INNOPA 2026

[H1, 3 lines]    Cleaning Rivers.
                 Reading Water.
                 Built by Students.

[subtext]        Hydrone is an underwater ROV that collects
                 river plastic and streams live water quality
                 data — built from scratch by a five-person
                 high school team.

[CTA button — blue]   View Dashboard  →
[CTA ghost button]    Learn More
```

**Right side:**  
Use the ROV hero render image (the underwater photo with the net full of debris). Apply a very subtle blue vignette overlay at edges to blend into the navy background.

**Background treatment:**  
Faint hexagonal grid pattern (SVG, same pattern as the ROV's intake grille) at ~4% opacity over the navy background — ties the page visually to the machine.

---

### Section 2 — Three Pillars (Feature Cards)

**Layout:** 3 cards in a row, each with an icon, title, one-line description

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  [Net icon]     │  │  [Filter icon]  │  │  [Chart icon]   │
│                 │  │                 │  │                 │
│  COLLECT        │  │  FILTER         │  │  MONITOR        │
│                 │  │                 │  │                 │
│  Passive net    │  │  Two-stage      │  │  Real-time pH,  │
│  captures macro │  │  filtration     │  │  TDS, turbidity │
│  debris on      │  │  down to 0.1    │  │  and temperature│
│  every run.     │  │  microns.       │  │  via tether.    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Cards: `--brand-surface` background, `--brand-border` border, `--radius-lg`.  
On hover: border transitions to `--brand-blue`, subtle lift (translateY -4px).

---

### Section 3 — Key Stats Bar

**Layout:** 4 stats in a horizontal row, full-width, `--brand-surface` background

```
    500mm          4            0.1µm          20m
  Body Length   Thrusters   Filter Precision   Tether Range
```

Numbers in `Space Grotesk 700`, large (48–64px). Labels in `--brand-muted` 12px uppercase.

---

### Section 4 — ROV Render Showcase

**Layout:** Wide image (the ChatGPT render with ROV underwater), with caption overlay at bottom:

```
"Collecting microplastics at depth. Sungai Dengkeng, Central Java."
```

Aspect ratio ~16:5 crop of the full image. Image should have an orange accent line/glow on the left edge (1px, `--brand-orange`).

---

### Section 5 — Teaser CTA to Dashboard

```
[Full-width card, navy-to-slightly-lighter gradient]

  ● LIVE DATA STREAM

  "See Hydrone's sensors streaming in real time."

  [Button: "Open Dashboard →"]
```

---

## 2.4 Page: Dashboard

> **Implementation note:** All sensor values are **animated mock data**.
> Use the "random walk" approach: each value starts at a realistic base,
> then drifts ±small random increment every 2.5 seconds, clamped to a
> realistic range. Do NOT use fully random — it looks fake. Use:
> `newVal = clamp(oldVal + (Math.random() - 0.5) * step, min, max)`
> Sparkline: maintain a rolling 30-point array, update every 2.5s, render as SVG polyline.

### Mock Base Values & Ranges

| Sensor | Base | Step | Min | Max | Unit | Normal Range Label |
|---|---|---|---|---|---|---|
| pH | 7.2 | 0.04 | 6.5 | 8.1 | pH | 6.5 – 8.5 |
| TDS | 186 | 4 | 70 | 340 | ppm | < 500 ppm |
| Turbidity | 34 | 2.5 | 8 | 95 | NTU | < 50 NTU |
| Temperature | 26.4 | 0.1 | 23.0 | 30.0 | °C | 20 – 32°C |
| Depth | 1.2 | 0.05 | 0.0 | 3.5 | m | 0 – 10 m |
| Pack A battery | 78 | 0 | 0 | 100 | % | — (static for UI) |
| Pack B battery | 91 | 0 | 0 | 100 | % | — (static for UI) |
| Heading | 047 | 1 | 0 | 360 | ° | — |

> `Step = 0` means static value (for UI demo — don't animate battery as it would look wrong for a video).

---

### Dashboard Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ NAV: Hydrone | Home Dashboard About Specs | ● LIVE                  │
├──────────────────────────┬──────────────────────────────────────────┤
│                          │  ROV STATUS PANEL                        │
│   SENSOR TILES (2×2)     │  ┌─────────────────────────────────┐    │
│                          │  │ Status:  ● ACTIVE               │    │
│  ┌────────┐  ┌────────┐  │  │ Mode:    COLLECTION             │    │
│  │  pH    │  │  TDS   │  │  │ Depth:   1.2 m                  │    │
│  │ 7.24   │  │ 188ppm │  │  │ Heading: 047°                   │    │
│  │[spark] │  │[spark] │  │  └─────────────────────────────────┘    │
│  └────────┘  └────────┘  │                                          │
│                          │  THRUSTER STATUS                         │
│  ┌────────┐  ┌────────┐  │  ┌─────────────────────────────────┐    │
│  │ Turb.  │  │ Temp.  │  │  │ H-Left  (CW)  ████████░░  78%  │    │
│  │ 33 NTU │  │ 26.4°C │  │  │ H-Right (CCW) ████████░░  78%  │    │
│  │[spark] │  │[spark] │  │  │ V-Left        ██████░░░░  60%  │    │
│  └────────┘  └────────┘  │  │ V-Right       ██████░░░░  60%  │    │
│                          │  └─────────────────────────────────┘    │
│   DEPTH GAUGE            │                                          │
│   ┌──────────────────┐   │  BATTERY                                │
│   │   ≡≡≡≡≡≡≡≡≡≡≡   │   │  ┌─────────────────────────────────┐    │
│   │   1.2 m depth    │   │  │ Pack A (Propulsion)  ████ 78%  │    │
│   └──────────────────┘   │  │ Pack B (Electronics) ████ 91%  │    │
│                          │  └─────────────────────────────────┘    │
│   NET STATUS: ● CLOSED   │                                          │
│   FILTER:  ● ACTIVE      │  CAMERA FEED (placeholder)              │
│                          │  ┌─────────────────────────────────┐    │
│                          │  │  [dark frame, slight noise]     │    │
│                          │  │  "Live Feed — ESP32-CAM"        │    │
│                          │  └─────────────────────────────────┘    │
└──────────────────────────┴──────────────────────────────────────────┘
```

### Sensor Tile Anatomy

Each tile:
```
┌──────────────────────────┐
│ pH                    [?] │   ← label + info tooltip icon
│                           │
│   7.24                    │   ← JetBrains Mono 700, 40px, white
│   pH                      │   ← unit label, muted, 12px
│                           │
│  ▁▂▃▄▃▂▃▄▅▃▂▁▂▃▄         │   ← sparkline, brand-blue, 30pts
│                           │
│  ● Normal  6.5–8.5 pH     │   ← status dot + range
└──────────────────────────┘
```

Status dot logic:
- Green (●) = value within normal range
- Orange (●) = borderline (within 10% of limit)
- Red (●) = out of range

**Glowing pulse:** When value updates, the tile border briefly flashes `--brand-blue` (150ms ease-out). This is the signature element.

### Camera Feed Placeholder
Dark rectangle (`#050A14`), center-aligned text:
```
[Camera icon]
ESP32-CAM  ·  Live Feed
"Connecting to Hydrone..."  [subtle pulsing opacity]
```
> For video: play a short dark underwater video clip in this area if possible, or keep the animated "connecting" state.

### Control Panel (Minimal Stub — UI Only)
This can be a floating drawer or a separate sub-section below the dashboard. Label it:

```
⚠ CONTROL PANEL — DEMO MODE (Offline)
```

Include styled but **non-functional** controls:
- 4 directional arrows (Forward / Back / Left / Right) as large button grid
- Depth slider (Up / Down arrows with depth readout)
- Two toggle switches: "Net: CLOSED / OPEN" and "Filter: OFF / ON"
- All controls show a toast/snackbar when clicked: `"Demo mode — commands not transmitted."`

This makes the UI look complete without any backend needed.

---

## 2.5 Page: About / Team

### Section 1 — Project Story

```
ABOUT HYDRONE

[2-column layout: text left, team photo / ROV photo right]

Left text:
  "We are a five-person high school team from Mersiflab,
   building a river-cleaning ROV for the IID INNOPA competition.

   Hydrone started as a question: why do we keep cleaning the
   ocean when the plastic enters through rivers?

   We built the answer from 3D-printed PETG, off-the-shelf
   sensors, and a lot of iteration."

Right: Use the ROV underwater render image.
```

### Section 2 — Team Cards

**Layout:** Horizontal scroll on mobile, 3-column grid on desktop.

**Known team members** (fill remaining 3 with placeholder names/roles):

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  [Photo]         │  │  [Photo]         │  │  [Photo]         │
│                  │  │                  │  │                  │
│  Zaidan          │  │  Raisa           │  │  [Member 3]      │
│  CEO             │  │  CFO             │  │  [Role]          │
│  Brand &         │  │  Budget &        │  │                  │
│  Exhibition      │  │  Finance         │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│  [Member 4]      │  │  [Member 5]      │
│  [Role]          │  │  [Role]          │
│                  │  │                  │
└──────────────────┘  └──────────────────┘
```

> **Dev note:** Replace `[Photo]` with actual team photos when available.
> Use circular crop, `--brand-surface` background card.

### Section 3 — Organization Badge

```
[Mersiflab logo if available]
Built under  MERSIFLAB
For          IID INNOPA — International Invention, Innovation, and Technology Exhibition
Year         2026
```

---

## 2.6 Page: Specifications

**Layout:** Clean table page, no extra decoration. Two sections.

### Section 1 — At a Glance (Summary Cards)

6 stats displayed as large-number cards (same component as Home stats bar):

```
  500mm      120mm      4          0.1µm      20m        10m
  Length     Height   Thrusters   Microplastic Tether   Max Depth
                                  Precision   Range
```

### Section 2 — Full Specifications Table

Render the Engineering Specifications from Part 1.2 of this document as an HTML table, grouped by subsystem. Each subsystem gets a collapsible section (open by default on desktop, collapsed by default on mobile).

**Subsections:**
1. Body & Structure
2. Propulsion System
3. Ballast System
4. Net Mechanism
5. Filtration System
6. Sensor Suite
7. Camera & Lighting
8. Power System
9. Communication & Control

> Keep table style minimal: no zebra striping, thin `--brand-border` borders,
> `--brand-surface` background. Spec names in `--brand-muted`, values in white.

### Section 3 — Download / Reference

```
[Card at bottom of page]

"Full technical documentation is maintained in the Hydrone Bible —
 a living specification document updated by the project Librarian."

[Contact / request access button — links to team email]
```

---

## 2.7 Reusable UI Components

### Status Pill
```html
<!-- usage: <span class="status-pill active">ACTIVE</span> -->
```
- `active` → green background, white text, pulsing dot
- `standby` → amber background
- `offline` → muted gray background

### Live Indicator (nav)
```html
<span class="live-badge">● LIVE</span>
```
CSS: green dot with `animation: pulse 2s infinite`, text in `--brand-success`.

### Section Eyebrow Label
All section headers use a small all-caps muted label above the H2:
```
RIVER WATER QUALITY MONITORING
━━━━━━━━━━━━━━
Real-Time Dashboard
```
The `━━━` is a colored rule, `--brand-blue`, 2px height, width ~48px.

### Toast / Snackbar (for Control Panel)
Bottom-center, 3s auto-dismiss:
```
[!]  Demo mode — commands not transmitted.
```
Background `--brand-surface-2`, border-left `4px solid --brand-orange`.

---

## 2.8 Suggested Tech Stack

| Layer | Recommendation | Reason |
|---|---|---|
| Framework | Vanilla HTML/CSS/JS or React | No backend needed for demo |
| Styling | Tailwind CSS or plain CSS vars | Fast to build, easy to maintain |
| Charts/Sparklines | Chart.js (lightweight) or custom SVG | No need for heavy charting lib |
| Animation | CSS `@keyframes` + `setInterval` in JS | Keep it simple for mock data |
| Fonts | Google Fonts (Space Grotesk + Inter + JetBrains Mono) | Free, CDN-delivered |
| Hosting | GitHub Pages / Vercel / Netlify | Free tier sufficient for demo |

### Mock Data Update Loop (JavaScript)

```javascript
// Sensor config
const sensors = {
  ph:          { base: 7.2,  step: 0.04, min: 6.5,  max: 8.1,  unit: 'pH'  },
  tds:         { base: 186,  step: 4,    min: 70,   max: 340,  unit: 'ppm' },
  turbidity:   { base: 34,   step: 2.5,  min: 8,    max: 95,   unit: 'NTU' },
  temperature: { base: 26.4, step: 0.1,  min: 23.0, max: 30.0, unit: '°C'  },
  depth:       { base: 1.2,  step: 0.05, min: 0.0,  max: 3.5,  unit: 'm'   },
};

const history = {};
const HISTORY_LENGTH = 30;

// Initialize
Object.keys(sensors).forEach(key => {
  history[key] = Array(HISTORY_LENGTH).fill(sensors[key].base);
});

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function updateSensors() {
  Object.keys(sensors).forEach(key => {
    const s = sensors[key];
    const last = history[key][history[key].length - 1];
    const next = clamp(last + (Math.random() - 0.5) * s.step * 2, s.min, s.max);
    history[key].push(next);
    history[key].shift();

    // Update DOM
    const valueEl = document.getElementById(`sensor-${key}-value`);
    if (valueEl) valueEl.textContent = next.toFixed(key === 'tds' ? 0 : 1);

    // Update sparkline SVG
    updateSparkline(key, history[key], s.min, s.max);

    // Trigger tile pulse animation
    const tile = document.getElementById(`sensor-${key}-tile`);
    if (tile) {
      tile.classList.remove('pulse');
      void tile.offsetWidth; // reflow
      tile.classList.add('pulse');
    }
  });
}

setInterval(updateSensors, 2500);
```

```css
/* Tile pulse effect */
@keyframes tile-flash {
  0%   { border-color: var(--brand-blue); box-shadow: 0 0 12px rgba(26,86,219,0.6); }
  100% { border-color: var(--brand-border); box-shadow: none; }
}
.pulse {
  animation: tile-flash 0.6s ease-out;
}
```

---

## 2.9 Assets Available

| Asset | Filename | Use |
|---|---|---|
| Logo (color on light) | `_PFP_Hydrone.png` | Favicon, nav (on dark bg — needs white version) |
| Logo (black) | `BLACK_LOGO_Hydrone.png` | Light backgrounds if needed |
| ROV underwater render | `ChatGPT_Image_Jun_30_2026_10_44_29_AM.png` | Hero section, About page |
| ROV concept render | `ChatGPT_Image_Jun_19_2026_08_12_12_PM.png` | Secondary visual |
| Team vest photo | `depan.png` | About page / team section |
| Net mechanism interactive | `hydrone_net_mechanism.html` | Optionally embed as `<iframe>` in Specs |
| Full mechanism interactive | `hydrone_full_mechanism.html` | Optionally embed in Specs / Hero |

> **Note:** The `.html` interactive viewers are useful as embedded iframes on the Specifications page to give an interactive 3D-feel without needing a real CAD model.

---

## 2.10 SEO & Meta (for completeness)

```html
<title>Hydrone — River Debris Collection ROV</title>
<meta name="description" content="Hydrone is a student-built underwater ROV that collects river plastic and monitors water quality in real time. Built for IID INNOPA 2026 by Mersiflab.">
<meta property="og:title" content="Hydrone">
<meta property="og:description" content="Cleaning Rivers. Reading Water. Built by Students.">
<meta property="og:image" content="[path to ROV underwater render]">
<meta name="theme-color" content="#0D1B3E">
```

---

*End of document — HYDRONE_WEBSITE_BRIEF_v1.0*  
*Source: Hydrone Bible v0.2.0 — locked decisions only*  
*Prepared by: Hydrone Librarian, 2026-07-05*
