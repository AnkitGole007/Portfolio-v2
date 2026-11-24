import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/reveal'

/**
 * One panel of the About sheet: the h2 with its anchor, an optional one-line intro and the content.
 * Spacing and the headline step separate the blocks (no rule); 40 to 48 px of padding keeps the rhythm dense.
 * The heading enters first and the content 80 ms after it, once, as the block reaches the viewport;
 * Reveal shows both at rest under reduced motion, in print and without script.
 */
export function Block({
  id,
  title,
  intro,
  className,
  children,
}: {
  id: string
  title: string
  intro?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('py-10 md:py-12', className)}>
      <Reveal>
        <h2 id={`${id}-title`} className="text-headline">
          {title}
        </h2>
        {intro ? <p className="mt-3 max-w-[62ch] text-ink-2">{intro}</p> : null}
      </Reveal>
      <Reveal delay={80} className="mt-6 md:mt-8">
        {children}
      </Reveal>
    </section>
  )
}
