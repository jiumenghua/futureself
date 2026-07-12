// ============================================================
// api/index.ts — Vercel Serverless Function 入口
// 使用 createRequire 加载 CJS 编译产物，避免 ESM/CJS interop 问题
// ============================================================

import { createRequire } from 'node:module'

// 用 CJS require 加载编译后的服务端代码
const require = createRequire(import.meta.url)
const appModule = require('../server/dist/app.js')
const app = appModule.default || appModule

// ---- MongoDB 连接缓存 ----
let dbReady = false
let dbPromise: Promise<void> | null = null

app.use('/api', async (_req: any, _res: any, next: any) => {
  if (!dbReady) {
    if (!dbPromise) {
      try {
        const dbModule = require('../server/dist/db.js')
        dbPromise = dbModule.connectDB()
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
  next()
})

export default app
