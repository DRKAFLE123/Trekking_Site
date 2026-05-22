const fs = require('fs');

if (fs.existsSync('components/TrekDetailClient.tsx')) {
  const content = fs.readFileSync('components/TrekDetailClient.tsx', 'utf8');
  console.log("File length:", content.length);
  
  // Search for the end of the page rendering (last 5000 characters of the file)
  const lastPart = content.substring(content.length - 10000);
  console.log("Searching background colors near the bottom of TrekDetailClient.tsx...");
  
  // Find any className with bg-
  const bgRegex = /className="[^"]*bg-[^"]*"/g;
  const matches = lastPart.match(bgRegex) || [];
  console.log("Found background classes near the bottom:");
  matches.forEach(m => console.log(m));
} else {
  console.log("components/TrekDetailClient.tsx not found.");
}
