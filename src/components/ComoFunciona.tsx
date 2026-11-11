import Icon, { type IconName } from './Icon'

const steps: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'bottle', title: '1. Escolha suas bebidas', text: 'Navegue pelo catálogo e adicione itens ao carrinho.' },
  { icon: 'cart', title: '2. Monte seu pedido', text: 'Confira quantidades e valores automáticos.' },
  { icon: 'whatsapp', title: '3. Envie no WhatsApp', text: 'Finalize no chat e combine pagamento e entrega.' },
]

export default function ComoFunciona() {
  return (
    <section className="px-margin my-6" id="como-funciona">
      <div className="flex flex-col gap-space-md">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-ink">Peça em 3 passos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          {steps.map((step) => (
            <div key={step.title} className="p-space-md rounded-xl bg-surface-alt flex flex-col gap-2">
              <span className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-primary">
                <Icon name={step.icon} size={22} />
              </span>
              <h3 className="font-headline-sm text-headline-sm text-ink">{step.title}</h3>
              <p className="font-body-sm text-body-sm text-ink-soft">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
