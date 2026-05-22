const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

const lines = cssContent.split(/}/);
lines.forEach((rule) => {
  if (rule.includes('sc-80b64b35-1') || rule.includes('bLStxg')) {
    console.log(rule.trim() + '}');
  }
});
