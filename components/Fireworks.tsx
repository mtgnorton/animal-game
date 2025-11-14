'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  isLauncher: boolean
  alpha: number
  life: number
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const launchIntervalRef = useRef<NodeJS.Timeout>()

  const gravity = 0.05
  // 游戏背景色的RGB值用于拖尾效果
  // from-blue-200 via-purple-200 to-pink-200 的平均色
  const bgColor = 'rgba(220, 210, 230, 0.2)'

  const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  const createExplosion = (x: number, y: number, color: string) => {
    const particleCount = 100
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = random(1, 5)
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      particlesRef.current.push({
        x,
        y,
        vx,
        vy,
        color,
        isLauncher: false,
        alpha: 1,
        life: random(30, 60),
      })
    }
  }

  const autoLaunchFirework = (canvas: HTMLCanvasElement) => {
    let startX: number, startY: number
    let targetX: number, targetY: number
    const edge = Math.floor(random(0, 4))

    switch (edge) {
      case 0: // 底部
        startX = random(0, canvas.width)
        startY = canvas.height
        targetX = random(canvas.width * 0.1, canvas.width * 0.9)
        targetY = random(canvas.height * 0.1, canvas.height * 0.5)
        break
      case 1: // 顶部
        startX = random(0, canvas.width)
        startY = 0
        targetX = random(canvas.width * 0.1, canvas.width * 0.9)
        targetY = random(canvas.height * 0.5, canvas.height * 0.9)
        break
      case 2: // 左侧
        startX = 0
        startY = random(0, canvas.height)
        targetX = random(canvas.width * 0.1, canvas.width * 0.9)
        targetY = random(canvas.height * 0.1, canvas.height * 0.9)
        break
      case 3: // 右侧
        startX = canvas.width
        startY = random(0, canvas.height)
        targetX = random(canvas.width * 0.1, canvas.width * 0.9)
        targetY = random(canvas.height * 0.1, canvas.height * 0.9)
        break
      default:
        startX = canvas.width / 2
        startY = canvas.height
        targetX = canvas.width / 2
        targetY = canvas.height / 2
    }

    const angle = Math.atan2(targetY - startY, targetX - startX)
    const speed = random(15, 25)
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed

    const hue = random(0, 360)
    // 在浅色背景上，亮度60%的颜色效果更好
    const color = `hsl(${hue}, 100%, 60%)`

    particlesRef.current.push({
      x: startX,
      y: startY,
      vx,
      vy,
      color,
      isLauncher: true,
      alpha: 1,
      life: random(30, 60),
    })
  }

  const updateParticle = (p: Particle) => {
    p.x += p.vx
    p.y += p.vy

    if (!p.isLauncher) {
      // 爆炸的火花
      p.vy += gravity
      p.vx *= 0.98
      p.vy *= 0.98
      p.alpha -= 0.02
    } else {
      // 火箭
      p.vx *= 0.99
      p.vy *= 0.99
      p.life--
      
      if (p.life <= 0) {
        p.alpha = 0
        createExplosion(p.x, p.y, p.color)
      }
      
      if (p.life < 15) {
        p.vy += gravity * 0.5
      }
    }
  }

  const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save()
    ctx.globalAlpha = p.alpha
    
    // 为粒子添加阴影，在浅色背景上更清晰可见
    ctx.shadowBlur = 5
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 使用半透明的背景色覆盖，产生拖尾效果
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 更新和绘制所有粒子
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i]
      updateParticle(p)
      drawParticle(ctx, p)

      // 移除消失的粒子
      if (
        p.alpha <= 0 ||
        p.x < -100 ||
        p.x > canvas.width + 100 ||
        p.y < -100 ||
        p.y > canvas.height + 100
      ) {
        particlesRef.current.splice(i, 1)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // 初始化时清空背景（透明）
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 开始动画
    animate()

    // 定期发射烟花
    launchIntervalRef.current = setInterval(() => {
      autoLaunchFirework(canvas)
    }, 150)

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (launchIntervalRef.current) {
        clearInterval(launchIntervalRef.current)
      }
    }
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 pointer-events-none z-40"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      
    </motion.div>
  )
}
