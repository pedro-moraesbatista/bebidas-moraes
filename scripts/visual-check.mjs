import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT_DIR = 'docs/screenshots'
const REPORT_PATH = 'docs/visual-report.json'

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 },
]

const CHECKS = []
function record(name, pass, detail = '') {
  CHECKS.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? ` (${detail})` : ''}`)
}

mkdirSync(OUT_DIR, { recursive: true })
const browser = await chromium.launch()

async function newPage(viewport, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, reducedMotion, deviceScaleFactor: 2 })
  const page = await context.newPage()
  return { context, page }
}

async function skipSplash(page) {
  const splash = page.locator('#splash-screen')
  if ((await splash.count()) === 0) return
  const skip = page.locator('#splash-screen button', { hasText: 'Pular' })
  await skip.click({ timeout: 1500 }).catch(() => {})
  await splash.waitFor({ state: 'detached', timeout: 6000 }).catch(() => {})
}

async function gotoPage(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('main h1', { timeout: 15000 })
  await waitForImages(page, { lazy: false })
}

async function waitForImages(page, { lazy = true, timeout = 5000 } = {}) {
  await page.evaluate(
    ({ lazy, timeout }) => {
      const pending = [...document.images]
        .filter((img) => (lazy ? true : img.getAttribute('loading') !== 'lazy'))
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve
        }))
      return Promise.race([Promise.all(pending), new Promise((resolve) => setTimeout(resolve, timeout))])
    },
    { lazy, timeout },
  )
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
  })
}

// ---------- Splash animation capture (mobile) ----------
{
  const { context, page } = await newPage(VIEWPORTS[0])
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#splash-screen', { timeout: 10000 })
  await page.waitForTimeout(950)
  const splashVisible = await page.locator('#splash-screen').isVisible()
  await page.screenshot({ path: `${OUT_DIR}/splash-animation.png` })
  record('splash visível na carga', splashVisible)
  await skipSplash(page)
  const gone = await page.locator('#splash-screen').count() === 0
  record('splash fecha via botão Pular', gone)
  await context.close()
}

// ---------- Per-viewport: screenshots + checks ----------
for (const viewport of VIEWPORTS) {
  const { context, page } = await newPage(viewport)
  await gotoPage(page)
  await skipSplash(page)
  await page.waitForTimeout(600)
  await scrollThrough(page)
  await waitForImages(page, { timeout: 4000 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)

  await page.screenshot({ path: `${OUT_DIR}/${viewport.name}-viewport.png`, fullPage: false })
  await page.screenshot({ path: `${OUT_DIR}/${viewport.name}-full.png`, fullPage: true })

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowing: [...document.querySelectorAll('*')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.right > doc.clientWidth + 1 && getComputedStyle(el).position !== 'fixed'
      }).slice(0, 3).map((el) => el.tagName + '.' + String(el.className).slice(0, 40)),
    }
  })
  record(
    `${viewport.name}: sem overflow horizontal`,
    overflow.scrollWidth <= overflow.clientWidth,
    `scroll=${overflow.scrollWidth} client=${overflow.clientWidth} ${overflow.overflowing.join(',')}`,
  )

  const images = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((img) => img.offsetParent !== null || img.getClientRects().length > 0)
      .map((img) => ({ src: img.getAttribute('src'), ok: img.naturalWidth > 0 })),
  )
  const broken = images.filter((i) => !i.ok)
  record(`${viewport.name}: imagens carregadas`, broken.length === 0, `${images.length} imgs, ${broken.length} quebradas`)
  const remote = images.filter((i) => i.src && i.src.includes('googleusercontent'))
  record(`${viewport.name}: sem imagens remotas`, remote.length === 0)
  await context.close()
}

// ---------- Visual identity checks (desktop) ----------
{
  const { context, page } = await newPage(VIEWPORTS[2])
  await gotoPage(page)
  await skipSplash(page)

  const identity = await page.evaluate(() => {
    const get = (sel) => document.querySelector(sel)
    const bgOf = (el) => (el ? getComputedStyle(el).backgroundColor : null)
    const fontOf = (el) => (el ? getComputedStyle(el).fontFamily : null)
    return {
      bodyBg: bgOf(document.body),
      h1Text: get('h1')?.innerText.replace(/\s+/g, ' ').trim(),
      h1Font: fontOf(get('h1')),
      ctaExploreBg: bgOf(get('#hero a[href="#catalogo"]')),
      clinkBg: bgOf(get('#splash-effect')),
      pillsCount: document.querySelectorAll('.category-btn, [data-testid]').length,
      catalogBadges: document.querySelectorAll('#catalogo img').length,
      footerText: get('footer')?.innerText.slice(0, 80),
    }
  })
  record('corpo com bg do design #fcf9f8', identity.bodyBg === 'rgb(252, 249, 248)', identity.bodyBg)
  record('h1 com texto fiel', identity.h1Text === 'SE A VIDA TE DER LIMÕES, PEÇA UMA DUFF!', identity.h1Text)
  record('h1 usa Bricolage Grotesque', (identity.h1Font || '').includes('Bricolage Grotesque'), identity.h1Font)
  record(
    'CTA Explorar com bg-primary-container #d92727',
    identity.ctaExploreBg === 'rgb(217, 39, 39)',
    identity.ctaExploreBg,
  )
  record('splash-effect presente no hero', Boolean(identity.clinkBg))

  const textFidelity = await page.evaluate(() => {
    const text = document.body.innerText
    const required = [
      'O Sabor Lendário de Springfield',
      'CLINK!',
      'Rever Brinde de Abertura',
      'Explorar Bebidas',
      'Pedir no WhatsApp',
      'Venda proibida para menores de 18 anos',
      'DESTAQUE DO MOE',
      'RESTAM 7 CRATES',
      'Combo Duff & Craft Experience',
      'Cardápio do Depósito',
      '8 ITENS DISPONÍVEIS',
      'Duff Beer Tributo Lata 350ml',
      'Duff Lite Springfield 355ml',
      'Duff Dry Extra Malte 500ml',
      'Fudd Beer Dark Ale Taverna',
      'Chopp Dev IPA Growler 1L',
      'Flaming Moe Cocktail Mix',
      'Buzz Cola Lata Vintage 350ml',
      'Red Homer Energy 473ml',
      'Cervejas & Latas',
      'Artesanais & Growlers',
      'Refris & Não Alcoólicos',
      'Nota de Tributo',
      'Mais Economia',
      'Combos da Rodada',
      'Combo Happy Hour da Taverna',
      'Combo Churrasco Springfield',
      'MATOU A SEDE? CHAMA A DEVBEER!',
      'Central de Pedidos WhatsApp',
      'Seu Engradado',
    ]
    return required.filter((r) => !text.toLowerCase().includes(r.toLowerCase()))
  })
  record('todos os 30 textos-chave do design presentes', textFidelity.length === 0, `faltando: ${textFidelity.join(' | ')}`)

  const catalog = await page.evaluate(() => {
    const grid = document.querySelector('#product-grid') ?? document.querySelector('#catalogo')
    return {
      products: grid ? grid.querySelectorAll('img').length : 0,
      pills: document.querySelectorAll('button').length,
    }
  })
  record('catálogo com 8 imagens de produto', catalog.products === 8, `${catalog.products} imgs no grid`)

  await context.close()
}

// ---------- Cart flow E2E (mobile) ----------
{
  const { context, page } = await newPage(VIEWPORTS[0])
  await gotoPage(page)
  await skipSplash(page)

  const addFirst = page.locator('#catalogo button', { hasText: 'Adicionar' }).first()
  await addFirst.scrollIntoViewIfNeeded()
  await addFirst.click()
  await page.waitForTimeout(400)
  const toastText = await page.evaluate(() => document.body.innerText.includes('Adicionado:'))
  record('toast ao adicionar produto', toastText)

  await page.evaluate(() => localStorage.clear())
  await gotoPage(page)
  await skipSplash(page)

  await addFirst.scrollIntoViewIfNeeded()
  await addFirst.click()

  const cartBtn = page.locator('header button[aria-label="Abrir carrinho"]')
  record('botão do carrinho presente no header', (await cartBtn.count()) > 0)
  await cartBtn.click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT_DIR}/cart-drawer-mobile.png` })

  const drawer = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      hasTitle: text.includes('Seu Engradado'),
      subtotal: text.includes('R$ 11,90'),
      fee: text.includes('R$ 8,00'),
      total: text.includes('R$ 19,90'),
      hasInputs: Boolean(document.querySelector('#cart-customer-name, input[type="text"]')),
      hasNameInput: text.toLowerCase().includes('nome de quem vai brindar'),
      hasAddressInput: text.toLowerCase().includes('endereço de entrega'),
    }
  })
  record('drawer abre com título', drawer.hasTitle)
  record('subtotal/taxa/total corretos (11,90 + 8,00 = 19,90)', drawer.subtotal && drawer.fee && drawer.total)
  record('inputs de nome/endereço presentes', drawer.hasInputs && drawer.hasNameInput && drawer.hasAddressInput)

  const waLinks = await page.evaluate(() => [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href))
  record(
    'links WhatsApp com número placeholder',
    waLinks.length > 0 && waLinks.every((h) => h.includes('wa.me/5511999999999?')),
    `${waLinks.length} links, ex: ${waLinks[0]?.slice(0, 55)}`,
  )
  await context.close()
}

// ---------- Reduced motion ----------
{
  const { context, page } = await newPage(VIEWPORTS[0], 'reduce')
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('main h1', { timeout: 15000 })
  await page.waitForTimeout(1200)
  const splashHidden = await page.evaluate(() => {
    const splash = document.querySelector('#splash-screen')
    if (!splash) return true
    const style = getComputedStyle(splash)
    return style.display === 'none' || !splash.checkVisibility()
  })
  record('prefers-reduced-motion: splash oculto', splashHidden)
  await context.close()
}

await browser.close()

const failed = CHECKS.filter((c) => !c.pass)
writeFileSync(REPORT_PATH, JSON.stringify({ base: BASE_URL, total: CHECKS.length, failed: failed.length, checks: CHECKS }, null, 2))
console.log(`\n=== ${CHECKS.length - failed.length}/${CHECKS.length} checks passaram ===`)
process.exit(failed.length === 0 ? 0 : 1)
