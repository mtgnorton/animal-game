'use client'

import { motion } from 'framer-motion'

export default function RainbowCelebration() {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500']
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="text-9xl"
        >
          🌈
        </motion.div>
      </div>
      
      {/* 彩色星星 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: '50vw', 
            y: '50vh', 
            scale: 0,
            opacity: 1 
          }}
          animate={{ 
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut'
          }}
          className={`absolute w-8 h-8 ${colors[i % colors.length]}`}
          style={{
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          }}
        />
      ))}
    </motion.div>
  )
}
