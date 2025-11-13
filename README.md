# 🎮 宝宝动物乐园

一个专为16个月大宝宝设计的互动游戏，通过点击屏幕上的可爱动物来学习和娱乐。

## ✨ 特性

- 🐱 **8种可爱动物**：猫、狗、鸟、兔子、鱼、松鼠、乌龟、小虫
- 🎵 **独特叫声**：每种动物都有专属的叫声音效
  - 🐱 猫：高音喵喵
  - 🐶 狗：低音汪汪
  - 🐦 鸟：清脆啾啾
  - 🐰 兔：轻柔吱吱
  - 🐠 鱼：咕噜泡泡
  - 🐿️ 松鼠：快速吱吱
  - 🐢 龟：低沉缓慢
  - 🐛 虫：嗡嗡振翅
- ✨ **粒子动画**：点击时的炫酷粒子效果
- 🎆 **烟花特效**：每3次点击触发满屏烟花庆祝，15个烟花同时绽放，持续4秒
- 📱 **响应式设计**：完美支持手机和iPad
- 🎨 **鲜艳色彩**：高对比度，吸引宝宝注意力
- 👆 **超大触摸区域**：方便小手指点击
- 🎮 **多动物模式**：同时出现3个动物，点击消除

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

1. **多个动物同时出现**：屏幕上会随机出现3个不同的动物在不同位置
2. **点击消除**：点击动物后，动物会消失并播放对应叫声和粒子特效
3. **自动刷新**：当3个动物全部被点击消失后，会自动生成新的3个动物
4. **烟花庆祝**：每点击3次（3, 6, 9, 12...）触发满屏烟花特效，15个烟花同时绽放，持续4秒，期间暂停动物生成
5. **实时统计**：右上角显示总点击次数，左上角显示剩余动物数量

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

### 修改同时出现的动物数量

在 `components/AnimalGame.tsx` 中的 `spawnAnimals` 函数中修改：

```typescript
const selectedAnimals = shuffled.slice(0, 3) // 修改数字3为想要的数量
```

### 添加更多动物

编辑 `components/AnimalGame.tsx` 中的 `animals` 数组：

```typescript
const animals = [
  { id: 'cat', Icon: Cat, sound: 'meow', color: 'bg-orange-400', emoji: '🐱' },
  // 添加更多动物...
]
```

### 调整动物间距

在 `generateRandomPosition` 函数中修改：

```typescript
const minDistancePercent = 25 // 修改这个数值（屏幕宽度的百分比）
```

**说明**：
- 使用百分比单位确保在不同屏幕尺寸下都能正确防止重叠
- 默认值25表示动物之间至少相距屏幕宽度的25%
- 算法会尝试100次找到合适位置，失败后使用预设的安全位置

### 修改烟花触发次数

在 `components/AnimalGame.tsx` 中修改：

```typescript
// 烟花触发频率
if (newCount % 3 === 0) { // 修改数字3为想要的触发频率
  setShowFireworks(true)
  playFireworkSound()
  setTimeout(() => setShowFireworks(false), 4000) // 修改4000为想要的持续时间（毫秒）
}
```

### 修改烟花密度和数量

在 `components/Fireworks.tsx` 中修改：

```typescript
const fireworkCount = 15 // 烟花数量
const particleCount = 30 // 每个烟花的粒子数
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
