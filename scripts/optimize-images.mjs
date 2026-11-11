import { mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC_DIR = process.argv[2] ?? 'public/assets-src'
const OUT_DIR = 'public/assets'
const TARGET_WIDTH = 640
const QUALITY = 82

mkdirSync(OUT_DIR, { recursive: true })

const files = readdirSync(SRC_DIR).filter((file) => /\.(jpe?g|png)$/i.test(file))
for (const file of files) {
  const input = join(SRC_DIR, file)
  const name = file.replace(/\.(jpe?g|png)$/i, '')
  const output = join(OUT_DIR, `${name}.webp`)
  const info = await sharp(input)
    .resize({
      width: TARGET_WIDTH,
      height: TARGET_WIDTH,
      fit: 'contain',
      background: '#FFFFFF',
      withoutEnlargement: false,
    })
    .webp({ quality: QUALITY })
    .toFile(output)
  console.log(`${name}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`)
}
console.log(`\n${files.length} imagens otimizadas em ${OUT_DIR}`)
