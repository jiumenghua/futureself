// ============================================================
// api/index.ts — Vercel Serverless Function 入口
// 将 Express 应用导出为 Vercel Serverless 处理器
// ============================================================

import app from '../server/src/app'

// ---- MongoDB 连接缓存 ----
let dbReady = false
let dbPromise: Promise<void> | null = null

app.use('/api', async (_req, _res, next) => {
  if (!dbReady) {
    if (!dbPromise) {
      import('../server/src/db.js').then(({ connectDB }) => {
        dbPromise = connectDB()
      }).catch(() => {
        dbPromise = Promise.resolve()
      })
      if (!dbPromise) dbPromise = Promise.resolve()
    }
    try {
      await dbPromise
      dbReady = true
    } catch {
      // MongoDB 不可用时继续（降级模式）
    }
  }
  next()
})

export default app
