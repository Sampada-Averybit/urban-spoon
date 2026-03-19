const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

// The specific replacements the user requested plus some common others found in the code
const replacements = [
  { search: /â€œ/g, replace: '"' },
  { search: /â€”/g, replace: '-' },
  { search: /â€“/g, replace: '-' },
  { search: /â€™/g, replace: "'" },
  { search: /â€ /g, replace: '"' }, // as per user instruction â€ -> "
  { search: /â€/g, replace: '"' }, // handle without space just in case
  { search: /cafÃ©/g, replace: "café" },
  { search: /Â©/g, replace: "©" },
  { search: /ðŸ ´/g, replace: "🍽️" }
];

let modifiedFilesCount = 0;
let modifiedFilesList = [];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    // Skip node_modules and dist and .git
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.next' || file === '.gemini') {
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (['.html', '.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.md'].includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

function processFile(filePath) {
  try {
    // Read the file with utf8 encoding (as Node mostly does by default)
    let content = fs.readFileSync(filePath, { encoding: 'utf8' });
    let originalContent = content;
    let modified = false;

    // Apply text replacements
    for (const r of replacements) {
      if (r.search.test(content)) {
        content = content.replace(r.search, r.replace);
        modified = true;
      }
    }

    // Ensure index.html has <meta charset="UTF-8">
    if (path.basename(filePath) === 'index.html') {
      if (!content.includes('<meta charset="UTF-8">') && !content.includes('<meta charset="utf-8">')) {
        // Try to insert it after <head>
        content = content.replace(/<head>/i, '<head>\n    <meta charset="UTF-8">');
        modified = true;
      }
    }

    if (modified && content !== originalContent) {
      // Write back with utf8
      fs.writeFileSync(filePath, content, { encoding: 'utf8' });
      modifiedFilesCount++;
      modifiedFilesList.push(path.relative(projectRoot, filePath));
      console.log('Fixed:', path.relative(projectRoot, filePath));
    }
  } catch (error) {
    console.error('Error processing:', filePath, error);
  }
}

console.log('Starting scan for text encoding issues...');
processDir(projectRoot);
console.log('Fix complete.');
console.log('Modified files count:', modifiedFilesCount);
console.log('Files:', JSON.stringify(modifiedFilesList, null, 2));

