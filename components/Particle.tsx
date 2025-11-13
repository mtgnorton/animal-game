'use client'

import { motion } from 'framer-motion'

interface ParticleProps {
  x: number
  y: number
  color: string
}

export default function Particle({ x, y, color }: ParticleProps) {
  const randomX = Math.random() * 200 - 100
  const randomY = Math.random() * 200 - 100
  
  return (
    <motion.div
      initial={{ x, y, scale: 1, opacity: 1 }}
      animate={{ 
        x: x + randomX, 
        y: y + randomY, 
        scale: 0, 
        opacity: 0 
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`absolute w-4 h-4 rounded-full ${color}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
