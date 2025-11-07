/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-satoshi)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'], // Satoshi через Inter
        'satoshi': ['var(--font-satoshi)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'], // Satoshi (через Inter)
        'space-grotesk': ['var(--font-space-grotesk)', 'Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        'solana-purple': '#9945FF',
        'solana-green': '#14F195',
        'solana-teal': '#00D4FF',
        '402-dark': '#0a0a0f',
        '402-purple': '#8B5CF6',
        '402-green': '#10B981',
        '402-teal': '#00D4FF',
        'border': 'rgba(255, 255, 255, 0.1)',
        'card': 'rgba(10, 10, 15, 0.8)',
        'muted-foreground': 'rgba(255, 255, 255, 0.6)',
      },
      letterSpacing: {
        'brand': '0.02em',
        'tight': '0.01em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'network-pulse': 'network-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.5)' },
        },
        'network-pulse': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

