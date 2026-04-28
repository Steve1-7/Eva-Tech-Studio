import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#07080F',
          2: '#0D0E18',
          3: '#12141F',
          4: '#1A1C2A',
          5: '#232638',
        },
        gold: {
          DEFAULT: '#C9A96E',
          bright: '#E8C97A',
          dim: '#8B6F3A',
        },
        sage: {
          DEFAULT: '#4A7A64',
          light: '#6BA889',
        },
        platinum: {
          DEFAULT: '#E8E3D8',
          dim: '#B8B2A8',
          muted: '#6B6860',
        },
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
      animation: {
        'marquee-scroll': 'marquee-scroll 30s linear infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
        'aurora': 'aurora-drift 14s ease-in-out infinite',
        'fade-up': 'fade-up 0.65s cubic-bezier(0.22,1,0.36,1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
