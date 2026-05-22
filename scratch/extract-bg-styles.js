const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

const bLStxgRegex = /\.bLStxg[^{]*\{[^}]*\}/g;
const bLStxgMatches = cssContent.match(bLStxgRegex) || [];
console.log("bLStxg CSS rules:");
bLStxgMatches.forEach(m => console.log(m));

const sc80b64b35Regex = /id="PrimaryFooter-style__StyledBackgroundImage-sc-80b64b35-1"[\s\S]*?\{([^}]+)\}/gi;
const scMatches = cssContent.match(sc80b64b35Regex) || [];
console.log("\nsc-80b64b35-1 CSS rules:");
scMatches.forEach(m => console.log(m));
