/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fdfbf7',
        sand: '#e8e0d2',
        bronze: '#433c35',
        tan: '#756656',
        navy: '#1a2b3c',
        gold: '#8f6a22',
        champagne: '#d8bd8f',
        blush: '#e8c4c4',
        'navy-light': '#2a3d52',
        'navy-dark': '#0f1a26',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 6vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.875rem, 4.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 3.5vw, 2rem)', { lineHeight: '1.2' }],
      },
      maxWidth: {
        'site': '1440px',
      },
      borderRadius: {
        'none': '0px',
      },
    },
  },
  plugins: [],
};
