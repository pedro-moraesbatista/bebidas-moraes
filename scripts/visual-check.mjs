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

async function gotoPage(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('main h1', { timeout: 15000 })
  const overlay = page.locator('#opening-overlay')
  if ((await overlay.count()) > 0) {
    await overlay.click({ timeout: 2000 }).catch(() => {})
  }
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

// ---------- Per-viewport: screenshots + checks ----------
for (const viewport of VIEWPORTS) {
  const { context, page } = await newPage(viewport)
  await gotoPage(page)
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

  const identity = await page.evaluate(() => {
    const get = (sel) => document.querySelector(sel)
    const bgOf = (el) => (el ? getComputedStyle(el).backgroundColor : null)
    const fontOf = (el) => (el ? getComputedStyle(el).fontFamily : null)
    return {
      bodyBg: bgOf(document.body),
      h1Text: get('h1')?.innerText.replace(/\s+/g, ' ').trim(),
      h1Font: fontOf(get('h1')),
      ctaExploreBg: bgOf(get('#hero a[href="#catalogo"]')),
      whatsappCtaBg: bgOf(get('#hero a[href*="wa.me"]')),
    }
  })
  record('corpo com bg surface #FFFFFF', identity.bodyBg === 'rgb(255, 255, 255)', identity.bodyBg)
  record('h1 com copy da Bebidas Moraes', (identity.h1Text || '').includes('AS MELHORES BEBIDAS'), identity.h1Text)
  record('h1 usa Hanken Grotesk', (identity.h1Font || '').includes('Hanken Grotesk'), identity.h1Font)
  record('CTA Explorar catálogo com bg-primary #A71930', identity.ctaExploreBg === 'rgb(167, 25, 48)', identity.ctaExploreBg)
  record('CTA WhatsApp com bg-whatsapp #1DA851', identity.whatsappCtaBg === 'rgb(29, 168, 81)', identity.whatsappCtaBg)

  const textFidelity = await page.evaluate(() => {
    const text = document.body.innerText
    const required = [
      'Bebidas Moraes',
      'Seu depósito de bebidas, agora online.',
      'Catálogo digital com pedido pelo WhatsApp',
      'AS MELHORES BEBIDAS',
      'A UM CLIQUE DE VOCÊ',
      'Encontre suas marcas favoritas, confira os preços e monte seu pedido sem complicação.',
      'Explorar catálogo',
      'Fazer pedido pelo WhatsApp',
      'Entrega no mesmo dia',
      'Compra segura +18',
      '8h às 22h',
      'PROMOÇÃO DA SEMANA',
      'Combo Churrasco',
      'Adicionar combo',
      'Peça em 3 passos',
      'Nosso catálogo',
      '24 produtos',
      'Todas',
      'Cervejas',
      'Destilados',
      'Refrigerantes',
      'Energéticos',
      'Águas',
      'Combos que valem a pena',
      'Receba no mesmo dia',
      'Pedidos pelo WhatsApp',
      '(83) 99846-1353',
      'Chamar no WhatsApp',
      'Venda proibida para menores de 18 anos',
      'Quer um catálogo como este para sua empresa?',
      'Uma solução desenvolvida pela Moraes Tecnologia.',
      'Preços demonstrativos',
    ]
    const missing = required.filter((r) => !text.toLowerCase().includes(r.toLowerCase()))
    if (document.querySelector('#catalogo input')?.getAttribute('placeholder') !== 'Buscar produto ou marca') {
      missing.push('placeholder "Buscar produto ou marca"')
    }
    return missing
  })
  record('todos os textos-chave da Bebidas Moraes presentes', textFidelity.length === 0, `faltando: ${textFidelity.join(' | ')}`)

  const catalog = await page.evaluate(() => ({
    products: document.querySelectorAll('#catalogo img').length,
    adicionarButtons: [...document.querySelectorAll('#catalogo button')].filter((button) =>
      button.textContent.trim() === 'Adicionar',
    ).length,
  }))
  record('catálogo com 24 imagens de produto', catalog.products === 24, `${catalog.products} imgs no grid`)
  record('catálogo com 24 botões Adicionar', catalog.adicionarButtons === 24, `${catalog.adicionarButtons} botões`)

  await context.close()
}

// ---------- Cart flow E2E (mobile) ----------
{
  const { context, page } = await newPage(VIEWPORTS[0])
  await gotoPage(page)

  const addFirst = page.locator('#catalogo button', { hasText: 'Adicionar' }).first()
  await addFirst.scrollIntoViewIfNeeded()
  await addFirst.click()
  await page.waitForTimeout(400)
  const toastText = await page.evaluate(() => document.body.innerText.includes('Adicionado: Heineken'))
  record('toast ao adicionar produto em destaque', toastText)

  await page.evaluate(() => localStorage.clear())
  await gotoPage(page)

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
      hasTitle: text.includes('Seu pedido'),
      subtotal: text.includes('R$ 6,19'),
      fee: text.includes('R$ 8,00'),
      total: text.includes('R$ 14,19'),
      hasInputs: Boolean(document.querySelector('#cart-customer-name, input[type="text"]')),
      hasNameInput: text.toLowerCase().includes('seu nome'),
      hasAddressInput: text.toLowerCase().includes('endereço de entrega'),
    }
  })
  record('drawer abre com título Seu pedido', drawer.hasTitle)
  record('subtotal/taxa/total corretos (6,19 + 8,00 = 14,19)', drawer.subtotal && drawer.fee && drawer.total)
  record('inputs de nome/endereço presentes', drawer.hasInputs && drawer.hasNameInput && drawer.hasAddressInput)

  const waLinks = await page.evaluate(() => [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href))
  record(
    'links WhatsApp com número do cliente',
    waLinks.length > 0 && waLinks.every((h) => h.includes('wa.me/5583998461353?')),
    `${waLinks.length} links, ex: ${waLinks[0]?.slice(0, 55)}`,
  )
  await context.close()
}

// ---------- Reduced motion ----------
{
  const { context, page } = await newPage(VIEWPORTS[0], 'reduce')
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('main h1', { timeout: 15000 })
  await page.waitForTimeout(400)
  const floatDisabled = await page.evaluate(() => {
    const floatEl = document.querySelector('.animate-float')
    if (!floatEl) return false
    return parseFloat(getComputedStyle(floatEl).animationDuration) < 0.1
  })
  record('prefers-reduced-motion: animação de flutuação desativada', floatDisabled)
  await context.close()
}

// ---------- Overlay de abertura ----------
{
  const { context, page } = await newPage(VIEWPORTS[0])
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  const appeared = await page
    .waitForSelector('#opening-overlay', { state: 'visible', timeout: 3000 })
    .then(() => true, () => false)
  await page.waitForTimeout(2300)
  const gone = (await page.locator('#opening-overlay').count()) === 0
  record(
    'overlay de abertura aparece na carga e sai do DOM em ~2.2s',
    appeared && gone,
    `apareceu=${appeared} saiu=${gone}`,
  )
  await context.close()
}

// ---------- Catálogo: imagens em canvas quadrado ----------
{
  const { context, page } = await newPage(VIEWPORTS[0])
  await gotoPage(page)
  await scrollThrough(page)
  await waitForImages(page, { timeout: 4000 })
  const dims = await page.evaluate(() =>
    [...document.querySelectorAll('#catalogo img')].map((img) => [img.naturalWidth, img.naturalHeight]),
  )
  const nonSquare = dims.filter(([w, h]) => w !== h)
  record(
    'imagens do catálogo em canvas quadrado',
    dims.length === 24 && nonSquare.length === 0,
    `${dims.length} imgs no grid, ${nonSquare.length} fora de 1:1`,
  )
  await context.close()
}

// ---------- Status da loja via clock do Playwright ----------
{
  const { context, page } = await newPage(VIEWPORTS[2])
  await page.clock.install({ time: new Date('2026-11-11T23:00:00-03:00') })
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('main h1', { timeout: 15000 })
  const closed = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      pill: text.includes('Fechado agora') && text.includes('Abrimos amanhã às 8h'),
      banner: text.includes('Estamos fechados agora') && text.includes('Monte seu pedido no catálogo'),
    }
  })
  await context.close()

  const { context: openContext, page: openPage } = await newPage(VIEWPORTS[2])
  await openPage.clock.install({ time: new Date('2026-11-11T10:00:00-03:00') })
  await openPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await openPage.waitForSelector('main h1', { timeout: 15000 })
  const open = await openPage.evaluate(() => {
    const text = document.body.innerText
    return {
      pill: text.includes('Aberto agora') && text.includes('até as 22h'),
      noBanner: !text.includes('Estamos fechados agora'),
    }
  })
  await openContext.close()

  record(
    'status da loja reflete horário real (clock: 23h fechada com banner, 10h aberta)',
    closed.pill && closed.banner && open.pill && open.noBanner,
    `23h pill=${closed.pill} banner=${closed.banner} | 10h pill=${open.pill} sem-banner=${open.noBanner}`,
  )
}

await browser.close()

const failed = CHECKS.filter((c) => !c.pass)
writeFileSync(REPORT_PATH, JSON.stringify({ base: BASE_URL, total: CHECKS.length, failed: failed.length, checks: CHECKS }, null, 2))
console.log(`\n=== ${CHECKS.length - failed.length}/${CHECKS.length} checks passaram ===`)
process.exit(failed.length === 0 ? 0 : 1)
