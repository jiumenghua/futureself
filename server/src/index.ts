// ============================================================
// index.ts — FutureSelf Server 入口（独立模式）
// 启动 Express 服务 + MongoDB 连接
// Vercel Serverless 模式下不会执行此文件（使用 api/index.ts）
// ============================================================

import app from './app'
import { config } from './config'
import { connectDB } from './db'

// startScheduler 仅在独立服务器模式下工作
async function startSchedulerIfStandalone() {
  try {
    const { startScheduler } = await import('./services(DeepSeek API)/scheduler')
    startScheduler()
  } catch {
    console.log('[FutureSelf Server] 定时任务在 Serverless 模式下不可用（正常）')
  }
}

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

  // 启动定时任务引擎（仅独立模式）
  await startSchedulerIfStandalone()
}

// 仅在直接运行时启动（非 Vercel Serverless 导入）
// Vercel 使用 api/index.ts 作为入口，不会执行此文件
main().catch((err) => {
  console.error('[FutureSelf Server] 启动失败:', err)
  process.exit(1)
})
