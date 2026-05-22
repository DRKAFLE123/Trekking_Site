const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Find the style tags
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

console.log("CSS Content Length:", cssContent.length);

// Let's search for class selectors like hRgydA, bhLNeQ, etc.
const classes = ['hRgydA', 'bhLNeQ', 'gLwvPr', 'ewLfLO', 'ggHjbU', 'MfeAM', 'BAcn'];
classes.forEach((c) => {
  const reg = new RegExp(`\\.${c}[^{]*\\{[^}]*\\}`, 'g');
  const cssMatches = cssContent.match(reg);
  if (cssMatches) {
    console.log(`\nRules for .${c}:`);
    cssMatches.forEach((m) => console.log(m));
  } else {
    console.log(`No rules found for .${c}`);
  }
});

// Search for any background or background-image in the CSS
console.log("\nSearching for background properties in CSS:");
const bgRegex = /[^{]*background[^}]*\}/gi;
const bgMatches = cssContent.match(bgRegex) || [];
console.log(`Found ${bgMatches.length} rules containing background.`);
bgMatches.forEach((m) => {
  if (m.includes('url') || m.includes('linear-gradient') || m.includes('footer') || m.includes('Footer')) {
    console.log(m.trim().substring(0, 300));
  }
});
