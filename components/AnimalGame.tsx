'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat, Dog, Bird, Rabbit, Fish, Squirrel, Turtle, Bug } from 'lucide-react'
import Particle from './Particle'
import Fireworks from './Fireworks'
import { playAnimalSound, playFireworkSound } from '@/utils/sounds'

// 动物配置
const animals = [
  { id: 'cat', Icon: Cat, sound: 'meow', color: 'bg-orange-400', emoji: '🐱' },
  { id: 'dog', Icon: Dog, sound: 'woof', color: 'bg-amber-600', emoji: '🐶' },
  { id: 'bird', Icon: Bird, sound: 'chirp', color: 'bg-sky-400', emoji: '🐦' },
  { id: 'rabbit', Icon: Rabbit, sound: 'squeak', color: 'bg-pink-400', emoji: '🐰' },
  { id: 'fish', Icon: Fish, sound: 'bubble', color: 'bg-blue-400', emoji: '🐠' },
  { id: 'squirrel', Icon: Squirrel, sound: 'chatter', color: 'bg-yellow-600', emoji: '🐿️' },
  { id: 'turtle', Icon: Turtle, sound: 'slow', color: 'bg-green-500', emoji: '🐢' },
  { id: 'bug', Icon: Bug, sound: 'buzz', color: 'bg-lime-500', emoji: '🐛' },
]

interface AnimalInstance {
  id: string
  animal: typeof animals[0]
  position: { x: number; y: number }
}

export default function AnimalGame() {
  const [activeAnimals, setActiveAnimals] = useState<AnimalInstance[]>([])
  const [clickCount, setClickCount] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  const [showFireworks, setShowFireworks] = useState(false)

  // 生成随机位置（确保不重叠）
  const generateRandomPosition = useCallback((existingPositions: { x: number; y: number }[]) => {
    // 最小间距（百分比单位），确保动物之间有足够距离
    const minDistancePercent = 25 // 屏幕宽度的25%
    let attempts = 0
    const maxAttempts = 100 // 增加尝试次数
    
    // 动物大小约为屏幕的10-15%，所以需要留出足够边距
    const margin = 10 // 边距10%，确保动物完全在屏幕内
    
    while (attempts < maxAttempts) {
      // 生成随机位置（留出边距，确保动物不会被裁切）
      const x = Math.random() * (100 - 2 * margin) + margin // margin% - (100-margin)%
      const y = Math.random() * (100 - 2 * margin) + margin // margin% - (100-margin)%
      
      // 检查是否与现有位置冲突
      const tooClose = existingPositions.some(pos => {
        // 计算欧几里得距离（百分比单位）
        const dx = pos.x - x
        const dy = pos.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < minDistancePercent
      })
      
      if (!tooClose) {
        return { x, y }
      }
      
      attempts++
    }
    
    // 如果尝试多次仍失败，使用预设的安全位置（确保在屏幕内）
    const safePositions = [
      { x: 25, y: 30 },  // 左上区域
      { x: 50, y: 50 },  // 中心
      { x: 75, y: 70 },  // 右下区域
    ]
    
    // 找到第一个不冲突的安全位置
    for (const pos of safePositions) {
      const tooClose = existingPositions.some(existing => {
        const dx = existing.x - pos.x
        const dy = existing.y - pos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < minDistancePercent
      })
      
      if (!tooClose) {
        return pos
      }
    }
    
    // 最后的兜底方案
    return safePositions[existingPositions.length % safePositions.length]
  }, [])

  // 生成新的动物组
  const spawnAnimals = useCallback(() => {
    const positions: { x: number; y: number }[] = []
    const newAnimals: AnimalInstance[] = []
    
    // 随机选择3个不同的动物
    const shuffled = [...animals].sort(() => Math.random() - 0.5)
    const selectedAnimals = shuffled.slice(0, 3)
    
    selectedAnimals.forEach((animal, index) => {
      const position = generateRandomPosition(positions)
      positions.push(position)
      
      newAnimals.push({
        id: `${animal.id}-${Date.now()}-${index}`,
        animal,
        position
      })
    })
    
    setActiveAnimals(newAnimals)
  }, [generateRandomPosition])

  // 初始化时生成动物
  useEffect(() => {
    spawnAnimals()
  }, [spawnAnimals])

  // 当所有动物都被点击后，生成新的一组（烟花期间不生成）
  useEffect(() => {
    if (activeAnimals.length === 0 && !showFireworks) {
      const timer = setTimeout(() => {
        spawnAnimals()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [activeAnimals.length, showFireworks, spawnAnimals])

  // 点击动物处理
  const handleAnimalClick = (animalInstance: AnimalInstance, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    // 播放对应动物的叫声
    playAnimalSound(animalInstance.animal.id)

    // 增加点击计数
    const newCount = clickCount + 1
    setClickCount(newCount)

    // 生成粒子效果
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: animalInstance.animal.color,
    }))
    setParticles(prev => [...prev, ...newParticles])

    // 清理粒子
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1000)

    // 检查是否达到里程碑
    if (newCount % 3 === 0) {
      // 每3次点击触发烟花
      setShowFireworks(true)
      playFireworkSound() // 播放烟花音效
      
      // 烟花持续4秒后消失，然后重新生成动物
      setTimeout(() => {
        setShowFireworks(false)
        // 烟花结束后，如果没有动物则立即生成
        setTimeout(() => {
          if (activeAnimals.length === 0) {
            spawnAnimals()
          }
        }, 100)
      }, 2000)
    }

    // 移除被点击的动物
    setActiveAnimals(prev => prev.filter(a => a.id !== animalInstance.id))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      {/* 点击计数显示 */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg z-10">
        <div className="text-2xl font-bold text-purple-600">
          {clickCount} 次
        </div>
      </div>

      {/* 剩余动物数量 */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg z-10">
        <div className="text-2xl font-bold text-green-600">
          🎯 {activeAnimals.length}/3
        </div>
      </div>

      {/* 主游戏区域 - 多个动物 */}
      <div className="w-full h-full relative">
        <AnimatePresence>
          {activeAnimals.map((animalInstance) => {
            const AnimalIcon = animalInstance.animal.Icon
            return (
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
                  rotate: 180, 
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 260, 
                  damping: 20 
                }}
                style={{
                  position: 'absolute',
                  left: `${animalInstance.position.x}%`,
                  top: `${animalInstance.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '200px', // 限制最大宽度
                }}
                className="cursor-pointer"
                onClick={(e) => handleAnimalClick(animalInstance, e)}
              >
                {/* 动物图标背景 */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`${animalInstance.animal.color} rounded-full p-8 md:p-12 shadow-2xl relative`}
                >
                  <AnimalIcon 
                    className="w-24 h-24 md:w-32 md:h-32 text-white" 
                    strokeWidth={2}
                  />
                  
                  {/* Emoji 表情 */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-4 -right-4 text-4xl md:text-6xl"
                  >
                    {animalInstance.animal.emoji}
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 粒子效果 */}
      <AnimatePresence>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            color={particle.color}
          />
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
