/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mulish', 'sans-serif'],
        serif: ['Cinzel', 'serif']
      },
      colors: {
        text: 'hsl(0 0% 15%)',
        background: 'hsl(60 30% 97%)',
        link: 'hsl(0 0% 15%)',
        'link-hover': 'hsl(320 70% 35%)'
      },
      fontSize: {
        'h1-desktop': '4.209rem',
        'h2-desktop': '3.157rem',
        'h3-desktop': '2.369rem',
        'h4-desktop': '1.777rem',
        'h5-desktop': '1.333rem',
        'h1-mobile': '1.802rem',
        'h2-mobile': '1.602rem',
        'h3-mobile': '1.424rem',
        'h4-mobile': '1.266rem',
        'h5-mobile': '1.125rem',
        'small-desktop': '0.75rem',
        'small-mobile': '0.889rem'
      }
    }
  },
  plugins: []
};
