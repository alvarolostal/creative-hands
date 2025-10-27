import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

async function generate() {
  const publicDir = path.resolve('./client/public');
  const svgPath = path.join(publicDir, 'favicon.svg');
  const iconsDir = path.join(publicDir, 'icons');

  await fs.mkdir(iconsDir, { recursive: true });

  const sizes = [16, 32, 48, 64, 128, 192, 256, 512];
  for (const size of sizes) {
    const out = path.join(iconsDir, `icon-${size}.png`);
    await sharp(svgPath).resize(size, size).png().toFile(out);
    console.log('Wrote', out);
  }

  // Apple touch icon (180x180)
  const appleOut = path.join(iconsDir, 'apple-touch-icon.png');
  await sharp(svgPath).resize(180, 180).png().toFile(appleOut);
  console.log('Wrote', appleOut);

  // Create favicon.ico from 16/32/48
  const icoBuffer = await pngToIco([
    path.join(iconsDir, 'icon-16.png'),
    path.join(iconsDir, 'icon-32.png'),
    path.join(iconsDir, 'icon-48.png')
  ]);

  await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Wrote', path.join(publicDir, 'favicon.ico'));
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
