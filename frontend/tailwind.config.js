module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        slate: {
          950: '#0f172a',
          900: '#121f3c',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        panel: '#f8fafc',
        accent: '#3b82f6',
        risk: {
          low: '#16a34a',
          medium: '#eab308',
          high: '#f97316',
          critical: '#dc2626',
        },
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.12)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
