const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

// Search for trekker-graphic.svg and get the selector
const regex = /([^{]+)\{[^}]+trekker-graphic\.svg[^}]+\}/gi;
const matches = cssContent.match(regex) || [];
console.log("Matching selectors for trekker-graphic.svg:");
matches.forEach((m) => console.log(m.trim()));
