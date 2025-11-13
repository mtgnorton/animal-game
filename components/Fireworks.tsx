'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FireworkParticle {
  id: number
  x: number
  y: number
  color: string
  angle: number
  distance: number
}

interface Firework {
  id: number
  x: number
  y: number
  particles: FireworkParticle[]
}

export default function Fireworks() {
  const [fireworks, setFireworks] = useState<Firework[]>([])
  
  const colors = [
    'bg-red-500',
    'bg-orange-500', 
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ]

  useEffect(() => {
    // 生成多个烟花
    const newFireworks: Firework[] = []
    const fireworkCount = 15 // 增加烟花数量到15个
    
    for (let i = 0; i < fireworkCount; i++) {
      const x = Math.random() * 100 // 0-100%
      const y = Math.random() * 80 + 10 // 10-90%
      const particles: FireworkParticle[] = []
      const particleCount = 30 // 增加每个烟花的粒子数到30
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      // 为每个烟花生成粒子
      for (let j = 0; j < particleCount; j++) {
        const angle = (Math.PI * 2 * j) / particleCount
        const distance = 100 + Math.random() * 50 // 随机距离
        
        particles.push({
          id: j,
          x,
          y,
          color,
          angle,
          distance,
        })
      }
      
      newFireworks.push({
        id: i,
        x,
        y,
        particles,
      })
    }
    
    setFireworks(newFireworks)
    
    // 延长持续时间到4秒
    const timer = setTimeout(() => {
      setFireworks([])
    }, 4000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      {/* 烟花粒子 */}
      {fireworks.map((firework) => (
        <div key={firework.id}>
          {firework.particles.map((particle) => {
            const endX = firework.x + Math.cos(particle.angle) * particle.distance / 10
            const endY = firework.y + Math.sin(particle.angle) * particle.distance / 10
            
            return (
              <motion.div
                key={`${firework.id}-${particle.id}`}
                initial={{
                  left: `${firework.x}%`,
                  top: `${firework.y}%`,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  left: `${endX}%`,
                  top: `${endY}%`,
                  scale: [0, 1, 0.5, 0],
                  opacity: [1, 1, 0.5, 0],
                }}
                transition={{
                  duration: 2.5,
                  ease: 'easeOut',
                  times: [0, 0.3, 0.7, 1],
                }}
                className={`absolute w-3 h-3 rounded-full ${particle.color}`}
                style={{
                  boxShadow: `0 0 10px ${particle.color}`,
                }}
              />
            )
          })}
          
          {/* 烟花中心闪光 */}
          <motion.div
            initial={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            className="absolute w-8 h-8 rounded-full bg-white"
            style={{
              transform: 'translate(-50%, -50%)',
              filter: 'blur(4px)',
            }}
          />
        </div>
      ))}
      
    </motion.div>
  )
}
