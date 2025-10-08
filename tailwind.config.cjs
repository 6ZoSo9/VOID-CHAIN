/**** Tailwind setup ****/
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { mono: ['ui-monospace','SFMono-Regular','Menlo','Monaco','Consolas','monospace'] },
      boxShadow: { 'crt': '0 0 0 1px rgba(0,255,170,0.15), 0 0 24px rgba(0,255,170,0.05)' },
      colors: { void: { bg:'#000000', fg:'#A6FFD4', accent:'#21FFA3', dim:'#0A4332' } }
    },
  },
  plugins: [],
}
