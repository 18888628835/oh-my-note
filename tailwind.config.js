/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs: '320px',
      // => @media (min-width: 320px) { ... }
      s: '540px',
      // => @media (min-width: 540px) { ... }
      sm: '768px',
      // => @media (min-width: 768px) { ... }
      md: '960px',
      // => @media (min-width: 960px) { ... }
      lg: '1024px',
      // => @media (min-width: 1024px) { ... }
      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
    animatedSettings: {
      animatedSpeed: 300,
      classes: ['zoomIn'],
    },
  },
  plugins: [require('tailwind-scrollbar-hide'), require('daisyui'), require('tailwindcss-animatecss')],
  daisyui: {
    theme: ['light'],
    darkTheme: 'light',
  },
}
