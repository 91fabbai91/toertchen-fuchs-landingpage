import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { optimize } from 'svgo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ASSETS_DIR = path.join(rootDir, 'src', 'assets');
const PUBLIC_DIR = path.join(rootDir, 'public');

// Format file size nicely
function formatSize(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

// Convert raster images to WebP & AVIF if missing or outdated
async function processRasterImages() {
  if (!fs.existsSync(ASSETS_DIR)) return;

  const entries = fs.readdirSync(ASSETS_DIR);
  const rasterExts = ['.jpg', '.jpeg', '.png'];
  let processedCount = 0;
  let skippedCount = 0;

  for (const file of entries) {
    const ext = path.extname(file).toLowerCase();
    if (!rasterExts.includes(ext)) continue;

    const baseName = path.basename(file, path.extname(file));
    const srcPath = path.join(ASSETS_DIR, file);
    const srcStat = fs.statSync(srcPath);

    // Target formats: WebP and AVIF
    const targets = [
      { ext: '.webp', format: 'webp', options: { quality: 82, effort: 4 } },
      { ext: '.avif', format: 'avif', options: { quality: 72, effort: 4 } },
    ];

    for (const target of targets) {
      const destFile = `${baseName}${target.ext}`;
      const destPath = path.join(ASSETS_DIR, destFile);

      // Check if already available and newer than source
      if (fs.existsSync(destPath)) {
        const destStat = fs.statSync(destPath);
        if (destStat.mtimeMs >= srcStat.mtimeMs) {
          skippedCount++;
          continue;
        }
      }

      // Generate missing or outdated modern format
      try {
        let pipeline = sharp(srcPath);
        const metadata = await pipeline.metadata();

        // Downscale oversized background imagery (max width 1920 for web)
        if (metadata.width && metadata.width > 1920) {
          pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
        }

        if (target.format === 'webp') {
          pipeline = pipeline.webp(target.options);
        } else if (target.format === 'avif') {
          pipeline = pipeline.avif(target.options);
        }

        await pipeline.toFile(destPath);
        const newStat = fs.statSync(destPath);
        const savedPct = (
          ((srcStat.size - newStat.size) / srcStat.size) *
          100
        ).toFixed(1);

        console.log(
          `  ✓ [${target.format.toUpperCase()}] ${file} -> ${destFile} ` +
            `(${formatSize(srcStat.size)} -> ${formatSize(newStat.size)}, -${savedPct}%)`
        );
        processedCount++;
      } catch (err) {
        console.error(`  ✗ Error converting ${file} to ${target.format}:`, err);
      }
    }
  }

  return { processedCount, skippedCount };
}

// Optimize SVG vector graphics using SVGO
function processVectors() {
  const svgFiles = [
    path.join(ASSETS_DIR, 'Fuchs_farbig.svg'),
    path.join(PUBLIC_DIR, 'favicon.svg'),
  ];

  let optimizedCount = 0;

  for (const svgPath of svgFiles) {
    if (!fs.existsSync(svgPath)) continue;

    const originalContent = fs.readFileSync(svgPath, 'utf8');
    const result = optimize(originalContent, {
      multipass: true,
      plugins: ['preset-default'],
    });

    if (result.data && result.data.length < originalContent.length) {
      fs.writeFileSync(svgPath, result.data, 'utf8');
      const savedPct = (
        ((originalContent.length - result.data.length) /
          originalContent.length) *
        100
      ).toFixed(1);
      console.log(
        `  ✓ [SVGO] ${path.basename(svgPath)} (${formatSize(originalContent.length)} -> ${formatSize(result.data.length)}, -${savedPct}%)`
      );
      optimizedCount++;
    }
  }

  // Remove unused leftover public/icons.svg if present
  const unusedIcons = path.join(PUBLIC_DIR, 'icons.svg');
  if (fs.existsSync(unusedIcons)) {
    fs.unlinkSync(unusedIcons);
    console.log(`  ✓ [CLEAN] Removed unused icons.svg (saved ~5 KB)`);
  }

  return { optimizedCount };
}

async function main() {
  const startTime = Date.now();
  console.log(
    '[asset-optimizer] Checking and generating modern web formats...'
  );

  const rasterResult = await processRasterImages();
  const vectorResult = processVectors();

  const totalTime = Date.now() - startTime;
  if (rasterResult.processedCount === 0 && vectorResult.optimizedCount === 0) {
    console.log(
      `[asset-optimizer] All assets are up to date. (${rasterResult.skippedCount} skipped in ${totalTime}ms)`
    );
  } else {
    console.log(
      `[asset-optimizer] Optimization complete in ${totalTime}ms: ` +
        `${rasterResult.processedCount} raster images generated, ` +
        `${vectorResult.optimizedCount} vectors optimized, ` +
        `${rasterResult.skippedCount} up to date.`
    );
  }
}

main().catch((err) => {
  console.error('[asset-optimizer] Unexpected failure:', err);
  process.exit(1);
});
