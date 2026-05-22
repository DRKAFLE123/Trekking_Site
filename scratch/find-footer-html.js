const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Find all matches for '<footer' to see what elements are present
const footerRegex = /<footer[\s\S]*?<\/footer>/gi;
const matches = html.match(footerRegex) || [];
console.log(`Found ${matches.length} footer tags.`);

matches.forEach((footer, idx) => {
  console.log(`\n--- FOOTER ${idx+1} (length: ${footer.length}) ---`);
  // Print first 1000 characters and last 1000 characters
  if (footer.length <= 2000) {
    console.log(footer);
  } else {
    console.log(footer.substring(0, 1000));
    console.log('\n... [TRUNCATED] ...\n');
    console.log(footer.substring(footer.length - 1000));
  }
});
