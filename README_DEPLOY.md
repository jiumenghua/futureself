# 🚀 FutureSelf 部署指南

## 架构概览

```
用户浏览器
    │
    ├── 前端 (Vercel) ──→ https://futureself-xxx.vercel.app
    │       Vue 3 + Vite SPA
    │
    └── 后端 (Render) ──→ https://futureself-api-xxx.onrender.com
            Node.js + Express API
            │
            ├── MongoDB (已有，dbconn.sealoshzh.site)
            │
            └── DeepSeek API (已有，api.deepseek.com)
```

---

## 第一步：部署后端到 Render

### 1. 注册 https://render.com（推荐用 GitHub 账号）

### 2. 创建 Web Service
- 点击 **New +** → **Web Service**
- 连接 GitHub 仓库
- 配置：

| 设置项 | 值 |
|--------|-----|
| **Name** | `futureself-api` |
| **Runtime** | `Node` |
| **Root Directory** | `server` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Free Plan** | ✅ 勾选 |

### 3. 设置环境变量（Environment Variables）

在 Render Dashboard → Environment 中添加：

| Key | Value（从 server/.env 复制） |
|-----|------|
| `PORT` | `3000` |
| `MONGODB_URI` | `mongodb://root:96zI3l23kkT792RC@dbconn.sealoshzh.site:40491/?directConnection=true` |
| `MONGODB_DB_NAME` | `futureself` |
| `DEEPSEEK_API_KEY` | `sk-de07e46e831c4c6b854623a9c59949ea` |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | `deepseek-chat` |
| `AES_ENCRYPTION_KEY` | `Q6mI8t72UUkzSInng4hSBNW1Fy47YUWFBoAP3D9OGeA=` |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:4173,https://你的Vercel域名.vercel.app` |

### 4. 等待 Render 部署完成
- 首次部署约 3-5 分钟
- 记录生成的 URL（例如 `https://futureself-api.onrender.com`）
- 测试：访问 `https://futureself-api-xxx.onrender.com/api/health`

> ⚠️ 注意：免费 Render 实例 15 分钟无请求会自动休眠，首次唤醒需 30-60 秒。

---

## 第二步：部署前端到 Vercel

### 1. 注册 https://vercel.com（推荐用 GitHub 账号）

### 2. 导入项目
- 点击 **Add New** → **Project**
- 选择 GitHub 仓库
- Vercel 自动识别为 Vite 项目

### 3. 设置环境变量

在 Vercel Dashboard → Settings → Environment Variables：

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://你的Render域名` |

> ⚠️ 注意：不要把 `/api` 放在末尾，代码会自动追加

### 4. 部署设置（Vercel 自动检测）

| 设置项 | 值 |
|--------|-----|
| **Framework** | `Vite` |
| **Build Command** | `npm run build` (自动) |
| **Output Directory** | `dist` (自动) |

### 5. 部署
- 点击 **Deploy**
- 等待构建完成（约 1-2 分钟）
- 获得前端 URL：`https://futureself-xxx.vercel.app`

---

## 第三步：更新 CORS（重要！）

### 部署完成后：
1. 复制 Vercel 给你的前端域名
2. 在 Render Dashboard → Environment Variables
3. 更新 `CORS_ORIGIN`，添加前端域名：
   ```
   http://localhost:5173,http://localhost:4173,https://futureself-123.vercel.app
   ```
4. Render 会自动重新部署（约 1 分钟）

---

## 第四步：验证部署

1. 打开 Vercel 给你前端 URL
2. 测试各页面功能
3. 测试 AI 对话（DeepSeek API）
4. 测试日历/饮食/成长记录功能

### 健康检查
```bash
curl https://futureself-api-xxx.onrender.com/api/health
# 期望：{"success":true,"code":0,"message":"FutureSelf API is running"}
```

---

## 常见问题

### Q: Render 显示 "Build failed"
- 检查 Root Directory 是否设为 `server`
- 检查 Node.js 版本（需 ≥18）

### Q: 前端显示 "网络连接失败"
- 检查 Vercel 环境变量 `VITE_API_BASE_URL` 是否正确
- 检查 Render CORS_ORIGIN 是否包含 Vercel 域名
- 注意 Render URL 格式：`https://xxx.onrender.com`（不带 `/api`）

### Q: API 响应很慢
- 免费 Render 实例休眠后首次唤醒需 30-60 秒
- MongoDB 连接可能较慢（跨境）

### Q: 如何更新代码
- Push 到 GitHub → Vercel + Render 自动重新部署
