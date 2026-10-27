/**
 * Centralized Design System Tokens for Luxury 3D E-Commerce
 * Visual Direction: Atmospheric dark-space, graphite metallic surfaces, champagne gold accents.
 */

export const DESIGN_TOKENS = {
  colors: {
    surface: {
      void: '#050507',
      deep: '#0b0b0f',
      card: '#121218',
      cardHover: '#181822',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(255, 255, 255, 0.22)',
      glass: 'rgba(18, 18, 24, 0.72)',
    },
    metallic: {
      onyx: '#1c1d22',
      titanium: '#8d929b',
      silver: '#d6d9e0',
      chrome: '#f1f3f7',
      gold: '#d4af37',
      bronze: '#8c7853',
    },
    accent: {
      gold: '#e2b857',
      goldGlow: 'rgba(226, 184, 87, 0.25)',
      cyan: '#00f2fe',
      cyanGlow: 'rgba(0, 242, 254, 0.25)',
    },
    text: {
      primary: '#f4f5f8',
      secondary: '#9496a6',
      muted: '#5c5e6e',
      highlight: '#ffffff',
    },
  },
  typography: {
    fontFamilies: {
      display: 'var(--font-clash, "Cinzel", "Times New Roman", serif)',
      sans: 'var(--font-inter, system-ui, -apple-system, sans-serif)',
      mono: 'var(--font-mono, "JetBrains Mono", monospace)',
    },
    scale: {
      hero: 'clamp(2.75rem, 7vw, 6.5rem)',
      display1: 'clamp(2rem, 5vw, 4.25rem)',
      display2: 'clamp(1.5rem, 3.5vw, 2.75rem)',
      title: 'clamp(1.25rem, 2vw, 1.75rem)',
      bodyLarge: '1.125rem',
      body: '0.9375rem',
      caption: '0.75rem',
      micro: '0.625rem',
    },
  },
  spacing: {
    containerMax: '1440px',
    sectionPaddingY: 'clamp(5rem, 12vh, 10rem)',
  },
  zIndex: {
    canvas: 0,
    backgroundOverlay: 5,
    content: 10,
    header: 40,
    modal: 50,
    toast: 60,
  },
  animation: {
    easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
    durationNormal: 0.6,
    durationCinematic: 1.2,
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;
