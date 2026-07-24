/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./assets/js/**/*.js",
    "./content/**/*.{md,html}",
    "./exampleSite/content/**/*.{md,html}",
    "./static/js/**/*.js",
    "./archetypes/**/*.{md,html}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Space Mono", "Courier New", "monospace"]
      }
    }
  }
};
