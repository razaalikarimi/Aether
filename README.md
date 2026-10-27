# AETHER — Ultra-Premium Cinematic 3D E-Commerce Flagship

An elite, cinematic, luxury digital flagship store built with **Next.js 14 (App Router)**, **TypeScript (Strict Mode)**, **Three.js**, **React Three Fiber**, **Tailwind CSS**, and the **Shopify Storefront GraphQL API**.

---

## Architecture & Engineering Highlights

### 1. 3D WebGL & Shader Pipeline
- **Floating Physics Controller (`FloatingProductController`)**: Delta-time aware interpolation, smooth inertial damping, mouse raycasting with clamped angular tilt, and subtle sine-wave orbital micro-movement.
- **Custom GLSL Fluid Aura Shader (`FluidAuraBackground`)**: Procedural simplex noise, multi-scale domain warping, mouse velocity-driven deformation, and subtle chromatic dispersion.
- **Segmented Exploded Transducer Architecture (`HeroProductModel`)**: High-fidelity 3D planar-magnetic headphone model with individually animated sub-assemblies (outer acoustic grille, neodymium stator array, nanometer diaphragm, damping ring, memory foam pads).
- **Procedural Particle System (`FloatingParticles`)**: Instanced buffer particles with orbital drift, gravity-anchor pull, and interactive pointer repulsion.
- **Dynamic PBR Material Switcher**: Real-time shader parameter interpolation for bespoke architectural finishes:
  - *Aerospace Grade 5 Titanium*
  - *DLC Matte Obsidian*
  - *Mirrored Chrome Silver*
  - *18K Champagne Gold Luster*

### 2. Runtime Adaptive Performance Management
- **`WebGLPerformanceManager`**: Continuous real-time frame delta measuring (`performance.now()`), tracking sustained low-frame rate dips below 45 FPS with hysteresis recovery delays.
- **Dynamic Quality Tiers**:
  - `ULTRA`: Full particle budget (900+), high-res shader passes, max DPR 2.0.
  - `BALANCED`: 400 particles, simplified passes, max DPR 1.5.
  - `LOW`: 120 particles, lightweight lighting, max DPR 1.0.
  - `FALLBACK`: Automatic switch to the dedicated `CinematicProductFallback` (layered CSS parallax, high-res photography, and functional commerce controls).
- **Graceful WebGL Error Boundary & Context Loss Recovery**.

### 3. Shopify Storefront GraphQL Integration
- **Server-Side Data Architecture (`src/lib/shopify/`)**:
  - Typed GraphQL queries & mutations compliant with 2024-07+ API schema (`getProducts`, `getProductByHandle`, `getCollections`, `createCart`, `addToCart`, `updateCartLines`, `removeFromCart`).
  - Strict TypeScript types with zero `any` usage.
  - Resilient local development mode with curated masterworks data when live Shopify credentials are not provided.
  - Direct checkout redirection to Shopify's official encrypted checkout URL.

### 4. Cinematic Scroll Choreography
- Pinned viewport sticky storytelling synchronizing scroll progress with camera coordinates, object rotation, exploded component separation, and dynamic editorial text overlays.
- Full respect for `prefers-reduced-motion: reduce`.

---

## Project Structure

```text
3D E-COMMERCE/
├── src/
│   ├── app/
│   │   ├── globals.css                # Luxury design tokens, CSS variables & scrollbar
│   │   ├── layout.tsx                 # Root layout with fonts, metadata, CartProvider
│   │   ├── page.tsx                   # Homepage with CinematicStoryScroll
│   │   ├── products/[handle]/page.tsx # Product Detail Page (PDP) with interactive 3D viewer
│   │   ├── collections/[handle]/page.tsx # Collection category discovery
│   │   ├── search/page.tsx            # Live catalog search with instant filtering
│   │   ├── cart/page.tsx              # Acquisition review page
│   │   ├── not-found.tsx              # Architectural 404 page
│   │   └── error.tsx                  # Next.js client error boundary
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx             # Brand header with live FPS/tier toggle & cart badge
│   │   │   ├── Footer.tsx             # Editorial footer with private dispatch newsletter
│   │   │   └── CartDrawer.tsx         # Slide-over cart with live quantities & checkout
│   │   ├── three/
│   │   │   ├── Scene.tsx              # R3F scene with lighting & error boundary
│   │   │   ├── HeroProductModel.tsx   # Segmented 3D headphone with exploded targets
│   │   │   ├── FloatingProductController.tsx # Inertial physics & scroll choreography
│   │   │   ├── FloatingParticles.tsx  # Instanced buffer points with pointer repulsion
│   │   │   ├── FluidAuraBackground.tsx# Custom GLSL background shader
│   │   │   └── CinematicProductFallback.tsx # Layered 2D CSS parallax fallback
│   │   ├── home/
│   │   │   ├── HeroSection.tsx        # Hero viewport overlay
│   │   │   ├── CinematicStoryScroll.tsx # 8-stage synchronized storytelling
│   │   │   ├── FeaturedCollection.tsx # Filterable permanent collection grid
│   │   │   └── TechSpecsSection.tsx   # Engineering telemetry table
│   │   └── product/
│   │       ├── ProductCard.tsx        # Card with hover zoom & quick-add
│   │       └── ProductDetailClient.tsx# PDP client with 3D finish switcher
│   ├── hooks/
│   │   ├── useCart.tsx                # Cart state, quantities & checkout
│   │   └── useReducedMotion.ts        # Media query hook for accessibility
│   ├── lib/
│   │   ├── shopify/                   # Client, queries, mutations, mock fallback
│   │   └── performance/               # WebGLPerformanceManager & usePerformanceTier
│   ├── shaders/
│   │   └── fluidAura.ts               # GLSL vertex & fragment shaders
│   └── types/
│       ├── commerce.ts                # Strict Shopify product & cart models
│       └── three.ts                   # Scene, performance tiers, materials
├── tests/
│   ├── setup.ts                       # JSDOM test environment setup
│   ├── performanceManager.test.ts     # Tier transition & hysteresis tests
│   ├── commerce.test.ts               # Cart lifecycle & GraphQL mapping tests
│   └── floatingPhysics.test.ts        # Inertial damping & tilt math tests
└── vitest.config.ts                   # Vitest testing configuration
```

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Shopify credentials:
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_public_storefront_access_token
SHOPIFY_STOREFRONT_API_VERSION=2024-07
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_3D=true
```
*(Note: If left with default placeholders, the application automatically engages high-fidelity development mock mode with zero errors).*

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Automated Testing
```bash
npm test
```
Runs the full Vitest unit and integration test suite across physics calculations, Shopify cart transactions, and performance manager tiers.

### 5. Production Build
```bash
npm run build
```
Generates statically optimized and server-rendered routes with strict type verification.
