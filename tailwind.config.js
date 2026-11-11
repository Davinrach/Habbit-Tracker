/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rise: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          espresso: '#2D1F17',
          espressoLight: '#4A3B32',
          peach: '#FFEADA',
          peachLight: '#FFF4EC',
          orange: '#FF7A59',
          orangeDark: '#E06240',
          muted: '#8C857E',
          border: '#EDE6DD',
          subtle: '#F4EEE5',
        },
        badge: {
          waterBg: '#FFF1E8',
          waterText: '#D96B43',
          meditateBg: '#EAF4EC',
          meditateText: '#5B8C5A',
          stretchBg: '#F4EBF7',
          stretchText: '#9C6A9E',
          walkBg: '#F8EFE4',
          walkText: '#B07D48',
          prayerBg: '#E6F5F2',
          prayerText: '#2A9D8F',
          fitnessBg: '#FFEFEA',
          fitnessText: '#E25822',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 31, 23, 0.05)',
        'card': '0 2px 10px rgba(45, 31, 23, 0.03)',
        'float': '0 8px 30px rgba(45, 31, 23, 0.12)',
      }
    },
  },
  plugins: [],
}

