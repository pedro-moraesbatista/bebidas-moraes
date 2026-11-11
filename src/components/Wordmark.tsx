import { siteConfig } from '../data/siteConfig'

export default function Wordmark() {
  const [firstWord, ...restWords] = siteConfig.brand.name.split(' ')
  return (
    <span className="font-headline-sm text-headline-sm leading-none tracking-tight whitespace-nowrap">
      <span className="font-semibold text-ink">{firstWord}</span>{' '}
      <span className="font-extrabold text-primary">{restWords.join(' ')}</span>
    </span>
  )
}
