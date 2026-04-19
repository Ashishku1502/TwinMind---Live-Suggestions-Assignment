import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['var(--font-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        border: '#1e1e2e',
        'border-bright': '#2e2e4e',
        accent: '#7c6aff',
        'accent-green': '#00ff87',
        'accent-cyan': '#00d4ff',
        'accent-amber': '#ffa040',
        'accent-pink': '#ff6b9d',
        'text-primary': '#e0e0f0',
        'text-muted': '#6b6b8a',
        'text-dim': '#3a3a5a',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glow: {
          from: { boxShadow: '0 0 4px rgba(124, 106, 255, 0.3)' },
          to: { boxShadow: '0 0 12px rgba(124, 106, 255, 0.7)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
