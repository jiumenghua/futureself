# FutureSelf Server

FutureSelf 后端服务 — Node.js + Express + TypeScript + MongoDB + DeepSeek API

## 快速启动

### 1. 环境准备

```bash
# 确保已安装 Node.js >= 18
node -v
```

### 2. 安装依赖

```bash
cd server
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env，填入真实凭据（当前已预配置）
```

关键环境变量：

| 变量 | 说明 |
|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 |
| `MONGODB_URI` | MongoDB 连接地址 |
| `AES_ENCRYPTION_KEY` | AES-256 加密密钥（32字节 base64） |
| `CORS_ORIGIN` | 允许的前端地址 |

### 4. 启动服务

```bash
npm run dev     # 开发模式（热重载）
npm run build   # 编译 TypeScript
npm start       # 生产模式
```

服务默认运行在 `http://localhost:3000`

## 前端启动

```bash
cd ..           # 回到项目根目录
npm install     # 安装前端依赖
npm run dev     # 启动前端 → http://localhost:5173
```

前端通过 Vite 代理将 `/api` 请求转发到后端 `http://localhost:3000`

## API 列表

### 健康检查
```
GET /api/health
```

### 聊天
```
POST /api/chat/send      发送消息，返回 AI 回复
GET  /api/chat/history   获取聊天历史
```

### 今日建议
```
POST /api/today/advice   生成每日个性化建议
GET  /api/today/data     获取今日数据汇总
```

### 成长评价
```
POST /api/journey/eval   生成成长评价
GET  /api/journey/records 获取成长记录
POST /api/journey/record  添加成长记录
```

### 用户
```
GET  /api/user/profile   获取用户信息
POST /api/user/profile   创建/更新用户
GET  /api/user/memories  获取 AI 记忆
POST /api/user/memory    添加 AI 记忆
```

## 技术架构

```
server/
├── src/
│   ├── index.ts          入口
│   ├── app.ts            Express 应用
│   ├── config.ts         环境变量配置
│   ├── db.ts             MongoDB 连接
│   ├── middleware/
│   │   └── errorHandler.ts  错误处理
│   ├── services/
│   │   ├── deepseek.ts   DeepSeek API 封装
│   │   └── crypto.ts     AES 加密
│   ├── models/
│   │   ├── User.ts       用户模型（敏感字段加密）
│   │   ├── ChatRecord.ts 聊天记录
│   │   ├── GrowthData.ts 成长数据
│   │   └── AiMemory.ts   AI 记忆（加密）
│   ├── routes/
│   │   ├── chat.ts       聊天路由
│   │   ├── today.ts      今日路由
│   │   ├── journey.ts    成长路由
│   │   └── user.ts       用户路由
│   └── types/
│       └── index.ts      类型定义
├── .env.example          环境变量模板
├── package.json
└── tsconfig.json
```

## 安全说明

- 所有敏感凭据通过 `.env` 环境变量加载，不硬编码
- 用户个人资料、AI 记忆标签使用 AES-256-GCM 加密存储
- 前端完全不接触 API Key，所有请求由后端转发
- MongoDB 不可用时服务自动降级，不影响 DeepSeek 调用
