# FutureSelf Design System

> 面向大学生的自主成长陪伴 AI Agent — 设计语言体系
>
> 版本：v1.0.0
> 设计哲学：**「预测你的需求，而不是等待你的请求」**

---

## 目录

1. [设计哲学](#1-设计哲学)
2. [颜色系统](#2-颜色系统)
3. [字体系统](#3-字体系统)
4. [间距系统](#4-间距系统)
5. [圆角系统](#5-圆角系统)
6. [阴影系统](#6-阴影系统)
7. [整体布局规范](#7-整体布局规范)
8. [页面布局规范](#8-页面布局规范)
9. [按钮规范](#9-按钮规范)
10. [输入框规范](#10-输入框规范)
11. [卡片规范](#11-卡片规范)
12. [导航栏规范](#12-导航栏规范)
13. [图标规范](#13-图标规范)
14. [AI 头像规范](#14-ai-头像规范)
15. [AI 消息规范](#15-ai-消息规范)
16. [动画规范](#16-动画规范)
17. [PC 端响应式规范](#17-pc-端响应式规范)
18. [组件命名规范](#18-组件命名规范)

---

## 1. 设计哲学

### 1.1 三大设计原则

| 原则 | 含义 | 设计体现 |
|------|------|----------|
| **克制** | 宁可少，不可多。每个元素必须有存在的理由 | 单一主色调，极简布局，大量留白 |
| **温度** | AI 不是冰冷的机器，是陪伴者 | 柔和的蓝白渐变，弹性动画，人性化文案 |
| **呼吸** | 界面让用户感到轻松，而非压迫 | 宽松间距，渐进式信息展示，微妙的深度层次 |

### 1.2 设计关键词

```
现代 · 科技感 · 年轻化 · 简约 · 高级 · 有 AI 产品气质
```

### 1.3 灵感来源

| 产品 | 借鉴方向 |
|------|----------|
| **ChatGPT** | AI 存在感设计、对话界面的克制美学、Emotive Point 概念 |
| **Notion** | 字体纪律、内容优先、边框驱动的层级、4px 网格 |
| **Linear** | 极端的色彩克制、表面阶梯深度模式、负字间距标题 |
| **OriginOS** | 光效深度系统、弹簧动画、磨砂玻璃材质、自然隐喻 |
| **Fluent** | Token 化设计系统、Acrylic/Mica 材质、连接动画 |

### 1.4 核心差异化视觉策略

> **「AI 主动洞见」是产品核心功能，其视觉权重必须高于其他所有元素。**
>
> 当 AI 主动推送一条洞察时，它应该让用户感觉「AI 正在思考并关心我」——这个感受必须通过设计传达。

---

## 2. 颜色系统

### 2.1 设计理念

整个色彩系统命名为 **「Horizon Light」** ——灵感来自清晨地平线的第一缕光。

- 主色调是温暖的靛蓝色 —— 不像企业蓝那样冰冷，也不像儿童蓝那样幼稚
- 辅色是清透的天空蓝 —— 传递开放、自由、成长的意象
- 中性色采用偏冷的灰 —— 与蓝色系天然和谐，同时保持现代感
- 所有颜色通过 CSS 变量暴露，支持未来暗色模式扩展

### 2.2 品牌色 Brand Colors

```css
:root {
  /* ===== 品牌主色 ===== */
  --fs-brand-50:  #EEF1FF;   /* 最浅 — 微妙背景 */
  --fs-brand-100: #DDE3FF;   /* 浅 — hover 背景 */
  --fs-brand-200: #B8C4FF;   /* 浅中 — 选中态 */
  --fs-brand-300: #8B9EFF;   /* 中浅 — 边框/装饰 */
  --fs-brand-400: #6B82FF;   /* 中 — 次要操作 */
  --fs-brand-500: #4F6EF7;   /* ⭐ 主色 — 核心品牌色 */
  --fs-brand-600: #3D56D6;   /* 中深 — hover 态 */
  --fs-brand-700: #2D42B5;   /* 深 — active 态 */
  --fs-brand-800: #1F3094;   /* 更深 — 文字链接 */
  --fs-brand-900: #142073;   /* 最深 — 极少使用 */
}
```

**主色使用规则：**
- `--fs-brand-500` 仅用于：主按钮、核心图标、AI 头像、关键交互元素
- 同一视图中，主色元素不超过 3 个
- 大块背景绝不用主色填充

### 2.3 AI 渐变色 AI Gradients

AI 相关元素使用专属渐变，区别于普通品牌色：

```css
:root {
  /* AI 主渐变 — 按钮、头像、高亮 */
  --fs-ai-gradient: linear-gradient(135deg, #4F6EF7 0%, #7B93FF 50%, #9DB5FF 100%);

  /* AI 辉光 — 卡片、消息、思考态 */
  --fs-ai-glow: radial-gradient(ellipse at center, rgba(79, 110, 247, 0.12) 0%, transparent 70%);

  /* AI 脉冲 — 思考动画 */
  --fs-ai-pulse: radial-gradient(circle, rgba(79, 110, 247, 0.3) 0%, rgba(79, 110, 247, 0) 60%);
}
```

### 2.4 中性色 Neutral Scale

基于 Slate 色系，带微蓝色相偏移：

```css
:root {
  --fs-neutral-0:   #FFFFFF;   /* 纯白 — 卡片表面 */
  --fs-neutral-50:  #F8F9FC;   /* 页背景 — 极微蓝白 */
  --fs-neutral-100: #F0F2F8;   /* 浅背景 — section 区分 */
  --fs-neutral-200: #E3E6EF;   /* 边框 — 分割线 */
  --fs-neutral-300: #CDD2DF;   /* 禁用态边框 */
  --fs-neutral-400: #A1A8BA;   /* 占位文字 */
  --fs-neutral-500: #747D94;   /* 次要文字 */
  --fs-neutral-600: #555D72;   /* 次要正文 */
  --fs-neutral-700: #3A4055;   /* 正文文字 */
  --fs-neutral-800: #222639;   /* 标题文字 */
  --fs-neutral-900: #131624;   /* 强调文字 — 极少用 */
}
```

### 2.5 语义色 Semantic Colors

```css
:root {
  /* Success — 柔和翠绿，不用刺眼的纯绿 */
  --fs-success-50:  #EDFCF5;
  --fs-success-500: #22C55E;
  --fs-success-700: #15803D;

  /* Warning — 温暖琥珀 */
  --fs-warning-50:  #FFF9EB;
  --fs-warning-500: #F59E0B;
  --fs-warning-700: #B45309;

  /* Error — 柔和珊瑚，不用攻击性纯红 */
  --fs-error-50:  #FFF0F0;
  --fs-error-500: #EF4444;
  --fs-error-700: #B91C1C;

  /* Info — 沿用品牌蓝 */
  --fs-info-50:  #EEF1FF;
  --fs-info-500: #4F6EF7;
  --fs-info-700: #2D42B5;
}
```

### 2.6 表面色 Surface Tokens

使用 Linear 风格的「表面阶梯」而非 Material 的阴影层级：

```css
:root {
  --fs-surface-page:      var(--fs-neutral-50);    /* 页面基底 */
  --fs-surface-card:      var(--fs-neutral-0);     /* 卡片/容器 */
  --fs-surface-elevated:  var(--fs-neutral-0);     /* 悬浮层（配合阴影） */
  --fs-surface-overlay:   rgba(255, 255, 255, 0.85); /* 毛玻璃覆盖层 */
  --fs-surface-backdrop:  rgba(19, 22, 36, 0.4);   /* 模态框背景 */
}
```

### 2.7 颜色使用比例

```
页背景色 (--fs-neutral-50)    ████████████████████████  ~80%
卡片/容器白 (--fs-neutral-0)  ████████████              ~12%
品牌主色 (--fs-brand-500)     ██                         ~3%
AI 渐变                       █                          ~2%
语义色                        █                          ~1%
其他                          █                          ~2%
```

---

## 3. 字体系统

### 3.1 字体族

```css
:root {
  /* 主字体栈 — Inter 用于拉丁/数字，系统字体用于中文 */
  --fs-font-sans: 'Inter', 'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;

  /* 等宽字体 — 代码/数据 */
  --fs-font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;

  /* 数字专用 — 表格/统计 */
  --fs-font-numeric: 'Inter', 'SF Pro Display', sans-serif;
}
```

### 3.2 字体大小标度 Type Scale

基于 **4px 基线网格**，采用 Major Third (1.25) 比例：

| Token | 大小 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `--fs-text-xs` | 12px | 1.5 (18px) | 400 | 辅助标注、时间戳 |
| `--fs-text-sm` | 14px | 1.5 (21px) | 400 | 次要正文、标签 |
| `--fs-text-base` | 16px | 1.6 (25.6px) | 400 | **正文主体** |
| `--fs-text-lg` | 18px | 1.6 (28.8px) | 400 | 强调正文、AI 消息 |
| `--fs-text-xl` | 20px | 1.5 (30px) | 500 | 小标题 |
| `--fs-text-2xl` | 24px | 1.4 (33.6px) | 600 | 卡片标题 |
| `--fs-text-3xl` | 30px | 1.3 (39px) | 600 | 页面标题 |
| `--fs-text-4xl` | 38px | 1.2 (45.6px) | 700 | 英雄标题 |
| `--fs-text-5xl` | 48px | 1.1 (52.8px) | 700 | Landing 大标题 |

### 3.3 字重

```css
:root {
  --fs-font-light:    300;   /* 极少使用 — 大尺寸装饰 */
  --fs-font-normal:   400;   /* 正文 */
  --fs-font-medium:   500;   /* 强调正文、按钮文字 */
  --fs-font-semibold: 600;   /* 标题 */
  --fs-font-bold:     700;   /* 大标题、Hero */
}
```

### 3.4 排版规则

```
✅ 必须遵守
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 全站仅使用 --fs-font-sans 和 --fs-font-mono 两种字体族
• 正文始终 16px / 1.6 行高（阅读舒适性）
• 标题字间距：负 0.02em（参考 Linear，让标题更紧凑有力）
• 行高必须使用无单位数值（如 1.5），不写 px
• 正文段落最大宽度：680px（最佳阅读宽度）
• 中文正文每行不超过 40 字

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不在正文中使用 14px 以下字号
• 不使用超过 2 个字重的组合
• 不使用全大写（英文场景）
• 不修改默认字间距（除标题外）
```

---

## 4. 间距系统

### 4.1 基网格

**所有间距基于 4px 网格。** 这是 Notion 和 Linear 共同的选择。

```css
:root {
  --fs-space-0:   0;
  --fs-space-1:   4px;     /* 最小间距 — 紧密元素 */
  --fs-space-2:   8px;     /* 图标与文字间距 */
  --fs-space-3:   12px;    /* 组件内边距 */
  --fs-space-4:   16px;    /* 标准内边距 ⭐ */
  --fs-space-5:   20px;    /* 卡内区块间距 */
  --fs-space-6:   24px;    /* 卡片内边距 ⭐ */
  --fs-space-8:   32px;    /* Section 间距 */
  --fs-space-10:  40px;    /* 大区块间距 */
  --fs-space-12:  48px;    /* 页面区块分隔 */
  --fs-space-16:  64px;    /* 页面间大分隔 */
  --fs-space-20:  80px;    /* Hero 区域上下留白 */
  --fs-space-24:  96px;    /* 极少使用 — 超大留白 */
}
```

### 4.2 间距使用规则

```
组件内部：  fs-space-2 ~ fs-space-4   (8-16px)
卡片之间：  fs-space-4 ~ fs-space-6   (16-24px)
区块之间：  fs-space-8 ~ fs-space-12  (32-48px)
页面边缘：  fs-space-6 ~ fs-space-10  (24-40px，按屏幕尺寸)
```

### 4.3 内容区域最大宽度

```css
:root {
  --fs-content-sm:   640px;   /* 阅读型内容（对话、文章） */
  --fs-content-md:   768px;   /* 标准内容 */
  --fs-content-lg:   960px;   /* 宽内容（Dashboard） */
  --fs-content-xl:   1200px;  /* 最大内容宽度 */
}
```

---

## 5. 圆角系统

### 5.1 圆角标度

采用连续曲线风格（Continuous Curve），避免生硬的圆弧：

| Token | 值 | Apple 连续曲线等效 | 用途 |
|-------|------|------|------|
| `--fs-radius-none` | 0 | — | 表格、分割线 |
| `--fs-radius-xs` | 4px | — | 标签、徽章、代码块 |
| `--fs-radius-sm` | 6px | — | 小按钮、输入框内部 |
| `--fs-radius-md` | 10px | — | 按钮、输入框 ⭐ 默认 |
| `--fs-radius-lg` | 14px | — | 卡片、面板、Modal |
| `--fs-radius-xl` | 20px | — | 大卡片、特色面板 |
| `--fs-radius-full` | 9999px | — | 药丸形状、开关、头像 |

### 5.2 圆角使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 按钮/输入框：统一使用 --fs-radius-md（10px）
• 卡片：统一使用 --fs-radius-lg（14px）
• AI 消息气泡：用户消息 16px，AI 消息 16px（两者对称）
• AI 头像：--fs-radius-full 圆形
• 同一组件内，内外圆角差值保持在 2-4px

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用 2px 以下的圆角（太尖锐，不现代）
• 不同层级的卡片不使用不同的圆角值
• 不混合直角和圆角（要么全圆，要么统一）
```

---

## 6. 阴影系统

### 6.1 设计理念

> 主推 **表面阶梯（Surface Ladder）** 模式，阴影仅用于必要的浮层元素。
> 整体克制，不使用大面积弥散阴影。

### 6.2 阴影 Token（Fluent 风格双阴影）

```css
:root {
  /* Level 0 — 无阴影（默认） */
  --fs-shadow-none: none;

  /* Level 1 — 微妙悬浮 — hover 卡片 */
  --fs-shadow-sm: 0 1px 2px rgba(19, 22, 36, 0.04), 0 1px 3px rgba(19, 22, 36, 0.06);

  /* Level 2 — 标准浮层 — 下拉菜单、Tooltip ⭐ 最常用 */
  --fs-shadow-md: 0 2px 4px rgba(19, 22, 36, 0.04), 0 4px 12px rgba(19, 22, 36, 0.08);

  /* Level 3 — 明显浮层 — Modal、Dialog */
  --fs-shadow-lg: 0 4px 8px rgba(19, 22, 36, 0.04), 0 8px 24px rgba(19, 22, 36, 0.12);

  /* Level 4 — 最高层级 — Drawer、Toast */
  --fs-shadow-xl: 0 8px 16px rgba(19, 22, 36, 0.04), 0 16px 48px rgba(19, 22, 36, 0.16);
}
```

### 6.3 特殊阴影

```css
:root {
  /* AI 辉光 — 代替阴影，用于 AI 卡片/消息 */
  --fs-shadow-ai: 0 0 0 1px rgba(79, 110, 247, 0.1), 0 4px 16px rgba(79, 110, 247, 0.08);

  /* 磨砂玻璃底座 — Modal 背景 */
  --fs-shadow-backdrop: 0 0 0 1px rgba(19, 22, 36, 0.05), 0 16px 64px rgba(19, 22, 36, 0.2);
}
```

### 6.4 阴影使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 默认元素无阴影，靠表面色区分
• 仅 hover/active 态使用 --fs-shadow-sm
• 浮层使用 --fs-shadow-md（最大使用量限制：每屏 ≤ 1 个浮层）
• AI 主动洞见卡片使用专属 --fs-shadow-ai

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不在默认态卡片上使用阴影
• 不叠加使用阴影（如同时 shadow + border 做分割）
• 不使用 Material Design 风格的 8dp+ 大阴影
• 阴影不包含饱和色（纯灰黑色 + 透明度）
```

---

## 7. 整体布局规范

### 7.1 应用外壳

FutureSelf 的布局结构为 **固定两栏式**：

```
┌──────────────────────────────────────────────────────┐
│  Sidebar          │         Main Content             │
│  (Navigation)     │                                  │
│                   │                                  │
│  — Logo           │   ┌──────────────────────────┐   │
│  — Nav Items      │   │                          │   │
│  — User Info      │   │    Page Content           │   │
│                   │   │    (max-width: 960px)     │   │
│   w: 240px        │   │                          │   │
│                   │   │                          │   │
│                   │   └──────────────────────────┘   │
│                   │                                  │
└──────────────────────────────────────────────────────┘
```

### 7.2 布局 Token

```css
:root {
  --fs-sidebar-width:         240px;    /* 侧边栏宽度 */
  --fs-sidebar-collapsed:     72px;     /* 折叠后宽度 */
  --fs-topbar-height:         0px;      /* 无顶栏设计（v1.0） */
  --fs-content-max:           960px;    /* 主内容最大宽度 */
  --fs-page-padding-x:        32px;     /* 页面水平内边距 */
  --fs-page-padding-y:        32px;     /* 页面垂直内边距 */
}
```

### 7.3 布局规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 侧边栏固定宽度 240px，不随内容变化
• 主内容区域居中，max-width: 960px
• 页面内容左对齐（非居中），保证阅读起点一致
• 所有页面共享相同的水平内边距

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用三栏布局
• 不浮动元素脱离正常流（除非 Tooltip/Dropdown）
• 内容区域不超出 960px
```

---

## 8. 页面布局规范

### 8.1 页面模板

所有页面遵循统一模板：

```
┌─────────────────────────────────────────────────┐
│  Page Header                                    │
│  ├── 页面标题 (--fs-text-3xl, 600 weight)       │
│  ├── 副标题/描述 (--fs-text-sm, muted)           │
│  └── 页面级操作按钮（如有，最多 1 个主按钮）      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Page Body                                      │
│  ├── Section A: 卡片网格 / 列表 / 内容区         │
│  ├── Section B: ...                             │
│  └── Section C: ...                             │
│                                                 │
│  区块间距：--fs-space-8 (32px)                   │
│  段落宽度：max 680px（阅读型）                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 8.2 页面类型分类

| 类型 | 特征 | 最大宽度 | 示例页面 |
|------|------|----------|----------|
| **Dashboard** | 卡片网格、多区块 | 960px | 首页仪表盘 |
| **阅读型** | 连续文本、对话流 | 680px | AI 对话、文章 |
| **表单型** | 居中表单 | 480px | 设置、引导流程 |
| **列表型** | 纵向滚动列表 | 768px | 成长记录、习惯列表 |

### 8.3 页面标题层级

```
页面标题 (Page Title)     — 每页只有 1 个，30px/600
├── 区块标题 (Section)    — 24px/600
├── 卡片标题 (Card)       — 20px/500
└── 内容标题 (Content)    — 18px/500
```

---

## 9. 按钮规范

### 9.1 按钮层级

FutureSelf 使用 **4 级按钮体系**：

| 层级 | 视觉权重 | 使用场景 | 每屏限制 |
|------|----------|----------|----------|
| **Primary** | 最高 | 页面核心操作 | ≤ 1 个/屏 |
| **Secondary** | 中等 | 次要操作 | ≤ 3 个/屏 |
| **Tertiary/Ghost** | 低 | 不打断主流程的操作 | 不限 |
| **Icon Only** | 最低 | 工具栏、列表操作 | 不限 |

### 9.2 按钮规格

```css
/* ===== Primary Button ===== */
.fs-btn-primary {
  height:           44px;                    /* 固定高度 */
  padding:          0 24px;                  /* 水平内边距 */
  font-size:        16px;                    /* 正文大小 */
  font-weight:      500;                     /* Medium */
  color:            #FFFFFF;                 /* 白色文字 */
  background:       var(--fs-ai-gradient);   /* AI 渐变背景 */
  border:           none;
  border-radius:    var(--fs-radius-md);     /* 10px */
  cursor:           pointer;
  transition:       all 200ms ease;
}
.fs-btn-primary:hover  { opacity: 0.9; transform: translateY(-1px); box-shadow: var(--fs-shadow-sm); }
.fs-btn-primary:active { opacity: 0.85; transform: translateY(0); }
.fs-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

/* ===== Secondary Button ===== */
.fs-btn-secondary {
  height:           44px;
  padding:          0 24px;
  font-size:        16px;
  font-weight:      500;
  color:            var(--fs-neutral-700);
  background:       var(--fs-neutral-100);
  border:           1px solid var(--fs-neutral-200);
  border-radius:    var(--fs-radius-md);
  cursor:           pointer;
  transition:       all 200ms ease;
}
.fs-btn-secondary:hover  { background: var(--fs-neutral-200); }
.fs-btn-secondary:active { background: var(--fs-neutral-300); }

/* ===== Tertiary (Ghost) Button ===== */
.fs-btn-ghost {
  height:           40px;
  padding:          0 16px;
  font-size:        14px;
  font-weight:      500;
  color:            var(--fs-neutral-600);
  background:       transparent;
  border:           none;
  border-radius:    var(--fs-radius-md);
  cursor:           pointer;
  transition:       all 150ms ease;
}
.fs-btn-ghost:hover  { background: var(--fs-neutral-100); color: var(--fs-neutral-800); }
.fs-btn-ghost:active { background: var(--fs-neutral-200); }

/* ===== Icon Button ===== */
.fs-btn-icon {
  width:            40px;
  height:           40px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  color:            var(--fs-neutral-500);
  background:       transparent;
  border:           none;
  border-radius:    var(--fs-radius-md);
  cursor:           pointer;
  transition:       all 150ms ease;
}
.fs-btn-icon:hover  { background: var(--fs-neutral-100); color: var(--fs-neutral-700); }
```

### 9.3 按钮尺寸变体

| Size | 高度 | 水平内边距 | 字号 | 用途 |
|------|------|-----------|------|------|
| **lg** | 52px | 0 32px | 18px | Landing CTA、重要操作 |
| **md** ⭐ | 44px | 0 24px | 16px | 默认，所有常规操作 |
| **sm** | 36px | 0 16px | 14px | 表格操作、卡片内操作 |
| **xs** | 28px | 0 12px | 12px | 标签、Filter、Chip |

### 9.4 按钮使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 每屏只允许 1 个 Primary Button
• 按钮文字动词 + 名词（如「创建目标」「查看详情」）
• 按钮文字 2-4 个字
• 加载态：按钮文字替换为「...」+ 禁用交互
• 主按钮使用 AI 渐变背景，不使用纯色

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用纯文字按钮（无背景无边框）——无法识别为可点击元素
• 同一行不放置超过 3 个按钮
• 不使用直角按钮
• 按钮不换行
```

---

## 10. 输入框规范

### 10.1 输入框类型

| 类型 | 用途 | 高度 |
|------|------|------|
| **Text Input** | 单行文字 | 44px |
| **Textarea** | 多行文字 | min 100px |
| **Search** | 搜索 | 40px |
| **Select** | 下拉选择 | 44px |

### 10.2 输入框规格

```css
.fs-input {
  height:           44px;
  padding:          0 14px;
  font-size:        16px;
  font-family:      var(--fs-font-sans);
  color:            var(--fs-neutral-800);
  background:       var(--fs-neutral-0);
  border:           1.5px solid var(--fs-neutral-200);
  border-radius:    var(--fs-radius-md);   /* 10px */
  outline:          none;
  transition:       border-color 150ms ease, box-shadow 150ms ease;
}

/* 状态 */
.fs-input::placeholder         { color: var(--fs-neutral-400); }
.fs-input:hover                { border-color: var(--fs-neutral-300); }
.fs-input:focus                { border-color: var(--fs-brand-400); box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1); }
.fs-input:disabled             { background: var(--fs-neutral-100); opacity: 0.6; cursor: not-allowed; }
.fs-input.error                { border-color: var(--fs-error-500); }
.fs-input.error:focus          { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
```

### 10.3 输入框使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 每个输入框必须有 Label（除非搜索框有 icon）
• Label 在输入框上方，间距 6px
• 错误信息在输入框下方，间距 4px
• Focus 态必须有明显的蓝色光晕（品牌识别）
• 输入框宽度至少 200px

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用 Material Design 的 underline 风格
• 不改变 focus 态的颜色（固定品牌蓝）
• 同一表单不超过 8 个输入项
```

---

## 11. 卡片规范

### 11.1 卡片类型

FutureSelf 的卡片分为三类：

| 类型 | 视觉特征 | 用途 |
|------|----------|------|
| **Standard Card** | 白底 + 极浅灰色边框 | 常规内容容器 |
| **AI Insight Card** | 白底 + AI 辉光边框 + 微妙蓝色渐变 | AI 主动推送的洞见 ⭐ 核心 |
| **Interactive Card** | 白底 + hover 上浮 + 阴影 | 可点击导航的卡片 |

### 11.2 Standard Card

```css
.fs-card {
  padding:          24px;                   /* --fs-space-6 */
  background:       var(--fs-neutral-0);
  border:           1px solid var(--fs-neutral-200);
  border-radius:    var(--fs-radius-lg);    /* 14px */
  transition:       border-color 150ms ease;
}
```

### 11.3 AI Insight Card（核心功能卡片）

```css
.fs-card-ai {
  padding:          24px;
  background:       linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%);
  border:           1px solid rgba(79, 110, 247, 0.15);
  border-radius:    var(--fs-radius-lg);
  box-shadow:       var(--fs-shadow-ai);
  position:         relative;
  transition:       all 300ms ease;
}
/* AI 卡片顶部辉光条 */
.fs-card-ai::before {
  content:          '';
  position:         absolute;
  top:              0;
  left:             20px;
  right:            20px;
  height:           2px;
  background:       var(--fs-ai-gradient);
  border-radius:    0 0 2px 2px;
  opacity:          0.7;
}
.fs-card-ai:hover {
  box-shadow:       0 0 0 1px rgba(79, 110, 247, 0.2), 0 6px 24px rgba(79, 110, 247, 0.12);
  transform:        translateY(-1px);
}
```

### 11.4 Interactive Card

```css
.fs-card-interactive {
  padding:          24px;
  background:       var(--fs-neutral-0);
  border:           1px solid var(--fs-neutral-200);
  border-radius:    var(--fs-radius-lg);
  cursor:           pointer;
  transition:       all 200ms ease;
}
.fs-card-interactive:hover {
  border-color:     var(--fs-neutral-300);
  box-shadow:       var(--fs-shadow-sm);
  transform:        translateY(-2px);
}
```

### 11.5 卡片使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• AI Insight Card 必须是全站视觉权重最高的卡片
• 卡片标题 24px/600，正文 16px/400
• 卡片内部间距 24px
• 同一网格中的卡片高度必须一致

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用超过 3 种卡片风格
• 不使用纯色背景卡片（如 blue bg card）
• 卡片不嵌套卡片
• 卡片不包含超过 1 个主操作按钮
```

---

## 12. 导航栏规范

### 12.1 侧边栏结构

```
┌─────────────────┐
│  Logo + Name    │  ← 固定顶部
│─────────────────│
│  ● Dashboard    │  ← 导航项（含图标 + 文字）
│  ○ Growth       │
│  ○ Companion    │  ← 主要导航区
│  ○ Profile      │
│─────────────────│
│                 │
│  (spacer)       │  ← 弹性空白区
│                 │
│─────────────────│
│  AI Status      │  ← AI 状态指示器
│  User Avatar    │  ← 用户头像 + 名称
└─────────────────┘
  w: 240px, h: 100vh
```

### 12.2 导航栏规格

```css
.fs-sidebar {
  width:            var(--fs-sidebar-width);        /* 240px */
  height:           100vh;
  position:         fixed;
  left:             0;
  top:              0;
  display:          flex;
  flex-direction:   column;
  padding:          20px 12px;
  background:       var(--fs-neutral-0);
  border-right:     1px solid var(--fs-neutral-200);
  z-index:          100;
}

/* 导航项 */
.fs-nav-item {
  display:          flex;
  align-items:      center;
  gap:              10px;                           /* 图标-文字间距 */
  height:           44px;
  padding:          0 12px;
  font-size:        15px;
  font-weight:      500;
  color:            var(--fs-neutral-600);
  border-radius:    var(--fs-radius-md);            /* 10px */
  cursor:           pointer;
  transition:       all 150ms ease;
}
.fs-nav-item:hover        { background: var(--fs-neutral-100); color: var(--fs-neutral-800); }
.fs-nav-item.active       { background: var(--fs-brand-50); color: var(--fs-brand-600); }
.fs-nav-item.active::before {
  content:          '';
  position:         absolute;
  left:             0;
  top:              50%;
  transform:        translateY(-50%);
  width:            3px;
  height:           20px;
  background:       var(--fs-brand-500);
  border-radius:    0 3px 3px 0;
}
```

### 12.3 导航栏使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 主导航项 4-6 个，超过 6 个需重新组织
• 导航图标使用 20px 线性图标
• 激活态：品牌色浅背景 + 左侧指示条
• 用户信息固定在底部

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用多级展开导航
• 不使用彩色图标（非激活态统一灰色）
• 侧边栏不出现滚动条
• 折叠后图标不丢失含义
```

---

## 13. 图标规范

### 13.1 图标库

| 用途 | 图标集 | 风格 |
|------|--------|------|
| **UI 图标** | Lucide Icons | 线性、圆角、现代 |
| **AI 专属图标** | 自定义 SVG | 品牌化、可动画化 |
| **品牌 Logo** | 自定义 SVG | 见下文 Logo 规范 |

### 13.2 图标尺寸

| 场景 | 尺寸 | 描边宽度 |
|------|------|----------|
| 导航图标 | 20px | 2px |
| 按钮内图标 | 18px | 2px |
| 卡片内图标 | 24px | 1.5px |
| 装饰性大图标 | 48px+ | 1.5px |
| AI 头像内图标 | 按比例缩放 | 自定义 |

### 13.3 图标颜色

```css
/* 跟随文字颜色，不单独设色 */
.fs-icon-default   { color: var(--fs-neutral-500); }   /* 默认 */
.fs-icon-active    { color: var(--fs-brand-500); }      /* 激活/选中 */
.fs-icon-muted     { color: var(--fs-neutral-400); }    /* 禁用/辅助 */
.fs-icon-danger    { color: var(--fs-error-500); }      /* 危险操作 */
```

### 13.4 图标使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• UI 图标全部使用 Lucide Icons（跨平台统一）
• 图标颜色跟随其关联文字颜色
• 图标必须有 aria-label
• 可点击图标最小触摸区域：40×40px

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不混合使用多套图标集
• 不单独使用彩色图标（除品牌 Logo 外）
• 不使用填充风格（filled）图标 — 全站线性
```

---

## 14. AI 头像规范

### 14.1 设计理念

FutureSelf 的 AI 头像不是简单的 logo，而是 **AI 存在的视觉锚点**。
它应该让用户一眼感知到 AI 的「状态」。

灵感来源：
- ChatGPT 的「Emotive Point」—— AI 聆听/思考的脉冲动画
- OriginOS 的「AI 光效」—— 流动粒子光效
- 两者结合：**几何形态 + 有机动效**

### 14.2 AI 头像形态

```
┌──────────────────────────────────────────┐
│  形态          │  视觉                    │
├──────────────────────────────────────────┤
│  默认态        │  品牌色圆形 + 中心抽象符号  │
│  思考态        │  外围脉冲光环缓慢扩张收缩    │
│  主动洞见      │  外围辉光 + 顶部蓝色光晕条   │
│  离线/睡眠     │  去饱和度 + 无动效          │
│  有未读洞见    │  右上角小蓝点徽章           │
└──────────────────────────────────────────┘
```

### 14.3 AI 头像规格

```css
/* 基础 AI 头像 */
.fs-avatar-ai {
  width:            40px;
  height:           40px;
  border-radius:    var(--fs-radius-full);
  background:       var(--fs-ai-gradient);
  display:          flex;
  align-items:      center;
  justify-content:  center;
  position:         relative;
  flex-shrink:      0;
}

/* 思考态动画 */
.fs-avatar-ai.thinking::after {
  content:          '';
  position:         absolute;
  inset:            -4px;
  border-radius:    inherit;
  background:       transparent;
  border:           2px solid rgba(79, 110, 247, 0.3);
  animation:        ai-pulse 2s ease-in-out infinite;
}

/* 未读洞见徽章 */
.fs-avatar-ai .badge {
  position:         absolute;
  top:              -2px;
  right:            -2px;
  width:            10px;
  height:           10px;
  background:       var(--fs-brand-500);
  border:           2px solid white;
  border-radius:    var(--fs-radius-full);
}

@keyframes ai-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%      { transform: scale(1.15); opacity: 0; }
}
```

### 14.4 AI 头像尺寸变体

| Size | 尺寸 | 使用场景 |
|------|------|----------|
| **sm** | 32px | 列表内、消息内 |
| **md** ⭐ | 40px | 导航栏、卡片 |
| **lg** | 56px | 对话头部、AI 介绍 |
| **xl** | 80px | 欢迎页、Onboarding |

---

## 15. AI 消息规范

### 15.1 设计理念

AI 消息需要让用户感觉 **«AI 正在对我说话»**，而不是 «系统发送了一条通知»。

### 15.2 消息分类

| 类型 | 触发方式 | 视觉特征 | 用户感知 |
|------|----------|----------|----------|
| **Proactive Insight** | AI 主动推送 | AI 辉光卡片 + 专属排版 | 「AI 想到了什么」 |
| **Reply** | 用户提问后回复 | 标准消息气泡 | 「AI 回答了我」 |
| **Check-in** | 定时/事件触发 | 温暖的口语化卡片 | 「AI 关心我」 |
| **Summary** | 周期性总结 | 数据+文字的混合卡片 | 「AI 帮我回顾」 |

### 15.3 Proactive Insight 消息（⭐ 核心消息类型）

```
┌─────────────────────────────────────────────┐
│  ┌──┐                                       │
│  │AI│  AI 注意到...                         │   ← AI 头像 + 标签
│  └──┘                                       │
│                                             │
│  今天你完成了连续第 7 天的算法学习。          │   ← 主内容
│  需要我帮你规划下一阶段的进阶路线吗？         │      (16px, 1.6 行高)
│                                             │
│  ───────────────────────────────────         │
│                                             │
│  [展开详情]              [好的，帮我规划 →]  │   ← 操作区
│                                             │
└─────────────────────────────────────────────┘
  ↑ 微妙的蓝色辉光边框（--fs-shadow-ai）
```

```css
.fs-message-insight {
  max-width:         600px;
  padding:           20px 24px;
  background:        linear-gradient(135deg, #FFFFFF 0%, #FAFBFF 100%);
  border:            1px solid rgba(79, 110, 247, 0.12);
  border-radius:     var(--fs-radius-lg);
  box-shadow:        var(--fs-shadow-ai);
  animation:         insight-enter 400ms ease;
}

/* 进入动画 */
@keyframes insight-enter {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

### 15.4 Reply 消息（用户提问后的回复）

```css
.fs-message-reply {
  max-width:         600px;
  padding:           16px 20px;
  background:        var(--fs-neutral-50);
  border-radius:     var(--fs-radius-lg);
  font-size:         16px;
  line-height:       1.6;
}
```

### 15.5 用户消息

```css
.fs-message-user {
  max-width:         480px;
  padding:           12px 18px;
  background:        var(--fs-brand-50);
  color:             var(--fs-neutral-800);
  border-radius:     var(--fs-radius-lg);
  font-size:         16px;
  line-height:       1.5;
  align-self:        flex-end;   /* 右对齐 */
}
```

### 15.6 AI 消息使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• AI 消息和用户消息视觉上必须明确区分
• AI Proactive Insight 使用专属卡片样式（辉光边框）
• 消息间距：同一对话中 16px，对话分组间 24px
• AI 消息始终左对齐，用户消息右对齐
• 消息最大宽度 600px（保证可读性）

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• AI 和用户不使用相同背景色
• 消息不使用尖角气泡（不现代）
• 不使用 Material 风格的 FAB 圆形头像气泡
• 同一时间不显示超过 2 条未读 Proactive Insight
```

---

## 16. 动画规范

### 16.1 设计理念

动画不是装饰，是 **AI 产品中传递「生命力」的核心手段**。

- **弹簧动画** 用于交互反馈（让 AI 感觉「有生命」）
- **微妙淡入** 用于内容加载（不突兀）
- **AI 专属动效** 用于状态表达（思考、发现、推送）

### 16.2 动画时长 Token

```css
:root {
  --fs-duration-instant:  100ms;   /* 微交互：hover 色变、ripple */
  --fs-duration-fast:     200ms;   /* 标准过渡：按钮、开关、标签 */
  --fs-duration-normal:   300ms;   /* 页面元素出现/消失 */
  --fs-duration-slow:     500ms;   /* 页面转场、大元素移动 */
  --fs-duration-glacial:  800ms;   /* 品牌动画、AI 特殊动效 */
}
```

### 16.3 缓动函数

```css
:root {
  /* 标准曲线 — 大部分过渡 */
  --fs-ease-out:      cubic-bezier(0.16, 1, 0.3, 1);      /* 类似 Apple 默认 */
  --fs-ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);     /* 对称缓动 */

  /* 弹性曲线 — 交互反馈 */
  --fs-ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* 轻微回弹 */
  --fs-ease-bounce:   cubic-bezier(0.5, 1.8, 0.8, 0.8);   /* 强调回弹 */

  /* AI 专属 — 有机感 */
  --fs-ease-ai:       cubic-bezier(0.4, 0, 0.2, 1);       /* 平滑呼吸感 */
}
```

### 16.4 动效分类

#### 16.4.1 微交互（100-200ms）

```css
/* 按钮 hover — 轻微上浮 */
.fs-btn-primary { transition: all var(--fs-duration-fast) var(--fs-ease-out); }

/* Toggle switch — 弹簧回弹 */
.fs-toggle-thumb { transition: transform var(--fs-duration-instant) var(--fs-ease-spring); }

/* 导航项 hover 背景 */
.fs-nav-item { transition: background var(--fs-duration-instant) var(--fs-ease-out), color var(--fs-duration-instant) var(--fs-ease-out); }
```

#### 16.4.2 出现/消失动画（300ms）

```css
/* 淡入+上滑 — 列表项、卡片进入 */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fs-animate-in {
  animation: fade-in-up var(--fs-duration-normal) var(--fs-ease-out) both;
}

/* 延迟序列 — 列表项依次出现 */
.fs-animate-stagger > *:nth-child(1) { animation-delay: 0ms; }
.fs-animate-stagger > *:nth-child(2) { animation-delay: 60ms; }
.fs-animate-stagger > *:nth-child(3) { animation-delay: 120ms; }
.fs-animate-stagger > *:nth-child(4) { animation-delay: 180ms; }
.fs-animate-stagger > *:nth-child(5) { animation-delay: 240ms; }
.fs-animate-stagger > *:nth-child(6) { animation-delay: 300ms; }
```

#### 16.4.3 AI 思考动画

AI 正在处理/思考时的专属动效。灵感来自 ChatGPT 的 Emotive Point 和 OriginOS 的 AI 光效。

```css
/* AI 思考态 — 三个跳动的点 */
.fs-ai-thinking {
  display:          flex;
  align-items:      center;
  gap:              4px;
  padding:          12px 16px;
}
.fs-ai-thinking .dot {
  width:            8px;
  height:           8px;
  background:       var(--fs-brand-400);
  border-radius:    var(--fs-radius-full);
  animation:        ai-think 1.4s ease-in-out infinite both;
}
.fs-ai-thinking .dot:nth-child(2) { animation-delay: 0.2s; }
.fs-ai-thinking .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes ai-think {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1; }
}

/* AI 洞见到达 — 辉光扩散 */
@keyframes ai-glow-arrive {
  0%   { box-shadow: 0 0 0 0 rgba(79, 110, 247, 0.3); }
  100% { box-shadow: 0 0 0 16px rgba(79, 110, 247, 0); }
}
```

#### 16.4.4 页面转场（500ms）

```css
/* 路由切换 — 淡入 + 微上移 */
.fs-page-enter-active   { animation: fade-in-up 400ms var(--fs-ease-out) both; }
.fs-page-leave-active   { animation: fade-out 200ms var(--fs-ease-out) both; }

@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

### 16.5 动画使用规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 所有交互动画使用 CSS transition，避免 JS 动画
• 页面进入使用 fade-in-up（淡入+上移）
• AI 思考态必须使用专属动效（传递 AI 生命力）
• Proactive Insight 出现时使用专属 insight-enter 动画
• 列表项延迟入场（stagger，每项间隔 60ms）
• 遵循 prefers-reduced-motion 媒体查询

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用超过 500ms 的常规动画
• 不同时播放超过 3 个动画
• 不使用 Material 的 Ripple 水波纹效果
• 不使用旋转加载图标（使用 AI 专属思考动画替代）
• 动画不中断用户阅读流（动画播放期间内容稳定）
```

---

## 17. PC 端响应式规范

### 17.1 断点系统

FutureSelf 是 **PC-First** 产品，主要使用场景为大屏笔记本和台式机。

```css
:root {
  /* 移动端/平板后期扩展 — v1.0 仅实现 PC 端 */
  --fs-breakpoint-sm:    640px;    /* 极小窗口 */
  --fs-breakpoint-md:    768px;    /* 小屏笔记本 */
  --fs-breakpoint-lg:    1024px;   /* 标准笔记本 */
  --fs-breakpoint-xl:    1280px;   /* 台式机 ⭐ 主设计尺寸 */
  --fs-breakpoint-2xl:   1440px;   /* 大屏显示器 */
  --fs-breakpoint-3xl:   1920px;   /* 超大屏 */
}
```

### 17.2 响应式策略

```
设计基准：1280px 宽度屏幕（主流笔记本）
安全区域：内容最大宽度 960px
```

| 屏幕宽度 | 侧边栏 | 内容宽度 | 策略 |
|----------|--------|----------|------|
| ≥ 1440px | 240px 展开 | max 960px 居中 | 完整体验（大屏） |
| 1280-1439px | 240px 展开 | max 960px 居中 | **主设计范围** |
| 1024-1279px | 240px 展开 | max 768px | 内容区域收窄 |
| 768-1023px | 72px 折叠 | max 640px | 紧凑模式 |
| < 768px | 0 隐藏（底部导航） | 100% | 移动端（v2.0） |

### 17.3 内容区域响应式

```css
/* 主内容容器 */
.fs-content {
  width:              100%;
  max-width:          var(--fs-content-lg);          /* 960px */
  margin:             0 auto;                        /* 水平居中 */
  padding:            0 var(--fs-page-padding-x);    /* 32px */
}

/* 大屏 — 更宽 */
@media (min-width: 1440px) {
  .fs-content { max-width: 1100px; }
}

/* 小屏 — 收窄 */
@media (max-width: 1023px) {
  .fs-content {
    max-width:         var(--fs-content-md);         /* 768px */
    padding:           0 20px;
  }
}

/* 极小窗口 — 全宽 */
@media (max-width: 767px) {
  .fs-content {
    max-width:         100%;
    padding:           0 16px;
  }
}
```

### 17.4 响应式规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 所有页面基于 1280px 宽度设计
• 内容最大宽度 960px，保证信息密度适中
• 卡片网格使用 CSS Grid auto-fit + minmax（自动适配列数）
• 侧边栏在 < 768px 时自动折叠为图标模式

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用超大字号（> 48px）适应移动端的设计反向影响 PC
• 不使用 flex-wrap 让卡片无规则换行
• 不硬编码像素宽度（使用 max-width + 百分比）
```

---

## 18. 组件命名规范

### 18.1 命名体系

采用 **BEM 变体** 命名法，前缀 `Fs`（FutureSelf 缩写）：

```
Fs[ComponentName][--Variant]
```

### 18.2 组件分类前缀

| 分类 | 前缀 | 示例 |
|------|------|------|
| **布局** | `FsLayout` | `FsLayoutSidebar`, `FsLayoutContent` |
| **通用 UI** | `Fs` | `FsButton`, `FsCard`, `FsInput`, `FsModal` |
| **AI 专属** | `FsAi` | `FsAiAvatar`, `FsAiMessage`, `FsAiThinking` |
| **业务页面** | `FsPage` | `FsPageDashboard`, `FsPageGrowth` |

### 18.3 文件命名

```
组件文件：  PascalCase.vue     →  FsButton.vue, FsAiAvatar.vue
页面文件：  PascalCase.vue     →  DashboardPage.vue, OnboardingPage.vue
Composable: camelCase.ts      →  useAiStatus.ts, useUserProfile.ts
Store:      camelCase.ts      →  userStore.ts, aiStore.ts
Util:       camelCase.ts      →  formatDate.ts, validateInput.ts
Type:       camelCase.ts      →  user.ts, aiMessage.ts
常量:       UPPER_CASE.ts     →  ROUTES.ts, API_ENDPOINTS.ts
```

### 18.4 CSS 类命名

```css
/* 组件基类 */
.fs-btn { }
.fs-btn-primary { }    /* 变体：层级 */
.fs-btn-sm { }         /* 变体：尺寸 */
.fs-btn-loading { }    /* 变体：状态 */
.fs-btn--disabled { }  /* 修饰符：BEM 风格 */

/* 页面布局 */
.fs-page { }
.fs-page__header { }
.fs-page__body { }
.fs-page__section { }
```

### 18.5 Vue 组件模板

```vue
<!-- FsButton.vue -->
<script setup lang="ts">
interface FsButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}
</script>

<template>
  <button
    class="fs-btn"
    :class="[
      `fs-btn-${variant}`,
      `fs-btn-${size}`,
      { 'fs-btn--loading': loading, 'fs-btn--disabled': disabled }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="fs-btn__spinner" />
    <slot />
  </button>
</template>
```

### 18.6 命名规则

```
✅ 规则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 组件名 2-4 个单词，清晰描述用途
• 全局组件前缀 Fs/FsAi，业务页面组件用 Page 后缀
• CSS 类名全小写 + 连字符
• Props 接口命名：[组件名]Props
• Emits 接口命名：[组件名]Emits

❌ 禁止
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 不使用单字母或无意义缩写（如 FsBtn → 应使用 FsButton）
• 不混用 PascalCase 和 camelCase 做组件名
• Props 不使用单字母命名
• 不命名冲突（如两个组件都叫 Card）
```

---

## 附录 A：Design Token 速查表

### 颜色速查

| Token | 值 | 用途 |
|-------|-----|------|
| `--fs-brand-500` | `#4F6EF7` | 品牌主色 |
| `--fs-ai-gradient` | `135deg, #4F6EF7→#7B93FF→#9DB5FF` | AI 渐变 |
| `--fs-neutral-0` | `#FFFFFF` | 卡片表面 |
| `--fs-neutral-50` | `#F8F9FC` | 页面背景 |
| `--fs-neutral-200` | `#E3E6EF` | 边框分割 |
| `--fs-neutral-700` | `#3A4055` | 正文文字 |

### 间距速查

| Token | 值 | 主要用途 |
|-------|-----|----------|
| `--fs-space-2` | 8px | 图标间距 |
| `--fs-space-4` | 16px | 组件内边距 |
| `--fs-space-6` | 24px | 卡片内边距 |
| `--fs-space-8` | 32px | 区块间距 |
| `--fs-space-16` | 64px | 页面大间距 |

### 圆角速查

| Token | 值 | 用途 |
|-------|-----|------|
| `--fs-radius-sm` | 6px | 小元素 |
| `--fs-radius-md` | 10px | 按钮/输入框 ⭐ |
| `--fs-radius-lg` | 14px | 卡片 |
| `--fs-radius-full` | 9999px | 头像/药丸 |

### 阴影速查

| Token | 场景 |
|-------|------|
| `--fs-shadow-none` | 默认 |
| `--fs-shadow-sm` | hover 卡片 |
| `--fs-shadow-md` | 下拉菜单/Tooltip |
| `--fs-shadow-lg` | Modal |
| `--fs-shadow-ai` | AI 洞见卡片 ⭐ |

---

## 附录 B：CSS 变量总览

所有 Design Token 统一通过 CSS 自定义属性暴露，集中定义在 `src/styles/tokens.css` 中。

组件开发时**必须**使用 CSS 变量，**不得**硬编码色值/间距等。

```css
/* ✅ 正确 */
color: var(--fs-brand-500);
padding: var(--fs-space-4);

/* ❌ 错误 */
color: #4F6EF7;
padding: 16px;
```

---

## 附录 C：设计决策记录

| 决策 | 选择 | 替代方案（否决） | 理由 |
|------|------|------------------|------|
| 字体 | Inter + 系统中文 | 纯系统字体 | Inter 更现代，与 Notion/Linear 对齐 |
| 网格 | 4px 基网格 | 8px | 4px 提供更精细的控制 |
| 深度模式 | 表面阶梯 + 微妙阴影 | Material Elevation | 更克制，更适合 AI 产品 |
| 图标 | Lucide Icons | Heroicons / Phosphor | 线性 + 圆角 + 丰富度最佳平衡 |
| 按钮主色 | AI 渐变背景 | 纯色 | 强化 AI 品牌识别，区别于普通 SaaS |
| 圆角 | 10px 默认 | 8px 或 12px | 介于 Linear(8px) 和 iOS(12px) 之间 |

---

> **本文档为 FutureSelf 唯一的设计权威来源。**
> 任何 UI 实现必须以本文档为基准。如有疑问，回顾 §1 设计哲学。
