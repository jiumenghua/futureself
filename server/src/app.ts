// ============================================================
// app.ts — Express 应用配置
// CORS、路由挂载、错误处理
// ============================================================

import express from 'express'
import path from 'path'
import cors from 'cors'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'

// 路由
import chatRoutes from './routes(DeepSeek API)/chat(DeepSeek API)'
import todayRoutes from './routes(DeepSeek API)/today(DeepSeek API)'
import journeyRoutes from './routes(DeepSeek API)/journey(DeepSeek API)'
import userRoutes from './routes(DeepSeek API)/user'
import calendarRoutes from './routes(DeepSeek API)/calendar(DeepSeek API)'
import notificationRoutes from './routes(DeepSeek API)/notifications'
import dietRoutes from './routes(DeepSeek API)/diet(DeepSeek API)'
import profileRoutes from './routes(DeepSeek API)/profile'
import notifyRoutes from './routes(DeepSeek API)/notify'
import behaviorRoutes from './routes(DeepSeek API)/behavior(DeepSeek API)'
import testRoutes from './routes(DeepSeek API)/test'

const app = express()

// ---- CORS：支持多源（逗号分隔） ----
app.use(cors({
  origin(origin, callback) {
    // 允许无 origin 的请求（如 Postman、服务端调用）
    if (!origin || config.cors.origins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`[CORS] 拒绝未授权的源: ${origin}`)
      callback(new Error(`CORS 不允许的源: ${origin}`))
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))

// ---- 简易请求日志 ----
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ---- 健康检查 ----
app.get('/api/health', (_req, res) => {
  res.json({ success: true, code: 0, message: 'FutureSelf API is running' })
})

// ---- 静态文件（上传目录） ----
app.use('/static', express.static(path.resolve(__dirname, '..', 'static')))

// ---- 业务路由 ----
app.use('/api/chat', chatRoutes)
app.use('/api/today', todayRoutes)
app.use('/api/journey', journeyRoutes)
app.use('/api/user', userRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/diet', dietRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/notify', notifyRoutes)
app.use('/api/behavior', behaviorRoutes)
app.use('/api/test', testRoutes)

// ---- 404 处理 ----
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    code: 404,
    message: '接口不存在',
  })
})

// ---- 统一错误处理（必须在路由之后） ----
app.use(errorHandler)

export default app
