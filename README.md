# 🎮 追动物游戏

一个专为16个月大宝宝设计的互动游戏，通过点击屏幕上跑动的小动物来锻炼反应能力和手眼协调。

## ✨ 特性

- 🐰 **8种可爱动物**：兔子、猫、狗、鸟、鱼、松鼠、乌龟、小虫，每关随机切换
- 🏃 **智能反弹**：碰到屏幕边缘自动改变方向
- 🎵 **独特叫声**：每种动物都有专属的叫声音效
- 🎆 **真实烟花特效**：每次点击触发绚丽烟花庆祝，20个烟花分批绽放，持续2秒
- ⚡ **速度递增**：每次点击后动物速度加快15%，难度逐渐提升
- 🎲 **随机切换**：每次点击后出现不同的动物，保持新鲜感
- 📱 **响应式设计**：完美支持手机和iPad
- 🎨 **鲜艳色彩**：高对比度，吸引宝宝注意力
- 👆 **超大触摸区域**：方便小手指点击
- 🎮 **无限循环**：烟花结束后新动物重新出现，循环往复

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
npm start
```

## 📦 部署到 Vercel

最简单的部署方式是使用 [Vercel Platform](https://vercel.com/new)。

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 点击部署

详细信息请查看 [Next.js deployment documentation](https://nextjs.org/docs/deployment)。

## 🎯 游戏玩法

1. **动物奔跑**：小动物在屏幕内自由奔跑，碰到边缘会自动反弹改变方向
2. **点击动物**：点击跑动的动物，动物会消失并播放对应的叫声
3. **烟花庆祝**：每次点击都会触发满屏烟花特效，20个烟花分批绽放，持续2秒
4. **速度递增**：烟花结束后出现新的动物，速度比之前更快（每次增加15%）
5. **动物切换**：每次点击后会随机出现不同的动物（8种动物随机切换）
6. **无限循环**：游戏会一直循环，动物越来越快，挑战宝宝的反应速度
7. **实时统计**：右上角显示总点击次数，左上角显示当前速度倍数

## 🛠️ 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **图标**：Lucide React
- **音效**：Web Audio API

## 📱 设备支持

- ✅ iPhone / iPad
- ✅ Android 手机 / 平板
- ✅ 桌面浏览器

## 🎨 自定义

### 添加或修改动物

在 `components/AnimalGame.tsx` 中修改动物配置：

```typescript
const animals = [
  { id: 'rabbit', emoji: '🐰', color: 'bg-pink-400', sound: 'rabbit' },
  // 添加更多动物...
]
```

### 修改动物初始速度

在 `components/AnimalGame.tsx` 中修改初始速度：

```typescript
const [animalVelocity, setAnimalVelocity] = useState({ x: 0.5, y: 0.4 }) // 修改x和y值
```

### 调整速度增长幅度

在 `handleAnimalClick` 函数中修改：

```typescript
setSpeed(prev => prev + 0.15) // 修改0.15为想要的速度增长值（当前为15%）
```

### 修改烟花持续时间

在 `components/AnimalGame.tsx` 中修改：

```typescript
setTimeout(() => {
  setShowFireworks(false)
  // ...
}, 2000) // 修改2000为想要的持续时间（毫秒）
```

### 修改烟花密度和数量

在 `components/Fireworks.tsx` 中修改：

```typescript
const fireworkCount = 20 // 烟花数量
const particleCount = 40 // 每个烟花的粒子数
const delay = (i % 5) * 0.15 // 分批延迟，每批5个
```

### 调整边界检测范围

在移动逻辑中修改边界：

```typescript
const margin = 8 // 修改边界距离（屏幕宽度的百分比）
```

## 📝 注意事项

- 游戏使用 Web Audio API 实时生成音效，每种动物都有独特的叫声
- 首次点击可能需要用户交互才能激活音频
- 建议在真实设备上测试触摸体验和音效
- 音效详细说明请查看 [SOUNDS.md](./SOUNDS.md)
- 如需使用真实动物叫声录音，可参考 SOUNDS.md 中的说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
