'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  FolderKanban,
  Briefcase,
  Cpu,
  Mail,
  Home,
  MessageCircle,
  Trophy
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <Home size={20} />, label: 'Home', href: '/' },
  { icon: <User size={20} />, label: 'About', href: '/about' },
  { icon: <FolderKanban size={20} />, label: 'Projects', href: '/projects' },
  { icon: <Briefcase size={20} />, label: 'Experience', href: '/experience' },
  { icon: <Cpu size={20} />, label: 'Skills', href: '/skills' },
  { icon: <Trophy size={20} />, label: 'Achievements', href: '/achievements' },
  { icon: <Mail size={20} />, label: 'Contact', href: '/contact' },
];

interface NavigationIslandProps {
  showChat?: boolean;
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export default function NavigationIsland({
  showChat = true,
  onChatToggle,
  isChatOpen = false
}: NavigationIslandProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  return (
    <AnimatePresence>
      {!isHome && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass-strong rounded-full px-2 py-2 flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {pathname === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
              </motion.button>
            ))}

            {showChat && (
              <>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <motion.button
                  onClick={onChatToggle}
                  className={`relative p-3 rounded-full transition-all duration-300 ${
                    isChatOpen
                      ? 'text-white bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]'
                      : 'text-white/60 hover:text-white/90'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle size={20} />
                </motion.button>
              </>
            )}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
