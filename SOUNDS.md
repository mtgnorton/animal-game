# 🎵 动物叫声说明

本游戏使用 Web Audio API 为每种动物生成独特的叫声模拟。

## 动物叫声特点

### 🐱 小猫 (Cat)
- **音调**: 高音 (800Hz → 600Hz)
- **波形**: 正弦波 (sine)
- **时长**: 0.2秒
- **特点**: 高音下滑，模拟"喵~"的声音

### 🐶 小狗 (Dog)
- **音调**: 低音 (200Hz → 150Hz)
- **波形**: 锯齿波 (sawtooth)
- **时长**: 0.15秒
- **特点**: 低沉有力，模拟"汪!"的声音

### 🐦 小鸟 (Bird)
- **音调**: 清脆高音 (1200Hz ↔ 1500Hz)
- **波形**: 正弦波 (sine)
- **时长**: 0.15秒
- **特点**: 音调上下波动，模拟"啾啾"的鸟鸣

### 🐰 兔子 (Rabbit)
- **音调**: 中高音 (900Hz → 950Hz)
- **波形**: 正弦波 (sine)
- **时长**: 0.1秒
- **特点**: 轻柔短促，模拟小兔子的轻声

### 🐠 小鱼 (Fish)
- **音调**: 中低音 (300Hz, 350Hz, 400Hz)
- **波形**: 正弦波 (sine)
- **时长**: 3个连续泡泡声
- **特点**: 模拟"咕噜咕噜"的泡泡声

### 🐿️ 松鼠 (Squirrel)
- **音调**: 高音 (1000Hz)
- **波形**: 方波 (square)
- **时长**: 2次快速重复
- **特点**: 快速连续的"吱吱"声

### 🐢 乌龟 (Turtle)
- **音调**: 低音 (150Hz → 120Hz)
- **波形**: 三角波 (triangle)
- **时长**: 0.3秒
- **特点**: 低沉缓慢，符合乌龟的慢性格

### 🐛 小虫 (Bug)
- **音调**: 中音 (400Hz → 450Hz)
- **波形**: 锯齿波 (sawtooth)
- **时长**: 0.2秒
- **特点**: 模拟"嗡嗡"的振翅声

## 技术实现

所有音效都使用 Web Audio API 的 `OscillatorNode` 实时生成，无需外部音频文件。

### 优点
- ✅ 无需加载音频文件
- ✅ 体积小，加载快
- ✅ 跨平台兼容性好
- ✅ 可以实时调整参数

### 音效参数说明

- **frequency**: 音调频率（Hz）
- **type**: 波形类型
  - `sine`: 正弦波，柔和圆润
  - `sawtooth`: 锯齿波，明亮有力
  - `square`: 方波，尖锐清脆
  - `triangle`: 三角波，柔和但有特色
- **gain**: 音量控制（0-1）
- **duration**: 声音持续时间

## 自定义音效

如果想修改某个动物的叫声，可以编辑 `utils/sounds.ts` 文件中对应的函数。

例如修改猫叫声：

```typescript
function playCatSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(800, ctx.currentTime) // 起始频率
  oscillator.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1) // 结束频率
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime) // 起始音量
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2) // 淡出
  
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.2)
}
```

## 使用真实音频文件

如果想使用真实的动物叫声录音，可以：

1. 准备音频文件（MP3/WAV格式）
2. 放在 `public/sounds/` 目录
3. 使用 `Howler.js` 或 `Audio` API 加载播放

示例：
```typescript
const catSound = new Audio('/sounds/cat.mp3')
catSound.play()
```
