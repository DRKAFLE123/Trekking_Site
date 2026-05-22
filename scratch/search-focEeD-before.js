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
  if (rule.includes('focEeD:before') || rule.includes('focEeD::before')) {
    console.log(rule.trim() + '}');
  }
});
