// 动物叫声音效系统
// 使用Web Audio API为每种动物生成独特的叫声

let audioContext: AudioContext | null = null

// 初始化音频上下文
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// 猫叫声 - 高音喵喵
function playCatSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(800, ctx.currentTime)
  oscillator.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1)
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
  
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.2)
}

// 狗叫声 - 低音汪汪
function playDogSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(200, ctx.currentTime)
  oscillator.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15)
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
  
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.15)
}

// 鸟叫声 - 清脆啾啾
function playBirdSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(1200, ctx.currentTime)
  oscillator.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 0.05)
  oscillator.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.1)
  
  gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
  
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.15)
}

// 兔子声 - 轻柔吱吱
function playRabbitSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(900, ctx.currentTime)
  oscillator.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.08)
  
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
  
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.1)
}

// 鱼泡泡声 - 咕噜咕噜
function playFishSound(ctx: AudioContext) {
  for (let i = 0; i < 3; i++) {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(300 + i * 50, ctx.currentTime + i * 0.08)
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.1)
    
    oscillator.start(ctx.currentTime + i * 0.08)
    oscillator.stop(ctx.currentTime + i * 0.08 + 0.1)
  }
}

// 松鼠声 - 快速吱吱
function playSquirrelSound(ctx: AudioContext) {
  for (let i = 0; i < 2; i++) {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + i * 0.1)
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.08)
    
    oscillator.start(ctx.currentTime + i * 0.1)
    oscillator.stop(ctx.currentTime + i * 0.1 + 0.08)
  }
}

// 乌龟声 - 低沉缓慢
function playTurtleSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(150, ctx.currentTime)
  oscillator.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.3)
  
  gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
  
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.3)
}

// 虫子声 - 嗡嗡
function playBugSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(400, ctx.currentTime)
  oscillator.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.2)
  
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
  
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.2)
}

// 主音效播放函数
export function playAnimalSound(animalId: string) {
  try {
    const ctx = getAudioContext()
    
    switch (animalId) {
      case 'cat':
        playCatSound(ctx)
        break
      case 'dog':
        playDogSound(ctx)
        break
      case 'bird':
        playBirdSound(ctx)
        break
      case 'rabbit':
        playRabbitSound(ctx)
        break
      case 'fish':
        playFishSound(ctx)
        break
      case 'squirrel':
        playSquirrelSound(ctx)
        break
      case 'turtle':
        playTurtleSound(ctx)
        break
      case 'bug':
        playBugSound(ctx)
        break
      default:
        // 默认音效
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        oscillator.frequency.value = 523.25
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.2)
    }
  } catch (error) {
    console.log('Audio playback not supported:', error)
  }
}

// 烟花音效
export function playFireworkSound() {
  try {
    const ctx = getAudioContext()
    
    // 创建多层烟花爆炸音效
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        // 低频爆炸声
        const bass = ctx.createOscillator()
        const bassGain = ctx.createGain()
        bass.connect(bassGain)
        bassGain.connect(ctx.destination)
        bass.type = 'sine'
        bass.frequency.setValueAtTime(80, ctx.currentTime)
        bass.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3)
        bassGain.gain.setValueAtTime(0.4, ctx.currentTime)
        bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        bass.start(ctx.currentTime)
        bass.stop(ctx.currentTime + 0.3)
        
        // 高频闪光声
        const sparkle = ctx.createOscillator()
        const sparkleGain = ctx.createGain()
        sparkle.connect(sparkleGain)
        sparkleGain.connect(ctx.destination)
        sparkle.type = 'sine'
        sparkle.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime)
        sparkle.frequency.exponentialRampToValueAtTime(3000 + Math.random() * 1000, ctx.currentTime + 0.2)
        sparkleGain.gain.setValueAtTime(0.15, ctx.currentTime)
        sparkleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
        sparkle.start(ctx.currentTime)
        sparkle.stop(ctx.currentTime + 0.2)
      }, i * 200)
    }
  } catch (error) {
    console.log('Firework sound playback not supported:', error)
  }
}

// 保留旧的函数名以保持兼容性
export function playSound() {
  playAnimalSound('default')
}

// 震动反馈
export function triggerVibration() {
  if ('vibrate' in navigator) {
    // 短促的震动反馈，50ms
    navigator.vibrate(50)
    console.log('触发震动反馈')
  } else {
    console.log('设备不支持震动API')
  }
}

// 背景音乐管理
let bgMusicAudio: HTMLAudioElement | null = null
let isBgMusicPlaying = false

export function initBackgroundMusic() {
  if (!bgMusicAudio) {
    bgMusicAudio = new Audio('/resource/Little_Jumping_Frog.mp3')
    bgMusicAudio.loop = true
    bgMusicAudio.volume = 0.3 // 设置音量为30%
    console.log('背景音乐已初始化')
  }
}

export function playBackgroundMusic() {
  try {
    if (!bgMusicAudio) {
      initBackgroundMusic()
    }
    if (bgMusicAudio && !isBgMusicPlaying) {
      bgMusicAudio.play()
      isBgMusicPlaying = true
      console.log('背景音乐开始播放')
    }
  } catch (error) {
    console.log('背景音乐播放失败:', error)
  }
}

export function pauseBackgroundMusic() {
  if (bgMusicAudio && isBgMusicPlaying) {
    bgMusicAudio.pause()
    isBgMusicPlaying = false
    console.log('背景音乐已暂停')
  }
}

export function toggleBackgroundMusic(): boolean {
  if (isBgMusicPlaying) {
    pauseBackgroundMusic()
    return false
  } else {
    playBackgroundMusic()
    return true
  }
}

export function isMusicPlaying(): boolean {
  return isBgMusicPlaying
}
