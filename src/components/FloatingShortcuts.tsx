'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  FolderKanban,
  Briefcase,
  Cpu,
  Mail,
  Github,
  Linkedin,
  Trophy
} from 'lucide-react';

interface Shortcut {
  icon: React.ReactNode;
  label: string;
  wittyText: string;
  href: string;
  position: { x: number; y: number };
  delay: number;
  external?: boolean;
}

const shortcuts: Shortcut[] = [
  {
    icon: <User size={20} />,
    label: 'About',
    wittyText: 'The human behind the algorithms',
    href: '/about',
    position: { x: -28, y: -18 },
    delay: 0.1,
  },
  {
    icon: <FolderKanban size={20} />,
    label: 'Projects',
    wittyText: 'Where ideas become commits',
    href: '/projects',
    position: { x: 28, y: -18 },
    delay: 0.2,
  },
  {
    icon: <Briefcase size={20} />,
    label: 'Experience',
    wittyText: 'From intern to AI whisperer',
    href: '/experience',
    position: { x: -32, y: 2 },
    delay: 0.3,
  },
  {
    icon: <Cpu size={20} />,
    label: 'Skills',
    wittyText: 'My neural network stack',
    href: '/skills',
    position: { x: 32, y: 2 },
    delay: 0.4,
  },
  {
    icon: <Trophy size={20} />,
    label: 'Achievements',
    wittyText: 'Milestones collected',
    href: '/achievements',
    position: { x: -18, y: 20 },
    delay: 0.5,
  },
  {
    icon: <Mail size={20} />,
    label: 'Contact',
    wittyText: 'Ping my inbox',
    href: '/contact',
    position: { x: 18, y: 20 },
    delay: 0.6,
  },
];

const socialLinks: Shortcut[] = [
  {
    icon: <Github size={18} />,
    label: 'GitHub',
    wittyText: 'My code sanctuary',
    href: 'https://github.com/AnkitGole007',
    position: { x: -12, y: 34 },
    delay: 0.7,
    external: true,
  },
  {
    icon: <Linkedin size={18} />,
    label: 'LinkedIn',
    wittyText: 'Professional persona',
    href: 'https://linkedin.com/in/ankit-gole',
    position: { x: 12, y: 34 },
    delay: 0.8,
    external: true,
  },
];

interface FloatingShortcutProps {
  shortcut: Shortcut;
}

function FloatingShortcut({ shortcut }: FloatingShortcutProps) {
  const router = useRouter();

  const handleClick = () => {
    if (shortcut.external) {
      window.open(shortcut.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(shortcut.href);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: [0, Math.random() * 3 - 1.5, 0],
      }}
      transition={{
        duration: 0.5,
        delay: shortcut.delay,
        x: {
          duration: 5 + Math.random() * 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="absolute glass rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer
                 hover:glow-soft transition-all duration-300 group min-w-[100px]"
      style={{
        left: `calc(50% + ${shortcut.position.x}%)`,
        top: `calc(50% + ${shortcut.position.y}%)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="text-[#0a84ff] group-hover:text-[#5e5ce6] transition-colors">
        {shortcut.icon}
      </div>
      <span className="text-white/90 font-medium text-xs">{shortcut.label}</span>
      <motion.span
        initial={{ opacity: 0, height: 0 }}
        whileHover={{ opacity: 1, height: 'auto' }}
        className="text-white/50 text-[10px] text-center overflow-hidden"
      >
        {shortcut.wittyText}
      </motion.span>
    </motion.button>
  );
}

export default function FloatingShortcuts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full pointer-events-auto">
        {shortcuts.map((shortcut) => (
          <FloatingShortcut key={shortcut.label} shortcut={shortcut} />
        ))}
        {socialLinks.map((shortcut) => (
          <FloatingShortcut key={shortcut.label} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
}
