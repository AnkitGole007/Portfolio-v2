'use client';

import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status?: 'available' | 'busy' | 'open';
}

export default function StatusBadge({ status = 'available' }: StatusBadgeProps) {
  const statusConfig = {
    available: {
      text: 'Open to Opportunities',
      color: '#30d158',
      bgColor: 'rgba(48, 209, 88, 0.1)',
    },
    busy: {
      text: 'Currently Employed',
      color: '#ff9500',
      bgColor: 'rgba(255, 149, 0, 0.1)',
    },
    open: {
      text: 'Open for Freelance',
      color: '#0a84ff',
      bgColor: 'rgba(10, 132, 255, 0.1)',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        backgroundColor: config.bgColor,
        borderColor: `${config.color}30`,
      }}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2">
        <motion.span
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inline-flex h-full w-full rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: config.color }}
        />
      </span>
      <span
        className="text-xs font-medium"
        style={{ color: config.color }}
      >
        {config.text}
      </span>
    </motion.div>
  );
}
