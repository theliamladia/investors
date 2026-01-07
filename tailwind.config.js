module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          green: '#00ff41',
          'dark': '#003b00',
          'darker': '#001a00',
          'black': '#0a0e0a',
          'red': '#ff0000',
        }
      },
      fontFamily: {
        matrix: ['DotGothic16', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        'matrix': '0.1em',
      }
    },
  },
  plugins: [],
}