import fs from 'fs';
import path from 'path';

const slidesDir = 'c:/Users/woonn/OneDrive/Desktop/fullstack/PROkafka/auto-main/ppt_temp/ppt/slides';

// Get slide files and sort them numerically
const files = fs.readdirSync(slidesDir)
  .filter(file => file.startsWith('slide') && file.endsWith('.xml'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('slide', '').replace('.xml', ''), 10);
    const numB = parseInt(b.replace('slide', '').replace('.xml', ''), 10);
    return numA - numB;
  });

files.forEach(file => {
  const filePath = path.join(slidesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract all text inside <a:t>...</a:t>
  const textMatches = content.match(/<a:t>([^<]*)<\/a:t>/g) || [];
  const texts = textMatches.map(m => {
    const match = m.match(/<a:t>([^<]*)<\/a:t>/);
    return match ? match[1] : '';
  }).filter(t => t.trim().length > 0);

  console.log(`=== Slide ${file.replace('.xml', '')} ===`);
  if (texts.length === 0) {
    console.log('[No text found]');
  } else {
    // Join and print
    let currentLine = '';
    texts.forEach(text => {
      // Very rough logic: if it's uppercase or looks like a title, print on new line
      if (text.length > 20 || /^[A-Z0-9\s,&_():\-]+$/.test(text)) {
        if (currentLine) {
          console.log(`  ${currentLine}`);
          currentLine = '';
        }
        console.log(`  ${text}`);
      } else {
        currentLine += ' ' + text;
      }
    });
    if (currentLine) {
      console.log(`  ${currentLine.trim()}`);
    }
  }
  console.log('\n');
});
