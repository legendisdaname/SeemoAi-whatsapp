const fs = require('fs');
const path = require('path');

// Function to recursively find all HTML files
function findHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix paths in HTML content
function fixPaths(content) {
  // Fix CSS paths
  content = content.replace(/href="\/_next\//g, 'href="./_next/');
  
  // Fix JavaScript paths
  content = content.replace(/src="\/_next\//g, 'src="./_next/');
  
  // Fix preload paths
  content = content.replace(/href="\/_next\//g, 'href="./_next/');
  
  // Fix other asset paths
  content = content.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');
  
  // Fix paths in JavaScript strings within the HTML
  content = content.replace(/"\/_next\//g, '"./_next/');
  
  // Fix paths in CSS references within JavaScript
  content = content.replace(/HL\["\/_next\//g, 'HL["./_next/');
  
  // Fix any remaining absolute paths to _next
  content = content.replace(/\/_next\//g, './_next/');
  
  return content;
}

// Main execution
console.log('🔧 Fixing ALL absolute paths for Hostinger deployment...');

const outDir = path.join(__dirname, 'out');
const htmlFiles = findHtmlFiles(outDir);

console.log(`Found ${htmlFiles.length} HTML files to process`);

for (const filePath of htmlFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixPaths(content);
    fs.writeFileSync(filePath, fixedContent);
    console.log(`✅ Fixed paths in: ${path.relative(outDir, filePath)}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log('🎉 Complete path fixing completed!');
console.log('📁 Your files in the "out" directory are now ready for Hostinger upload.');
console.log('💡 Make sure to upload the ENTIRE "_next" directory to your hosting!'); 