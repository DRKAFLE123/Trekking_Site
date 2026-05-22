const fs = require('fs');

const cssFiles = ['scratch/dwt-css-1.css', 'scratch/dwt-css-2.css', 'scratch/dwt-css-3.css'];

cssFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    const css = fs.readFileSync(file, 'utf8');
    console.log(`\n--- FILE: ${file} ---`);
    const regex = /url\([^)]+\)/gi;
    const matches = css.match(regex) || [];
    console.log(`Found ${matches.length} background image URLs:`);
    matches.forEach(m => console.log(m));
  }
});
