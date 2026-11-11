/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          primary: '#0F4336',      // Kerala Forest / Deep Government Green
          primaryLight: '#165B4A',
          primaryDark: '#0A2E25',
          gold: '#D97706',         // Royal Kerala Gold accent
          goldLight: '#F59E0B',
          accent: '#0284C7',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          textDark: '#0F172A',
          textMuted: '#475569'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
