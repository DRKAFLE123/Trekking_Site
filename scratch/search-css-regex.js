const fs = require('fs');

const cssFiles = ['scratch/dwt-css-1.css', 'scratch/dwt-css-2.css', 'scratch/dwt-css-3.css'];

cssFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    const css = fs.readFileSync(file, 'utf8');
    console.log(`\n--- FILE: ${file} (length: ${css.length}) ---`);
    
    // Find all occurrences of PrimaryFooter, footer, or StyledFooter
    const regex = /[^{}]*footer[^{}]*\{[^}]*\}/gi;
    const matches = css.match(regex) || [];
    console.log(`Found ${matches.length} matches for 'footer' rules:`);
    matches.forEach(m => console.log(m));

    const regex2 = /[^{}]*PrimaryFooter[^{}]*\{[^}]*\}/gi;
    const matches2 = css.match(regex2) || [];
    console.log(`Found ${matches2.length} matches for 'PrimaryFooter' rules:`);
    matches2.forEach(m => console.log(m));
  }
});
