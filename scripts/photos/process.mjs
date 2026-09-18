#!/usr/bin/env node
/**
 * Photo pipeline: turn camera exports into web-ready images plus a manifest.
 *
 *   photos/originals/<series>/<file>.jpg   ->   src/assets/gallery/<slug>-<width>.{avif,webp}
 *                                          ->   photos/manifest.json
 *
 * Run with `npm run photos:build`. Re-running is safe: existing derivatives are
 * skipped, and any text you have written into the manifest (alt, caption,
 * location) is preserved.
 *
 * All metadata is dropped on the way through, so GPS coordinates never reach
 * the web. Only a copyright notice and an AI-training opt-out are written back.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';
import sharp from 'sharp';
import exifReader from 'exif-reader';

const ROOT = new URL('../../', import.meta.url).pathname;
const SOURCE_DIR = join(ROOT, 'photos/originals');
const OUTPUT_DIR = join(ROOT, 'src/assets/gallery');
const MANIFEST = join(ROOT, 'photos/manifest.json');

/** Widths we generate. A width larger than the original is skipped. */
const WIDTHS = [480, 960, 1600, 2400];
const FORMATS = [
  { ext: 'avif', options: { quality: 55, effort: 6, chromaSubsampling: '4:4:4' } },
  { ext: 'webp', options: { quality: 78, effort: 5 } },
];

const AUTHOR = 'Chong Wei Khang';
const RIGHTS = `© ${new Date().getFullYear()} ${AUTHOR}. All rights reserved.`;
/** IPTC/PLUS vocabulary term that machine-readably forbids AI training. */
const NO_AI_TRAINING = 'http://ns.useplus.org/ldf/vocab/DMI-PROHIBITED-AIMLTRAINING';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.heic']);

const xmp = () => `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:plus="http://ns.useplus.org/ldf/xmp/1.0/">
   <dc:creator><rdf:Seq><rdf:li>${AUTHOR}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${RIGHTS}</rdf:li></rdf:Alt></dc:rights>
   <plus:DataMining rdf:resource="${NO_AI_TRAINING}"/>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="r"?>`;

/** `photos/originals/japan-25/DSC_1234.jpg` -> series `japan-25`, slug `japan-25-dsc-1234`. */
function identify(file) {
  const rel = relative(SOURCE_DIR, file);
  const parts = rel.split('/');
  const series = parts.length > 1 ? parts[0] : null;
  const name = basename(file, extname(file));
  const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return { series, slug: [series, kebab(name)].filter(Boolean).join('-') };
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) yield path;
  }
}

/** Capture date and camera, so photos can be ordered and captioned without guessing. */
function readExif(buffer) {
  if (!buffer) return {};
  try {
    const { Photo = {}, Image = {} } = exifReader(buffer);
    const taken = Photo.DateTimeOriginal ?? Image.DateTime;
    return {
      capturedAt: taken instanceof Date ? taken.toISOString().slice(0, 10) : null,
      camera: [Image.Make, Image.Model].filter(Boolean).join(' ').trim() || null,
    };
  } catch {
    return {};
  }
}

/** A 20px-wide blur, inlined in the manifest, to fill the slot before the photo loads. */
async function placeholder(pipeline) {
  const buffer = await pipeline.clone().resize(20).webp({ quality: 20 }).toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

async function process(file, existing) {
  const { series, slug } = identify(file);
  const input = await readFile(file);
  const digest = createHash('sha256').update(input).digest('hex').slice(0, 12);
  const image = sharp(input, { failOn: 'error' }).rotate();
  const { width, height, exif } = await image.metadata();

  // Never upscale: if the original is smaller than every target, keep its own width.
  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.length) widths.push(width);

  const sizes = [];
  for (const target of widths) {
    const resized = image.clone().resize({ width: target, withoutEnlargement: true });
    for (const { ext, options } of FORMATS) {
      const name = `${slug}-${target}.${ext}`;
      const out = join(OUTPUT_DIR, name);
      if (!existsSync(out)) {
        // Lightroom often exports Adobe RGB or Display P3; converting to sRGB keeps
        // browser colours true to the edit instead of washing them out.
        await resized.clone()[ext](options).withIccProfile('srgb').withXmp(xmp()).toFile(out);
      }
      if (ext === FORMATS[0].ext) sizes.push({ width: target, bytes: (await stat(out)).size });
    }
  }

  return {
    // Anything the owner writes by hand survives a re-run.
    alt: '',
    caption: '',
    location: '',
    ...existing,
    slug,
    series,
    source: relative(ROOT, file),
    digest,
    width,
    height,
    aspect: Number((width / height).toFixed(4)),
    widths: sizes.map((s) => s.width),
    blur: existing?.blur ?? (await placeholder(image)),
    ...readExif(exif),
  };
}

const previous = existsSync(MANIFEST)
  ? Object.fromEntries(JSON.parse(await readFile(MANIFEST, 'utf8')).photos.map((p) => [p.slug, p]))
  : {};

await mkdir(OUTPUT_DIR, { recursive: true });
const photos = [];
for await (const file of walk(SOURCE_DIR)) {
  const { slug } = identify(file);
  const photo = await process(file, previous[slug]);
  photos.push(photo);
  const kb = (n) => `${Math.round(n / 1024)} kB`;
  const largest = join(OUTPUT_DIR, `${photo.slug}-${photo.widths.at(-1)}.avif`);
  console.log(
    `${photo.slug.padEnd(28)} ${photo.width}×${photo.height} -> ` +
      `${photo.widths.join('/')} (${kb((await stat(largest)).size)} at ${photo.widths.at(-1)}w)` +
      (photo.alt ? '' : '  [needs alt text]')
  );
}

photos.sort((a, b) => (b.capturedAt ?? '').localeCompare(a.capturedAt ?? '') || a.slug.localeCompare(b.slug));
await writeFile(MANIFEST, JSON.stringify({ generated: new Date().toISOString(), photos }, null, 2) + '\n');

const missing = photos.filter((p) => !p.alt).length;
console.log(`\n${photos.length} photos -> ${relative(ROOT, MANIFEST)}`);
if (missing) console.log(`${missing} still need alt text. Fill in "alt" and "caption" in the manifest.`);
