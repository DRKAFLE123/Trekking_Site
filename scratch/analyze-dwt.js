const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Look for 'StyledFooter' or search for background images/svgs in the HTML
console.log("HTML length:", html.length);

const lines = html.split('\n');
console.log("Searching for footer or StyledFooter...");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('StyledFooter') || line.includes('footer-new-bg') || line.includes('footer-bg') || line.includes('footer_bg')) {
    console.log(`Line ${i}: ${line.substring(0, 300)}`);
  }
}

// Find any SVG tag with many paths that might represent the mountains or silhouette
console.log("\nSearching for SVGs...");
const svgRegex = /<svg[\s\S]*?<\/svg>/gi;
const svgs = html.match(svgRegex) || [];
console.log(`Found ${svgs.length} SVG tags.`);
svgs.forEach((svg, idx) => {
  console.log(`SVG ${idx+1}: length ${svg.length}, first 200 chars: ${svg.substring(0, 200)}`);
});
