# Bebidas Moraes — Catálogo Digital

Landing page do **Bebidas Moraes**, depósito de bebidas com catálogo digital e pedidos via WhatsApp. Implementação React funcional, responsiva e com experiência comercial completa — uma demonstração da **Moraes Tecnologia** de como qualquer distribuidora pode vender online.

> ℹ️ Produtos e preços são **demonstrativos**, com referências públicas de varejo (Carrefour/Extra Mercado). As imagens vêm de CDNs públicos de varejo para fins de demonstração — em uso real, substitua pelas fotos oficiais do cliente em `public/assets-src/`.

## Links

- **Produção:** https://devbeer-landing.vercel.app
- **Repositório:** https://github.com/pedro-moraesbatista/devbeer-landing
- **WhatsApp da loja:** (83) 99846-1353

## Funcionalidades

- **Hero** com badge "Catálogo digital com pedido pelo WhatsApp", CTAs para o catálogo e para o WhatsApp, e selos de confiança (entrega no mesmo dia, compra segura +18, 8h às 22h)
- **Combo em destaque** ("Promoção da semana") com colagem 2x2 dos itens, preço riscado e botão de adicionar
- **Como funciona** — pedido em 3 passos (escolher bebidas, montar pedido, enviar no WhatsApp)
- **Catálogo data-driven** com 24 produtos reais, busca por nome/marca (normalizada), filtros por categoria (pills) e ordenação (relevância, menor/maior preço, A–Z)
- **Combos** em grid com colagem das imagens dos itens e pill "COMBO"
- **Seção de entrega** (mesmo dia, horário 8h–22h todos os dias, cobertura, pagamento na entrega)
- **Carrinho completo**: adicionar/remover/alterar quantidades, subtotal, taxa de entrega (grátis acima de R$ 80), total, persistência em `localStorage` e drawer lateral
- **Pedido via WhatsApp**: mensagem formatada com itens, quantidades, valores, subtotal, taxa e total
- **Botão flutuante de WhatsApp** e nav inferior funcional (Início, Busca, Combos, Pedido, WhatsApp)
- Ícones em SVG inline (`src/components/Icon.tsx`, sem fonte de ícones externa), animações respeitando `prefers-reduced-motion`, layout sem overflow horizontal de 320px a desktop

## Stack

- [React 19](https://react.dev/) + [TypeScript 7](https://www.typescriptlang.org/) (strict)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) com design tokens declarados em `src/index.css` (`@theme`)
- Testes: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) · screenshots/checagens com [Playwright](https://playwright.dev/)
- Fonte: Hanken Grotesk (Google Fonts)

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
npm run optimize:images    # regenera public/assets/*.webp a partir de public/assets-src (sharp)
node scripts/visual-check.mjs   # screenshots (desktop/tablet/mobile) + checagens visuais, via vite preview
```

Screenshots da implementação ficam em [`docs/screenshots/`](docs/screenshots/) e o relatório em `docs/visual-report.json`.

## Estrutura

```
public/assets/         # imagens otimizadas em produção (.webp) — origem em public/assets-src
src/components/       # seções da landing (Header, Hero, ComboHighlight, ComoFunciona, Catalog, CartDrawer, ...)
src/data/products.ts  # catálogo data-driven: 24 produtos, 4 combos, categorias
src/data/siteConfig.ts# configuração comercial centralizada (WhatsApp, entrega, avisos legais, Moraes)
src/lib/              # carrinho (Context), formatação BRL, geração de mensagem/link WhatsApp
scripts/              # otimização de imagens e validação visual (Playwright)
docs/                 # screenshots e relatório de validação
```

## Configuração comercial

Tudo que é dado comercial vive centralizado — nada hardcoded em componentes:

| O quê | Onde | Situação |
|---|---|---|
| Número do WhatsApp | `src/data/siteConfig.ts` → `whatsapp.number` | (83) 99846-1353 (fornecido pelo cliente) |
| Canal comercial Moraes | `siteConfig.moraes.whatsapp` | ⚠️ **Placeholder** — substituir pelo canal dedicado |
| Produtos e preços | `src/data/products.ts` | Demonstrativos (referência pública de varejo) — ajustar com o catálogo real |
| Taxa de entrega / frete grátis | `siteConfig.delivery` | R$ 8,00 / grátis acima de R$ 80 |
| Horário / cobertura | `siteConfig.delivery` | 8h às 22h, todos os dias; cidade e região |
| Imagens de produto | `public/assets/` | CDNs públicos de varejo (demonstração) — substituir pelas fotos oficiais do cliente |

## Moraes Tecnologia

"Quer um catálogo como este para sua empresa?" — o CTA do rodapé (e o número `siteConfig.moraes.whatsapp`) é o canal comercial da Moraes Tecnologia para replicar esta solução em outros negócios. Configure o número dedicado antes de publicar.

## Testes

Suíte Vitest cobre: carrinho (operações, frete grátis, persistência, storage corrompido, combos com imagem resolvida), catálogo (busca, filtros por categoria, ordenação, contador, imagens locais, estado vazio), drawer (fluxo, resumo financeiro, dispatch do WhatsApp com URL validada), modais (ESC, foco, inert), formatação BRL e mensagem do pedido no WhatsApp. Rode com `npm run test:run`.
