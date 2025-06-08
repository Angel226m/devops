

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados para la marca
        'primary': {
          50: '#eafaf5',
          100: '#d0f5ea',
          200: '#a3ead5',
          300: '#6dd7b9',
          400: '#34bd96',
          500: '#1ca280',
          600: '#138169',
          700: '#136655',
          800: '#125245',
          900: '#11453a',
          950: '#07271f',
        },
        'secondary': {
          50: '#f0f7fe',
          100: '#ddecfd',
          200: '#c1ddfb',
          300: '#93c6f8',
          400: '#5ea5f3',
          500: '#3b87ed',
          600: '#2567e2',
          700: '#1f53cc',
          800: '#2044a6',
          900: '#1e3a83',
          950: '#172554',
        },
        // Específico para ambiente marítimo
        'ocean': {
          50: '#effaff',
          100: '#ddf4ff',
          200: '#b3e9ff',
          300: '#70d7ff',
          400: '#2ac0ff',
          500: '#06a4f8',
          600: '#0083d4',
          700: '#0069ab',
          800: '#005a8d',
          900: '#074b75',
          950: '#042e4b',
        },
        'beach': {
          50: '#faf8ed',
          100: '#f3efd4',
          200: '#e9dda6',
          300: '#ddc671',
          400: '#d2ae49',
          500: '#c49a33',
          600: '#a57826',
          700: '#835922',
          800: '#6d4923',
          900: '#5d3d21',
          950: '#341f0f',
        },
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
        display: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-light': 'bounceLight 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 1.5s linear infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        wave: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(-5px) translateY(5px)' },
          '50%': { transform: 'translateX(0) translateY(10px)' },
          '75%': { transform: 'translateX(5px) translateY(5px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/images/ocean-pattern.svg')",
        'wave-pattern': "url('/src/assets/images/wave-pattern.svg')",
        'footer-texture': "url('/src/assets/images/footer-texture.png')",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
        'glow': '0 0 15px 5px rgba(34, 211, 238, 0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'wave': '50% 50% 50% 70% / 50% 50% 70% 60%',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
          },
        },
      }),
      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
      },
      gridTemplateRows: {
        'layout': 'auto 1fr auto',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    // Plugin personalizado para animaciones de agua
    function({ addComponents, theme }) {
      const waterEffects = {
        '.water-ripple': {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '100%',
            animation: `${theme('animation.ripple')}`,
          }
        },
        '.floating': {
          animation: `${theme('animation.float')}`,
        },
        '.wave-text': {
          display: 'inline-block',
          animation: `${theme('animation.wave')}`,
          animationDelay: 'calc(0.1s * var(--index))',
        },
        '.underwater-blur': {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
        },
      }
      addComponents(waterEffects)
    },
  ],
}


/** @type /*{import('tailwindcss').Config} *//*
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados para la marca
        'primary': {
          50: '#eafaf5',
          100: '#d0f5ea',
          200: '#a3ead5',
          300: '#6dd7b9',
          400: '#34bd96',
          500: '#1ca280',
          600: '#138169',
          700: '#136655',
          800: '#125245',
          900: '#11453a',
          950: '#07271f',
        },
        'secondary': {
          50: '#f0f7fe',
          100: '#ddecfd',
          200: '#c1ddfb',
          300: '#93c6f8',
          400: '#5ea5f3',
          500: '#3b87ed',
          600: '#2567e2',
          700: '#1f53cc',
          800: '#2044a6',
          900: '#1e3a83',
          950: '#172554',
        },
        // Específico para ambiente marítimo
        'ocean': {
          50: '#effaff',
          100: '#ddf4ff',
          200: '#b3e9ff',
          300: '#70d7ff',
          400: '#2ac0ff',
          500: '#06a4f8',
          600: '#0083d4',
          700: '#0069ab',
          800: '#005a8d',
          900: '#074b75',
          950: '#042e4b',
        },
        'beach': {
          50: '#faf8ed',
          100: '#f3efd4',
          200: '#e9dda6',
          300: '#ddc671',
          400: '#d2ae49',
          500: '#c49a33',
          600: '#a57826',
          700: '#835922',
          800: '#6d4923',
          900: '#5d3d21',
          950: '#341f0f',
        },
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
        display: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-light': 'bounceLight 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 1.5s linear infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        wave: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(-5px) translateY(5px)' },
          '50%': { transform: 'translateX(0) translateY(10px)' },
          '75%': { transform: 'translateX(5px) translateY(5px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/images/ocean-pattern.svg')",
        'wave-pattern': "url('/src/assets/images/wave-pattern.svg')",
        'footer-texture': "url('/src/assets/images/footer-texture.png')",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
        'glow': '0 0 15px 5px rgba(34, 211, 238, 0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'wave': '50% 50% 50% 70% / 50% 50% 70% 60%',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.gray.300'),
            },
            strong: {
              color: theme('colors.gray.300'),
            },
            blockquote: {
              color: theme('colors.gray.400'),
            },
          },
        },
      }),
      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
      },
      gridTemplateRows: {
        'layout': 'auto 1fr auto',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    // Plugin personalizado para animaciones de agua
    function({ addComponents, theme }) {
      const waterEffects = {
        '.water-ripple': {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '100%',
            animation: `${theme('animation.ripple')}`,
          }
        },
        '.floating': {
          animation: `${theme('animation.float')}`,
        },
        '.wave-text': {
          display: 'inline-block',
          animation: `${theme('animation.wave')}`,
          animationDelay: 'calc(0.1s * var(--index))',
        },
        '.underwater-blur': {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
        },
      }
      addComponents(waterEffects)
    },
  ],
}*/