const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

console.log("CSS Content Length:", cssContent.length);

// Search for any CSS rule containing 'StyledFooter' or 'PrimaryFooter' or 'footer' or 'BackgroundImage'
// and print it out.
const lines = cssContent.split(/}/);
console.log("Total CSS rules (separated by }):", lines.length);

const matches = [];
lines.forEach((rule) => {
  if (rule.toLowerCase().includes('footer') || rule.includes('bLStxg') || rule.toLowerCase().includes('backgroundimage')) {
    matches.push(rule + '}');
  }
});

console.log(`Found ${matches.length} matching rules:`);
matches.forEach((m) => {
  if (m.length < 500) {
    console.log(m.trim());
  } else {
    console.log(m.trim().substring(0, 500) + '...');
  }
});
