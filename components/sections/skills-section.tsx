import { skillGroups } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/reveal'
import { Section } from '@/components/ui/section'
import { Prose } from '@/components/glossary/prose'

// Inline items, so a long skill breaks across lines like words in a sentence instead of jumping whole to the next row.
const ITEM = "inline after:text-ink-2 after:content-[',_'] last:after:content-none"

/** Only phrases ("hybrid search", "LoRA fine-tuning") get glossary tips; single names stay plain words. */
const isPhrase = (skill: string) => /\s/.test(skill)

/**
 * Two-ended rows in one column: the group name at the left, its skills at the right. Each group leads
 * with its five core skills from profile.json `coreSkills` at the 500 weight; the rest follow in the
 * soft ink. Rows are separated by space alone.
 */
export function SkillsSection() {
  const groups = skillGroups()
  if (groups.length === 0) return null
  // One glossary popover per term across the whole section.
  const seen = new Set<string>()
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-8 md:space-y-10">
        {groups.map((group, i) => (
          <Reveal key={group.name} delay={Math.min(i * 30, 90)} className="grid gap-x-6 gap-y-2 md:grid-cols-12">
            <h3 className="text-title md:col-span-4 lg:col-span-3">{group.name}</h3>
            <ul className="max-w-[75ch] leading-relaxed md:col-span-8 lg:col-span-8">
              {group.items.map((skill) => {
                const cls = cn(ITEM, skill.core ? 'font-medium text-ink' : 'text-ink-2')
                return isPhrase(skill.name) ? (
                  <Prose key={skill.name} as="li" text={skill.name} className={cls} seen={seen} />
                ) : (
                  <li key={skill.name} className={cls}>
                    {skill.name}
                  </li>
                )
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
