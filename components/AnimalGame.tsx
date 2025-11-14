'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Fireworks from './Fireworks'
import { playAnimalSound, playFireworkSound } from '@/utils/sounds'

// 动物配置
const animals = [
  { id: 'rabbit', emoji: '🐰', color: 'bg-pink-400', sound: 'rabbit' },
  { id: 'cat', emoji: '🐱', color: 'bg-orange-400', sound: 'cat' },
  { id: 'dog', emoji: '🐶', color: 'bg-amber-600', sound: 'dog' },
  { id: 'bird', emoji: '🐦', color: 'bg-sky-400', sound: 'bird' },
  { id: 'fish', emoji: '🐠', color: 'bg-blue-400', sound: 'fish' },
  { id: 'squirrel', emoji: '🐿️', color: 'bg-yellow-600', sound: 'squirrel' },
  { id: 'turtle', emoji: '🐢', color: 'bg-green-500', sound: 'turtle' },
  { id: 'bug', emoji: '🐛', color: 'bg-lime-500', sound: 'bug' },
]

interface AnimalInstance {
  id: string
  animal: typeof animals[0]
  position: { x: number; y: number }
  velocity: { x: number; y: number }
}

export default function AnimalGame() {
  const [activeAnimals, setActiveAnimals] = useState<AnimalInstance[]>([])
  const [speed, setSpeed] = useState(1)
  const [clickCount, setClickCount] = useState(0)
  const [showFireworks, setShowFireworks] = useState(false)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const animalRef = useRef<HTMLDivElement>(null)
  const [animalMargin, setAnimalMargin] = useState(6) // 动态计算的边界

  // 设置动态视口高度，适配移动端浏览器
  useEffect(() => {
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    
    setAppHeight()
    window.addEventListener('resize', setAppHeight)
    window.addEventListener('orientationchange', setAppHeight)
    
    return () => {
      window.removeEventListener('resize', setAppHeight)
      window.removeEventListener('orientationchange', setAppHeight)
    }
  }, [])

  // 初始化两个动物
  useEffect(() => {
    spawnAnimals()
  }, [])

  // 生成2-6个不同的动物
  const spawnAnimals = () => {
    // 随机数量：2到6之间
    const count = Math.floor(Math.random() * 5) + 2 // 2, 3, 4, 5, 6
    
    const shuffled = [...animals].sort(() => Math.random() - 0.5)
    const selectedAnimals = shuffled.slice(0, count)
    
    const newAnimals: AnimalInstance[] = selectedAnimals.map((animal, index) => {
      const angle = Math.random() * Math.PI * 2
      const baseSpeed = 0.5
      const margin = 15
      
      return {
        id: `${animal.id}-${Date.now()}-${index}`,
        animal,
        position: {
          x: Math.random() * (100 - 2 * margin) + margin,
          y: Math.random() * (100 - 2 * margin) + margin,
        },
        velocity: {
          x: Math.cos(angle) * baseSpeed,
          y: Math.sin(angle) * baseSpeed,
        },
      }
    })
    
    setActiveAnimals(newAnimals)
  }

  // 动态计算动物边界，确保左右对称
  useEffect(() => {
    const calculateMargin = () => {
      if (animalRef.current) {
        const animalWidth = animalRef.current.offsetWidth
        const screenWidth = window.innerWidth
        // 动物半径占屏幕宽度的百分比
        const halfWidthPercent = (animalWidth / 2 / screenWidth) * 100
        // 添加小缓冲确保不超出边界
        setAnimalMargin(Math.ceil(halfWidthPercent) + 1)
      }
    }

    // 延迟计算，确保DOM已渲染
    const timer = setTimeout(calculateMargin, 100)
    window.addEventListener('resize', calculateMargin)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateMargin)
    }
  }, [activeAnimals])

  // 动物移动逻辑
  useEffect(() => {
    if (activeAnimals.length === 0 || showFireworks) return

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 16.67 // 标准化到60fps
      lastTimeRef.current = currentTime

      setActiveAnimals(prev => prev.map(animal => {
        let newX = animal.position.x + animal.velocity.x * speed * deltaTime
        let newY = animal.position.y + animal.velocity.y * speed * deltaTime
        let newVelX = animal.velocity.x
        let newVelY = animal.velocity.y

        // 使用动态计算的边界值，确保左右对称
        const margin = animalMargin

        // 检测边界碰撞并反弹
        if (newX <= margin || newX >= 100 - margin) {
          newVelX = -animal.velocity.x
          newX = newX <= margin ? margin : 100 - margin
        }

        if (newY <= margin || newY >= 100 - margin) {
          newVelY = -animal.velocity.y
          newY = newY <= margin ? margin : 100 - margin
        }

        return {
          ...animal,
          position: { x: newX, y: newY },
          velocity: { x: newVelX, y: newVelY },
        }
      }))

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeAnimals.length, showFireworks, speed, animalMargin])

  // 点击动物处理
  const handleAnimalClick = (clickedAnimal: AnimalInstance) => (e: React.MouseEvent) => {
    e.stopPropagation()

    // 播放当前动物的叫声
    playAnimalSound(clickedAnimal.animal.sound)

    // 增加点击计数
    const newCount = clickCount + 1
    setClickCount(newCount)

    // 移除被点击的动物
    const remainingAnimals = activeAnimals.filter(a => a.id !== clickedAnimal.id)
    setActiveAnimals(remainingAnimals)

    // 如果所有动物都被点击了，显示烟花
    if (remainingAnimals.length === 0) {
      setShowFireworks(true)
      playFireworkSound()

      // 3秒后隐藏烟花，重新生成动物并加速
      setTimeout(() => {
        setShowFireworks(false)
        
        // 增加速度（每次增加15%）
        setSpeed(prev => prev + 0.15)
        
        // 重新生成2-6个动物
        spawnAnimals()
        
        lastTimeRef.current = 0
      }, 3000)
    }
  }

  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 select-none"
      style={{
        width: '100vw',
        // 使用dvh（动态视口高度）适配移动端浏览器，回退到vh
        height: 'var(--app-height, 100vh)',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        userSelect: 'none',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 点击计数显示 */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg z-10">
        <div className="text-2xl font-bold text-purple-600">
          🎯 {clickCount} 次
        </div>
      </div>

      {/* 速度显示 */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg z-10">
        <div className="text-2xl font-bold text-green-600">
          ⚡ {speed.toFixed(1)}x
        </div>
      </div>

      {/* 跑动的动物 */}
      <AnimatePresence>
        {activeAnimals.map((animalInstance, index) => (
          <motion.div
            key={animalInstance.id}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
            }}
            exit={{ 
              scale: 0, 
              rotate: 360, 
              opacity: 0,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              left: `${animalInstance.position.x}%`,
              top: `${animalInstance.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="cursor-pointer"
            onClick={handleAnimalClick(animalInstance)}
          >
            {/* 动物emoji */}
            <motion.div
              ref={index === 0 ? animalRef : null}
              whileHover={{ scale: 1.1 }}
              animate={{
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{
                rotate: {
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="text-8xl md:text-9xl select-none"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
              }}
              onContextMenu={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
            >
              {animalInstance.animal.emoji}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 烟花特效 */}
      <AnimatePresence>
        {showFireworks && <Fireworks />}
      </AnimatePresence>

      {/* 提示文字 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
          点击小动物！
        </p>
      </motion.div>
    </div>
  )
}
