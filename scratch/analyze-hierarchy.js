const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Find occurrences of the classes and print the surrounding tags
const classes = ['hRgydA', 'focEeD', 'ewLfLO', 'ggHjbU'];
console.log("Analyzing HTML structure...");

classes.forEach((cls) => {
  const idx = html.indexOf(cls);
  if (idx !== -1) {
    console.log(`\n=== Class: ${cls} ===`);
    // Print around the occurrence
    const start = Math.max(0, idx - 150);
    const end = Math.min(html.length, idx + 400);
    console.log(html.substring(start, end));
  } else {
    console.log(`\n=== Class: ${cls} not found in raw HTML ===`);
  }
});
