'use client'

import { Printer } from '@/components/ui/icons'
import { pill } from '@/components/cta/actions'
import { cx } from '@/lib/cx'

/** Opens the browser's print dialog; the page's print stylesheet sets the two-page layout. Square, like every button on the site. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={cx(pill.base, pill.secondary)}>
      <Printer size={16} aria-hidden="true" />
      Print
    </button>
  )
}
