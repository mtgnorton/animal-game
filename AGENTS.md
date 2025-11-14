# Repository Guidelines

## 项目结构与模块划分
本仓库基于 Next.js 14 App Router，`app/page.tsx` 挂载 `components/AnimalGame.tsx`，`app/layout.tsx` 与 `globals.css` 承担公共布局和 Tailwind 层。`components/` 放置玩法与特效组件（`AnimalGame` 负责生成、加速与边界计算，`Fireworks` 负责 Canvas 渲染），`utils/` 则存放可复用的 Web Audio 工具与 `SOUNDS.md` 中的声效说明。根目录保存 `tailwind.config.ts`、`postcss.config.js`、`netlify.toml` 等配置，确保本地 `next build` 与部署产物一致。（Structure: Next.js App Router root, components for gameplay, utils for audio helpers, root configs keep builds deterministic.）

## 构建、测试与开发命令
- `npm install`：安装依赖，首次克隆或升级锁文件后运行一次。
- `npm run dev`：启动本地开发服务器（http://localhost:3000），用于迭代动画、音频与触摸反馈。
- `npm run build`：执行生产构建与类型检查；CI/CD 与 Netlify/Vercel 亦调用此命令。
- `npm run start`：在本地复现生产包，发布前进行冒烟验证。
- `npm run lint`：运行 Next/ESLint 规则，任何 warning 均需修复。（Commands: install, dev, build, start, lint.）

## 代码风格与命名
TypeScript 处于 strict 模式，hooks 状态、refs、通用对象都需显式类型；复合逻辑可提取至具名辅助函数。保持两个空格缩进与无分号风格，React 组件使用 PascalCase 默认导出，工具函数采用动词短语如 `playAnimalSound`。样式优先使用 Tailwind 工具类，借助 `@/*` 别名避免相对路径地狱；涉及 `framer-motion`、Canvas 或 Web Audio 的逻辑应添加简短注释以阐明意图。（Style: strict TS, PascalCase components, Tailwind-first, descriptive helpers.）

## 测试指南
当前尚未配置自动化测试；如需补充，建议在同目录创建 `.test.tsx` 或 `.spec.ts`，结合 React Testing Library 验证 UI 状态，再用 Playwright 或 Cypress 进行端到端触摸/音效流程。现阶段仍需人工 QA：分别在桌面与触屏设备确认多动物并发、反弹对称、烟花延迟、音效触发顺序，并记录浏览器控制台输出。每次提交前执行 `npm run lint`，并在 PR 描述中列出测试结果与设备。（Testing: colocated specs, RTL + Playwright, manual multi-device checklist.）

## 提交与 PR 规范
Git 历史遵循 Conventional Commits（示例：`feat: 全部重构`、`fix: 修复动物出现在边缘的问题`），请保持祈使句语气并用英文关键词（必要时可附中文说明）。PR 需概述玩法或 UX 影响、列出运行的命令与测试设备、关联 Issue，并在涉及视觉、动效或音频变更时附截图或录屏。修改 `utils/sounds.ts`、`SOUNDS.md` 或声音资源时，请描述音频上下文激活方式，方便审阅者复现。（Commits: conventional prefixes, detailed PR checklist, attach visuals/audio notes.）

## 安全与配置提示
仅在真实用户手势回调中初始化 `AudioContext`，避免触发浏览器自动播放限制；不要在客户端代码中硬编码密钥，将环境变量写入 `.env.local` 并通过 `next.config.js` 暴露必要前缀。调整 Netlify/Vercel 配置后，务必使用相同环境变量执行 `npm run build` 验证。新增第三方资产或音频素材时，在 `README.md` 或 `SOUNDS.md` 标注来源与许可，并集中放入子目录方便追踪。（Security: gesture-gated AudioContext, secrets stay in .env.local, reproduce builds with consistent env, document asset provenance.）
