'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  Home,
  User,
  FolderKanban,
  Briefcase,
  Cpu,
  Trophy,
  Mail,
  Github,
  Linkedin,
  Command,
  X
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    {
      id: 'home',
      label: 'Go to Home',
      icon: <Home size={18} />,
      action: () => router.push('/'),
      category: 'Navigation',
      keywords: ['main', 'landing'],
    },
    {
      id: 'about',
      label: 'Go to About',
      icon: <User size={18} />,
      action: () => router.push('/about'),
      category: 'Navigation',
      keywords: ['bio', 'profile', 'me'],
    },
    {
      id: 'projects',
      label: 'Go to Projects',
      icon: <FolderKanban size={18} />,
      action: () => router.push('/projects'),
      category: 'Navigation',
      keywords: ['work', 'portfolio'],
    },
    {
      id: 'experience',
      label: 'Go to Experience',
      icon: <Briefcase size={18} />,
      action: () => router.push('/experience'),
      category: 'Navigation',
      keywords: ['jobs', 'work history', 'career'],
    },
    {
      id: 'skills',
      label: 'Go to Skills',
      icon: <Cpu size={18} />,
      action: () => router.push('/skills'),
      category: 'Navigation',
      keywords: ['tech', 'stack', 'technologies'],
    },
    {
      id: 'achievements',
      label: 'Go to Achievements',
      icon: <Trophy size={18} />,
      action: () => router.push('/achievements'),
      category: 'Navigation',
      keywords: ['awards', 'recognition'],
    },
    {
      id: 'contact',
      label: 'Go to Contact',
      icon: <Mail size={18} />,
      action: () => router.push('/contact'),
      category: 'Navigation',
      keywords: ['email', 'reach', 'message'],
    },
    {
      id: 'github',
      label: 'Open GitHub',
      icon: <Github size={18} />,
      action: () => window.open('https://github.com/AnkitGole007', '_blank'),
      category: 'Social',
      keywords: ['code', 'repo'],
    },
    {
      id: 'linkedin',
      label: 'Open LinkedIn',
      icon: <Linkedin size={18} />,
      action: () => window.open('https://linkedin.com/in/ankit-gole', '_blank'),
      category: 'Social',
      keywords: ['professional', 'network'],
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const searchStr = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchStr) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(searchStr))
    );
  });

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action();
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201]"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <Search size={20} className="text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/30
                           outline-none text-lg"
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white/40 text-xs">
                  <Command size={12} />
                  <span>K</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-white/40">
                    No commands found
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => (
                    <motion.button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                               text-left transition-colors ${
                                 idx === selectedIndex
                                   ? 'bg-[#0a84ff]/20 text-white'
                                   : 'text-white/70 hover:bg-white/5'
                               }`}
                    >
                      <span className={idx === selectedIndex ? 'text-[#0a84ff]' : 'text-white/40'}>
                        {cmd.icon}
                      </span>
                      <span className="flex-1">{cmd.label}</span>
                      <span className="text-xs text-white/30">{cmd.category}</span>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-white/30">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">↵</kbd> select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">esc</kbd> close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
