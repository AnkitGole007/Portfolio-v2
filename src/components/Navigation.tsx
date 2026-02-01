import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
]

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-secondary/80 backdrop-blur-md border border-border shadow-lg">
        {navItems.map((item, index) => (
          <motion.a
            key={item.label}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {item.label}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
}
