const fs = require('fs');
const path = require('path');

const reportFilePath = path.join(__dirname, 'reports', 'html', 'index.html');
const cssLink = '<link rel="stylesheet" href="assets/css/custom.css">';

console.log('Patching report to include custom CSS...');

fs.readFile(reportFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading report file: ${err}`);
    return;
  }

  // Verifica se o CSS já não foi injetado para evitar duplicatas
  if (data.includes(cssLink)) {
    console.log('Custom CSS already included. No patch needed.');
    return;
  }

  // Encontra o final da tag <head> e injeta o CSS antes dela
  const patchedData = data.replace('</head>', `  ${cssLink}\n</head>`);

  fs.writeFile(reportFilePath, patchedData, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error(`Error writing patched report file: ${writeErr}`);
      return;
    }
    console.log('✅ Report patched successfully!');
  });
}); 