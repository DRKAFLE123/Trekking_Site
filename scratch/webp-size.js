const fs = require('fs');

function getWebpSize(filepath) {
  const buffer = fs.readFileSync(filepath);
  
  // WebP header starts with RIFF
  if (buffer.toString('ascii', 0, 4) !== 'RIFF') {
    throw new Error('Not a RIFF file');
  }
  
  if (buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Not a WEBP file');
  }
  
  const type = buffer.toString('ascii', 12, 16);
  console.log("WebP type:", type);
  
  let width = 0;
  let height = 0;
  
  if (type === 'VP8 ') {
    // Lossy WebP
    // Width and height are at offset 26
    width = buffer.readUInt16LE(26) & 0x3fff;
    height = buffer.readUInt16LE(28) & 0x3fff;
  } else if (type === 'VP8L') {
    // Lossless WebP
    // Width and height are at offset 21 (bits: 14 bits width, 14 bits height)
    const val = buffer.readUInt32LE(21);
    width = (val & 0x3fff) + 1;
    height = ((val >> 14) & 0x3fff) + 1;
  } else if (type === 'VP8X') {
    // Extended WebP
    // Width and height are 24-bit integers starting at offset 24 and 27
    width = buffer.readUIntLE(24, 3) + 1;
    height = buffer.readUIntLE(27, 3) + 1;
  } else {
    throw new Error('Unknown WebP format type: ' + type);
  }
  
  return { width, height };
}

try {
  const size = getWebpSize('public/footer-new-bg.webp');
  console.log('footer-new-bg.webp size:', size.width, 'x', size.height, 'Aspect Ratio:', (size.width / size.height).toFixed(2));
} catch (e) {
  console.error('Error:', e.message);
}
