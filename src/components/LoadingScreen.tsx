'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[400] bg-[#030304] flex flex-col items-center justify-center"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 30% 30%, rgba(10,132,255,0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 70% 70%, rgba(94,92,230,0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 30% 70%, rgba(191,90,242,0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 70% 30%, rgba(10,132,255,0.15) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0"
            />
          </div>

          {/* Logo/Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-8 rounded-full border border-[#0a84ff]/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-12 rounded-full border border-[#5e5ce6]/15"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-16 rounded-full border border-[#bf5af2]/10"
            />

            <div className="relative text-center">
              <h1 className="text-4xl font-bold gradient-text-animated">AG</h1>
            </div>
          </motion.div>

          {/* Loading bar */}
          <div className="w-64 relative">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                className="h-full bg-gradient-to-r from-[#0a84ff] via-[#5e5ce6] to-[#bf5af2] rounded-full"
              />
            </div>

            {/* Progress text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center text-sm text-white/40"
            >
              {progress < 30 && 'Initializing neural networks...'}
              {progress >= 30 && progress < 60 && 'Loading AI modules...'}
              {progress >= 60 && progress < 90 && 'Preparing experience...'}
              {progress >= 90 && 'Almost ready...'}
            </motion.p>
          </div>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 rounded-full bg-[#0a84ff]"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
