import { Hero } from '@/components/hero/hero'
import { PitchReel } from '@/components/reel/pitch-reel'
import { PITCH_SLUGS } from '@/components/reel/pitch-slugs'
import {
  ContactSection,
  ExperienceLedger,
  FeaturedWork,
  RecognitionSection,
  SkillsSection,
  StatsLedger,
  WritingSection,
} from '@/components/sections'
import { JsonLd, profilePageJsonLd, reelItemListJsonLd } from '@/lib/jsonld'

/** The reel and its video list return once a project has a pitch video (components/reel/pitch-slugs.ts). */
const hasReel = PITCH_SLUGS.length > 0

export default function HomePage() {
  return (
    <>
      <JsonLd data={profilePageJsonLd()} />
      {hasReel && <JsonLd data={reelItemListJsonLd(PITCH_SLUGS)} />}
      <Hero />
      <FeaturedWork />
      {hasReel && <PitchReel />}
      <ExperienceLedger />
      <StatsLedger />
      <SkillsSection />
      <RecognitionSection />
      <WritingSection />
      <ContactSection />
    </>
  )
}
