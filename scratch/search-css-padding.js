const fs = require('fs');

const cssFiles = ['scratch/dwt-css-1.css', 'scratch/dwt-css-2.css', 'scratch/dwt-css-3.css'];

cssFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    const css = fs.readFileSync(file, 'utf8');
    console.log(`\n--- FILE: ${file} (length: ${css.length}) ---`);
    
    // Find lines with 'padding' or 'StyledFooter' or 'footer' or background properties
    const lines = css.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('Footer') || line.includes('footer') || line.includes('padding-top') || line.includes('paddingTop') || line.includes('pt-') || line.includes('background-image')) {
        if (line.length < 500) {
          console.log(`Line ${idx+1}: ${line}`);
        } else {
          console.log(`Line ${idx+1}: ${line.substring(0, 500)}...`);
        }
      }
    });
  } else {
    console.log(`File not found: ${file}`);
  }
});
