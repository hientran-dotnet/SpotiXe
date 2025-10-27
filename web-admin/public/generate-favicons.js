// Generate Favicon Script
// This script helps you generate all required favicon sizes

/**
 * PREREQUISITE: You need a source image
 * Recommended: 512x512 PNG with transparent background
 * Place it as: public/logo-source.png
 */

// Option 1: Use this PowerShell script to generate using ImageMagick
// Save as: generate-favicons.ps1

/*
PowerShell Script Content:
--------------------------
# Check if ImageMagick is installed
if (!(Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "ImageMagick not found. Install it first:" -ForegroundColor Red
    Write-Host "Run: choco install imagemagick" -ForegroundColor Yellow
    Write-Host "Or download from: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    exit 1
}

$source = "public/logo-source.png"
if (!(Test-Path $source)) {
    Write-Host "Source image not found: $source" -ForegroundColor Red
    Write-Host "Please place your 512x512 logo as public/logo-source.png" -ForegroundColor Yellow
    exit 1
}

Write-Host "Generating favicons..." -ForegroundColor Green

# Generate all sizes
magick $source -resize 16x16 public/favicon-16x16.png
magick $source -resize 32x32 public/favicon-32x32.png
magick $source -resize 32x32 public/favicon.ico
magick $source -resize 180x180 public/apple-touch-icon.png
magick $source -resize 192x192 public/android-chrome-192x192.png
magick $source -resize 512x512 public/android-chrome-512x512.png

Write-Host "✓ All favicons generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Cyan
Get-ChildItem public/favicon* | ForEach-Object { Write-Host "  - $($_.Name)" }
Get-ChildItem public/apple-touch-icon* | ForEach-Object { Write-Host "  - $($_.Name)" }
Get-ChildItem public/android-chrome* | ForEach-Object { Write-Host "  - $($_.Name)" }
*/

// Option 2: Use Online Tools
const onlineTools = {
  recommended: {
    name: "RealFaviconGenerator",
    url: "https://realfavicongenerator.net/",
    features: [
      "Generates all sizes automatically",
      "Preview on different platforms",
      "Customizable colors and styles",
      "Downloads ready-to-use package"
    ]
  },
  alternatives: [
    {
      name: "Favicon.io",
      url: "https://favicon.io/",
      note: "Simple, supports text to favicon"
    },
    {
      name: "Favicon Generator",
      url: "https://www.favicon-generator.org/",
      note: "Basic but effective"
    }
  ]
};

// Option 3: Node.js script using sharp (if you want to automate)
/*
npm install sharp

const sharp = require('sharp');
const fs = require('fs');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

async function generateFavicons() {
  const source = 'public/logo-source.png';
  
  if (!fs.existsSync(source)) {
    console.error('Source image not found: public/logo-source.png');
    return;
  }

  for (const { name, size } of sizes) {
    await sharp(source)
      .resize(size, size)
      .png()
      .toFile(`public/${name}`);
    console.log(`✓ Generated ${name}`);
  }

  // Generate ICO
  await sharp(source)
    .resize(32, 32)
    .toFile('public/favicon.ico');
  console.log('✓ Generated favicon.ico');
  
  console.log('\n✓ All favicons generated successfully!');
}

generateFavicons();
*/

console.log('See public/README-FAVICONS.md for detailed instructions');

module.exports = { onlineTools };
