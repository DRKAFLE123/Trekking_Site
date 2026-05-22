const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

const regex = /\.focEeD[^{]*\{[^}]*\}/g;
const matches = cssContent.match(regex) || [];
console.log("focEeD CSS rules:");
matches.forEach(m => console.log(m));
