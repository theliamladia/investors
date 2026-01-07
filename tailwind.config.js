module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matrix': {
          green: '#00ff41',
          'dark-green': '#003b00',
          'darker-green': '#001a00',
          black: '#0d0208',
        }
      },
      fontFamily: {
        'matrix': ['DotGothic16', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}