import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb', // blue-600
          secondary: '#4f46e5', // indigo-600
          accent: '#38bdf8', // sky-400
          dark: '#1e3a8a', // blue-900
          light: '#eff6ff' // blue-50
        },
        surface: {
          base: '#ffffff',
          muted: '#f8fafc',
          card: '#f1f5f9',
          elevated: '#ffffff'
        },
        feedback: {
          success: '#16a34a',
          warning: '#f59e0b',
          danger: '#dc2626'
        }
      },
      fontFamily: {
        display: ['"Zen Kaku Gothic New"', ...defaultTheme.fontFamily.sans],
        sans: ['"Syne"', ...defaultTheme.fontFamily.sans]
      },
      spacing: {
        section: '5rem',
        gutter: '1.5rem',
        card: '2.5rem'
      },
      boxShadow: {
        brand: '0 20px 45px rgba(37, 99, 235, 0.2)'
      },
      borderRadius: {
        brand: '1.25rem'
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(79,70,229,1) 50%, rgba(14,165,233,1) 100%)'
      }
    }
  }
}
