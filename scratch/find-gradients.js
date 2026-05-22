const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

const gradRegex = /linear-gradient\([^)]+\)/gi;
const matches = cssContent.match(gradRegex) || [];
console.log(`Found ${matches.length} linear gradients in CSS:`);
const uniqueMatches = [...new Set(matches)];
uniqueMatches.forEach((m, idx) => {
  console.log(`${idx+1}: ${m}`);
});
