// ============================================================
// api/index.ts — Vercel Serverless Function 入口
// 将 Express 应用导出为 Vercel Serverless 处理器
// Vercel 自动将 /api/* 路由到此函数
// ============================================================

import app from '../server/src/app'
import { connectDB } from '../server/src/db'

// ---- 全局 MongoDB 连接缓存（Vercel 热启动复用） ----
let dbReady = false
let dbPromise: Promise<void> | null = null

// ---- 每个请求前确保数据库已连接 ----
app.use('/api', async (_req, _res, next) => {
  if (!dbReady) {
    if (!dbPromise) {
      dbPromise = connectDB()
    }
    try {
      await dbPromise
      dbReady = true
    } catch {
      // MongoDB 不可用时仍继续处理请求（降级模式）
    }
  }
  next()
})

// ---- 导出 Express 应用 ----
// Vercel @vercel/node runtime 自动处理 Express app
export default app
