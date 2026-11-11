import { siteConfig } from '../data/siteConfig'

interface WordmarkProps {
  size?: 'default' | 'large'
}

export default function Wordmark({ size = 'default' }: WordmarkProps) {
  const [firstWord, ...restWords] = siteConfig.brand.name.split(' ')
  const typeScale =
    size === 'large'
      ? 'font-headline-lg text-headline-lg'
      : 'font-headline-sm text-headline-sm'
  return (
    <span className={`${typeScale} leading-none tracking-tight whitespace-nowrap`}>
      <span className="font-semibold text-ink">{firstWord}</span>{' '}
      <span className="font-extrabold text-primary">{restWords.join(' ')}</span>
    </span>
  )
}
