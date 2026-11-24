import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Retired claims and private details that no surface of the site may carry (plan Global Constraints).
// Shared by two guards: scripts/check-profile.mjs checks the content model and scripts/scan-build.mjs
// checks everything the build serves. The retired claims are not private, so they are listed in plain
// text; private terms come from the environment and the phone number is found by its shape (both below).
// Matching is case-insensitive.
export const BANNED = [
  '0.85 F1',
  '87.4%',
  '93% lower',
  '11.9x',
  '50x',
  '6x precision',
  '500,000+',
  '92% precision',
  '87.9%',
  '2+ years software engineering',
  'PVLDB',
  'beat XGBoost',
  'edged past',
  'Kubernetes',
  'Terraform',
  'Prometheus',
  'Grafana',
  'MLflow',
  'sole author',
  'Platt',
  'Llama 3.1 8B',
  '5,000 multi-modal',
  '10,000+',
]

// ---- Private terms -----------------------------------------------------------------------------
// Names that must not appear in any tracked file in any form, so the guards read them at run time from
// the PRIVATE_TERMS environment variable, comma-separated: a sensitive variable on Vercel, and locally
// the git-ignored .env.local (a value already set in the shell wins). A term matches as a run of whole
// words (letters and digits), in any case and with any punctuation between its words.
const words = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

/**
 * The terms in PRIVATE_TERMS, each as its list of words. When none is set, the rule is skipped and
 * `guard` prints one line, a warning on a Vercel build. A missing variable never fails the build.
 */
export function privateTerms(guard) {
  const local = fileURLToPath(new URL('../.env.local', import.meta.url))
  if (process.env.PRIVATE_TERMS === undefined && existsSync(local) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(local)
  }
  const terms = (process.env.PRIVATE_TERMS ?? '').split(',').map(words).filter((t) => t.length > 0)
  if (terms.length === 0) {
    if (process.env.VERCEL_ENV) {
      console.warn(`${guard}: WARNING: PRIVATE_TERMS is not set on this Vercel build, so the private-term rule did not run (docs/deploy.md, step 2)`)
    } else {
      console.log(`${guard}: PRIVATE_TERMS is unset, private-term rule skipped`)
    }
  }
  return terms
}

/** True when `text` holds one of `terms` (from privateTerms) as a run of whole words. */
export function hasPrivateTerm(text, terms) {
  if (terms.length === 0) return false
  const w = words(text)
  return terms.some((t) => w.some((_, i) => t.every((x, j) => w[i + j] === x)))
}

// ---- Phone numbers -----------------------------------------------------------------------------
// The site carries no phone number at all, so the guards look for the shape of one. They hold only the
// owner's area code, which alone does not reconstruct the number.
const AREA = '774'
const SEP = '[\\s.-]?'

/**
 * The area code as a bare token ("774", "774.", "(774)", "774-"): banned on its own wherever text is
 * read. Not inside a word, hash or longer number ("ab774c", "17745"), and not a decimal or thousands
 * part ("0.774", "1,774", "774.5").
 */
export const AREA_CODE_TOKEN = new RegExp(`(?<![\\w.,])${AREA}(?![\\w,]|\\.\\d)`)

/**
 * Whole phone numbers, found anywhere a file is read (raw bytes: HTML attributes such as meta content,
 * alt, title and aria-label, JSON route bodies, flight payloads, bundles, text files):
 * - any number in the owner's area code: the area code and 7 digits, with or without "+1", brackets and separators;
 * - any US number written with separators: "555-555-0100", "(555) 555-0100", "+1 555.555.0100".
 */
export const NUMBER_PHONE_PATTERNS = [
  { label: "a number in the owner's area code", re: new RegExp(`(?<![\\w.])(?:\\+?1${SEP})?\\(?${AREA}\\)?${SEP}\\d{3}${SEP}\\d{4}(?!\\w)`) },
  { label: 'a US phone number with separators', re: /(?<![\w.])(?:\+?1[\s.-]?)?(?:\(\d{3}\)\s?|\d{3}[\s.-])\d{3}[\s.-]\d{4}(?!\w)/ },
]

/**
 * Phone shapes in readable text (page text, JSON-LD, markdown and other text files, OG text, profile
 * strings), never in scripts, flight payloads or SVG path data, where digit runs are not copy:
 * - the two whole-number shapes above (NUMBER_PHONE_PATTERNS);
 * - a 3 and 4 digit group with a separator a few characters after a phone word ("Call 555-0100");
 * - the area code a few characters after a phone word, even where a comma follows it;
 * - the area code as a bare token.
 */
export const READABLE_PHONE_PATTERNS = [
  ...NUMBER_PHONE_PATTERNS,
  { label: 'a 3 and 4 digit group after a phone word', re: /\b(?:call|phone|tel|cell|mobile|text|whatsapp)\b[^\d\n]{0,12}\d{3}[\s.-]\d{4}(?!\d)/i },
  { label: 'the area code after a phone word', re: new RegExp(`\\b(?:call|phone|tel|cell|mobile|text|whatsapp)\\b[^\\d\\n]{0,12}(?:\\+?1${SEP})?\\(?${AREA}(?!\\d)`, 'i') },
  { label: 'the area code as a token', re: AREA_CODE_TOKEN },
]

/** Phone markup, found anywhere a file is read: any tel: link and any vCard TEL line, whatever the number. */
export const MARKUP_PHONE_PATTERNS = [
  { label: 'a tel: link', re: /\btel:\s*\+?\d/i },
  { label: 'a vCard TEL line', re: /(?:^|\n)TEL[;:]/i },
]

/** The label of the first whole-number shape found in `text` (raw bytes of any file), or null. */
export function phoneNumber(text) {
  return NUMBER_PHONE_PATTERNS.find(({ re }) => re.test(text))?.label ?? null
}

/** The label of the first phone shape found in readable `text`, or null. */
export function readablePhone(text) {
  return READABLE_PHONE_PATTERNS.find(({ re }) => re.test(text))?.label ?? null
}

/** The label of the first tel: link or vCard TEL line in `text`, or null. */
export function phoneMarkup(text) {
  return MARKUP_PHONE_PATTERNS.find(({ re }) => re.test(text))?.label ?? null
}
