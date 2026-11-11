import { chromium } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = 'public/og.jpg'

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
})
const page = await context.newPage()
await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
await page.waitForSelector('#hero h1')
await page.evaluate(() =>
  Promise.race([
    Promise.all(
      [...document.images]
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve
        })),
    ),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]),
)
await page.evaluate(() => {
  document.querySelector('#hero')?.scrollIntoView({ block: 'start' })
})
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)
await page.screenshot({ path: OUT, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1200, height: 630 } })
await browser.close()
console.log(`og.jpg gerado em ${OUT}`)
