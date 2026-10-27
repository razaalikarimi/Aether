import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070709',
        foreground: '#f3f4f6',
        surface: {
          void: '#050507',
          deep: '#0b0b0f',
          card: '#121218',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.2)',
          highlight: 'rgba(255, 255, 255, 0.04)',
        },
        metallic: {
          titanium: '#8d929b',
          silver: '#d6d9e0',
          chrome: '#f1f3f7',
          onyx: '#1c1d22',
          bronze: '#8c7853',
          gold: '#d4af37',
        },
        accent: {
          gold: '#e2b857',
          'gold-glow': 'rgba(226, 184, 87, 0.25)',
          cyan: '#00f2fe',
          'cyan-glow': 'rgba(0, 242, 254, 0.25)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-clash)', 'Cinzel', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
export default config;
