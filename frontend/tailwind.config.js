module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0A0F0D',
          900: '#0A0F0D',
          800: '#12211B',
          700: '#1a2e25',
          600: '#223b30',
          500: '#2a483b',
        },
        accent: {
          primary: '#064E3B',
          emerald: '#10B981',
          neon: '#00FF9C',
          cyan: '#00FF9C',
          blue: '#10B981',
          purple: '#064E3B',
          pink: '#10B981',
          green: '#00FF9C',
          yellow: '#FFD740',
        },
        text: {
          primary: '#E0E0E0',
          secondary: '#9CA3AF',
        },
        alert: {
          red: '#FF5252',
          yellow: '#FFD740',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0A0F0D 0%, #12211B 100%)',
        'gradient-dark-radial': 'radial-gradient(circle at top right, #12211B, #0A0F0D)',
        'gradient-accent': 'linear-gradient(135deg, #064E3B 0%, #10B981 50%, #00FF9C 100%)',
        'gradient-accent-hover': 'linear-gradient(135deg, #10B981 0%, #00FF9C 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(0, 255, 156, 0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 78, 59, 0.05) 0px, transparent 50%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 255, 156, 0.4), 0 0 40px rgba(0, 255, 156, 0.3)',
        'neon-blue': '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.3)',
        'neon-purple': '0 0 20px rgba(6, 78, 59, 0.4), 0 0 40px rgba(6, 78, 59, 0.3)',
        'neon-pink': '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 255, 156, 0.1)',
        'glass-lg': '0 12px 48px 0 rgba(0, 255, 156, 0.15)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-lg': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 156, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 156, 0.5), 0 0 60px rgba(0, 255, 156, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      scale: ['group-hover'],
      transform: ['group-hover'],
    },
  },
  plugins: [],
}
