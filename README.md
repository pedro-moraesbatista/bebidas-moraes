# devBeer — Landing Page 🍻

Landing page do **devBeer**, depósito artesanal de bebidas de Springfield. Implementação fiel do design aprovado no **Google Stitch** (projeto *"devBeer Landing Page"*, ID `7945143848793903505`), transformado em uma aplicação React funcional, responsiva e com experiência comercial completa.

> ⚠️ Projeto tributo/conceitual inspirado na cultura pop (Duff, Springfield). Nenhum item é estoque real e nenhum dado comercial definitivo está configurado — ver [Configuração comercial](#configuração-comercial).

## Links

- **Produção:** https://devbeer-landing.vercel.app
- **Repositório:** https://github.com/pedro-moraesbatista/devbeer-landing
- **Design (fonte de verdade visual):** projeto no Stitch + referências em [`design/`](design/) (HTML exportado, screenshots e assets originais)

## Funcionalidades

- **Splash cinematográfico** com a animação do brinde dos copos: entrada em direções opostas, encontro, impacto, respingos/espuma e badge "CLINK!" — reproduzida na abertura e re-executável (clique no banner do hero ou botão "Rever Brinde")
- **Hero** com badge, banner animado dos copos, catchphrase e CTAs
- **Combo em destaque** ("Destaque do Moe") com preço promocional
- **Catálogo data-driven** com 8 produtos e filtros por categoria (pills)
- **Combos** da rodada em formato bento
- **Seção de delivery** (cobertura, horário, tempo estimado, frete grátis)
- **Carrinho completo**: adicionar/remover/alterar quantidades, subtotal, taxa de entrega (grátis acima de R$ 80), total, persistência em `localStorage` e drawer lateral
- **Pedido via WhatsApp**: mensagem formatada com itens, quantidades, valores e total
- **Botão flutuante de atendimento** e nav inferior funcional
- Animações respeitando `prefers-reduced-motion`, layout sem overflow horizontal de 320px a desktop

## Stack

- [React 19](https://react.dev/) + [TypeScript 7](https://www.typescriptlang.org/) (strict)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) com design tokens do Stitch declarados em `src/index.css` (`@theme`)
- Testes: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) (60 testes) · screenshots/checagens com [Playwright](https://playwright.dev/)
- Fontes: Bricolage Grotesque, Hanken Grotesk, Space Grotesk + Material Symbols (Google Fonts)

## Desenvolvimento

```bash
npm install        # dependências
npm run dev        # dev server
npm run build      # build de produção (tsc + vite)
npm run preview    # servir o build
npm run test:run   # testes unitários (Vitest)
npm run lint       # lint (oxlint)
```

Scripts auxiliares:

```bash
npm run optimize:images   # regenera public/assets/*.webp a partir de design/assets (sharp)
node scripts/visual-check.mjs   # screenshots (desktop/tablet/mobile) + 25 checagens de fidelidade, via vite preview
```

Screenshots da implementação ficam em [`docs/screenshots/`](docs/screenshots/).

## Estrutura

```
design/               # fonte de verdade visual extraída do Stitch (HTML, screenshots, assets brutos)
public/assets/        # imagens otimizadas em produção (.webp)
src/components/       # seções da landing (Header, SplashOverlay, Hero, Catalog, CartDrawer, ...)
src/data/products.ts  # catálogo data-driven: produtos, categorias, combos
src/data/siteConfig.ts# configuração comercial centralizada (WhatsApp, entrega, avisos legais)
src/lib/              # carrinho (Context), formatação BRL, geração de mensagem/link WhatsApp
scripts/              # otimização de imagens e validação visual (Playwright)
docs/                 # screenshots e relatório de validação
```

## Configuração comercial

Tudo que é dado comercial vive centralizado — nada hardcoded em componentes:

| O quê | Onde | Situação |
|---|---|---|
| Número do WhatsApp | `src/data/siteConfig.ts` → `whatsapp.number` | ⚠️ **Placeholder** (`5511999999999`) — substituir pelo número real |
| Preços e produtos | `src/data/products.ts` | Conceituais (tributo) — configurar com o catálogo real |
| Taxa de entrega / frete grátis | `siteConfig.delivery` | R$ 8,00 / grátis acima de R$ 80 (valores do design) |
| Endereço / raio / horários | `siteConfig.delivery` | Textos do design — ajustar para o negócio real |

## Desvios intencionais do design (documentados)

- Badge do carrinho dinâmico (era "3" estático) e thumbs com a imagem real do produto no drawer
- Menu lateral e nav inferior funcional (eram botões/links mortos no design) — sem mudanças visuais, tokens do próprio design
- Filtro "Combos" exibe os 3 combos (no design o filtro resultava em grid vazio)
- Imagens reencodadas em WebP (fidelidade visual mantida, 2MB → ~370KB)
- Ano do rodapé dinâmico; textos comerciais ("RESTAM 7 CRATES", "GRÁTIS acima de R$80") vindos de configuração/dados

## Testes

60 testes (7 suítes) cobrem: carrinho (operações, frete, persistência, storage corrompido), catálogo (filtros, contadores, imagens locais), drawer (fluxo, resumo financeiro, dispatch WhatsApp com URL validada), splash (timers, Pular, reduced-motion, remount), modais (ESC, foco), formatação BRL e mensagem do WhatsApp.
