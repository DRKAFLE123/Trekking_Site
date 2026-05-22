const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let cssContent = '';
while ((match = styleRegex.exec(html)) !== null) {
  cssContent += match[1];
}

const targetClasses = [
  'hRgydA', // StyledFooter
  'focEeD', // StyledPrimaryFooter
  'bLStxg', // StyledBackgroundImage
  'ewLfLO', // StyledFooterContent
  'ggHjbU', // StyledFooterContentWrapper
  'MfeAM',  // StyledFooterLogo
  'FRPuu',  // StyledContactInfo
  'BAcn',   // StyledFooterGrid
  'iPpJBh'  // SecondaryFooterContainer
];

console.log("--- FOUND RULES ---");
targetClasses.forEach((cls) => {
  // Regex to find rules for this class
  // e.g. .classname{...} or .classname[something]{...}
  const reg = new RegExp(`\\.${cls}[^{]*\\{[^}]*\\}`, 'g');
  const matches = cssContent.match(reg) || [];
  console.log(`\nClass .${cls}:`);
  matches.forEach(m => console.log(m));
});
