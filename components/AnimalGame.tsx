'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Fireworks from './Fireworks'
import { playAnimalSound, playFireworkSound, triggerVibration, toggleBackgroundMusic, isMusicPlaying } from '@/utils/sounds'

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

interface RippleInstance {
  id: string
  x: number
  y: number
  color: string
}

export default function AnimalGame() {
  const [activeAnimals, setActiveAnimals] = useState<AnimalInstance[]>([])
  const [speed, setSpeed] = useState(1)
  const [clickCount, setClickCount] = useState(0)
  const [showFireworks, setShowFireworks] = useState(false)
  const [ripples, setRipples] = useState<RippleInstance[]>([])
  const [musicEnabled, setMusicEnabled] = useState(false)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const animalRef = useRef<HTMLDivElement>(null)
  const [animalMargin, setAnimalMargin] = useState({ x: 6, y: 6 }) // 动态计算的边界（横向、纵向分别处理）

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

  // 动态计算动物边界，确保在水平与垂直方向上都留足空间
  useEffect(() => {
    const calculateMargin = () => {
      if (animalRef.current) {
        const rect = animalRef.current.getBoundingClientRect()
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const halfWidthPercent = (rect.width / 2 / screenWidth) * 100
        const halfHeightPercent = (rect.height / 2 / screenHeight) * 100
        setAnimalMargin({
          x: Math.ceil(halfWidthPercent) + 1,
          y: Math.ceil(halfHeightPercent) + 1,
        })
      }
    }

    // 延迟计算，确保DOM已渲染
    const timer = setTimeout(calculateMargin, 100)
    window.addEventListener('resize', calculateMargin)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateMargin)
    }
  }, [activeAnimals.length])

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

        // 使用动态计算的边界值，区分横纵方向
        const marginX = animalMargin.x
        const marginY = animalMargin.y

        // 检测边界碰撞并反弹
        if (newX <= marginX || newX >= 100 - marginX) {
          newVelX = -animal.velocity.x
          newX = newX <= marginX ? marginX : 100 - marginX
        }

        if (newY <= marginY || newY >= 100 - marginY) {
          newVelY = -animal.velocity.y
          newY = newY <= marginY ? marginY : 100 - marginY
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

  // 移除涟漪效果
  const removeRipple = (id: string) => {
    setRipples(prev => prev.filter(r => r.id !== id))
  }

  // 点击动物处理
  const handleAnimalClick = (clickedAnimal: AnimalInstance) => (e: React.MouseEvent) => {
    e.stopPropagation()

    // 创建涟漪效果
    const rippleColors = [
      '#FF6B9D', '#C44569', '#FFA07A', '#FFD93D',
      '#6BCB77', '#4D96FF', '#9B59B6', '#E056FD'
    ]
    const randomColor = rippleColors[Math.floor(Math.random() * rippleColors.length)]
    const newRipple: RippleInstance = {
      id: `ripple-${Date.now()}-${Math.random()}`,
      x: e.clientX,
      y: e.clientY,
      color: randomColor
    }
    console.log('创建涟漪效果:', { x: e.clientX, y: e.clientY, color: randomColor })
    setRipples(prev => [...prev, newRipple])

    // 触发震动反馈
    triggerVibration()

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
      console.log('所有动物已点击，准备显示烟花')
      // 延迟显示烟花，让动画完成
      setTimeout(() => {
        console.log('开始显示烟花')
        setShowFireworks(true)
        playFireworkSound()
      }, 500)

      // 3秒后隐藏烟花，重新生成动物并加速
      setTimeout(() => {
        setShowFireworks(false)
        
        // 增加速度（每次增加15%）
        setSpeed(prev => prev + 0.15)
        
        // 重新生成2-6个动物
        spawnAnimals()
        
        lastTimeRef.current = 0
      }, 3500)
    }
  }

  // 切换背景音乐
  const handleMusicToggle = () => {
    const isPlaying = toggleBackgroundMusic()
    setMusicEnabled(isPlaying)
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

      {/* 背景音乐开关 */}
      <motion.button
        onClick={handleMusicToggle}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg z-10 cursor-pointer"
        style={{ touchAction: 'auto' }}
      >
        <div className="text-3xl">
          {musicEnabled ? '🔊' : '🔇'}
        </div>
      </motion.button>

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
              scale: [1, 1.8, 0],
              rotate: [0, 180, 720],
              y: [0, -80, 0],
              opacity: [1, 1, 0],
              transition: { 
                duration: 0.7,
                times: [0, 0.5, 1],
                ease: ["easeOut", "easeIn"]
              }
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

      {/* 涟漪效果 */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: `5px solid ${ripple.color}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

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
