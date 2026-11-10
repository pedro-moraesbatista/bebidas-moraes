import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE_DIR = 'design/assets'
const TARGET_DIR = 'public/assets'
const QUALITY = 82
const WIDE_IMAGE_WIDTH = 832
const WIDE_IMAGES = new Set(['duff-can.jpg', 'combo-crate.jpg'])
const SKIP = new Set(['logo.jpg'])

const sourceFiles = (await readdir(SOURCE_DIR)).filter((file) => file.endsWith('.jpg') && !SKIP.has(file))

await Promise.all(
  sourceFiles.map(async (file) => {
    const buffer = await readFile(path.join(SOURCE_DIR, file))
    const pipeline = WIDE_IMAGES.has(file) ? sharp(buffer).resize({ width: WIDE_IMAGE_WIDTH }) : sharp(buffer)
    const output = await pipeline.webp({ quality: QUALITY }).toBuffer()
    await writeFile(path.join(TARGET_DIR, file.replace(/\.jpg$/, '.webp')), output)
  }),
)

const results = await Promise.all(
  sourceFiles.map(async (file) => {
    const webp = file.replace(/\.jpg$/, '.webp')
    const source = await stat(path.join(SOURCE_DIR, file))
    const target = await stat(path.join(TARGET_DIR, webp))
    const width = WIDE_IMAGES.has(file) ? WIDE_IMAGE_WIDTH : (await sharp(path.join(TARGET_DIR, webp)).metadata()).width
    return `${webp} ${width}w: ${Math.round(source.size / 1024)}KB -> ${Math.round(target.size / 1024)}KB`
  }),
)

console.log(results.join('\n'))
