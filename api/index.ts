// ============================================================
// api/index.ts — Vercel Serverless Function 入口
// 将 Express 应用导出为 Vercel Serverless 处理器
// Vercel 自动将 /api/* 路由到此函数
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node'

// ---- MongoDB 连接缓存（Vercel 热启动复用） ----
let dbReady = false
let dbPromise: Promise<void> | null = null

async function ensureDB() {
  if (dbReady) return
  if (!dbPromise) {
    try {
      const { connectDB } = await import('../server/src/db.js')
      dbPromise = connectDB()
    } catch {
      dbPromise = Promise.resolve()
    }
  }
  try {
    await dbPromise
    dbReady = true
  } catch {
    // MongoDB 不可用时继续（降级模式）
  }
}

// ---- 导出 Vercel Serverless 处理器 ----
// 使用动态 import 确保环境变量缺失时不会导致模块加载崩溃
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 确保数据库已连接（非阻塞）
    await ensureDB()

    // 动态加载 Express 应用（首次加载后 Vercel 会缓存模块）
    const { default: app } = await import('../server/src/app.js')
    app(req, res)
  } catch (err: any) {
    console.error('[Vercel] 请求处理失败:', err.message)
    res.status(500).json({
      success: false,
      code: 500,
      message: '服务内部异常，请检查 Vercel 环境变量配置（MONGODB_URI, DEEPSEEK_API_KEY, AES_ENCRYPTION_KEY, CORS_ORIGIN）',
    })
  }
}
