// ============================================================
// index.ts — FutureSelf Server 入口
// 启动 Express 服务 + MongoDB 连接
// ============================================================

import app from './app'
import { config } from './config'
import { connectDB } from './db'
import { startScheduler } from './services(DeepSeek API)/scheduler'

async function main() {
  console.log('[FutureSelf Server] 正在启动...')

  // 连接 MongoDB
  await connectDB()

  // 启动 HTTP 服务
  app.listen(config.port, () => {
    console.log(`[FutureSelf Server] 已启动 → http://localhost:${config.port}`)
    console.log(`[FutureSelf Server] DeepSeek 模型: ${config.deepseek.model}`)
    console.log(`[FutureSelf Server] CORS 允许: ${config.cors.origins.join(', ')}`)
  })

  // 启动定时任务引擎
  startScheduler()
}

main().catch((err) => {
  console.error('[FutureSelf Server] 启动失败:', err)
  process.exit(1)
})
