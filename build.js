#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building Midcap Analysis Dashboard...\n');

try {
    // Read the main HTML template
    console.log('📖 Reading HTML template...');
    let html = fs.readFileSync('index.html', 'utf8');
    
    // Read the data file
    console.log('📊 Reading data file...');
    const dataContent = fs.readFileSync('data.js', 'utf8');
    
    // Read the app file
    console.log('⚙️  Reading application file...');
    const appContent = fs.readFileSync('app.js', 'utf8');
    
    // Replace placeholders with actual content
    console.log('🔧 Combining files...');
    html = html.replace('<!-- DATA_PLACEHOLDER -->', `<script>\n${dataContent}\n</script>`);
    html = html.replace('<!-- APP_PLACEHOLDER -->', `<script>\n${appContent}\n</script>`);
    
    // Add build timestamp
    const buildTime = new Date().toISOString();
    html = html.replace('<!-- BUILD_TIMESTAMP -->', `<!-- Built: ${buildTime} -->`);
    
    // Write the final file
    const outputFile = 'midcap-analysis-dashboard.html';
    fs.writeFileSync(outputFile, html);
    
    // Get file size
    const stats = fs.statSync(outputFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log('✅ Build completed successfully!');
    console.log(`📁 Output file: ${outputFile}`);
    console.log(`📏 File size: ${fileSizeKB} KB`);
    console.log(`📅 Build time: ${buildTime}`);
    
    // Validate the build
    console.log('\n🔍 Validating build...');
    if (html.includes('midcapData') && html.includes('Tabulator')) {
        console.log('✅ Data and Tabulator integration verified');
    } else {
        console.log('❌ Build validation failed');
        process.exit(1);
    }
    
    console.log('\n🎉 Ready to deploy! The single HTML file contains everything needed.');
    console.log('💡 You can now embed this file directly into any web page.');
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
