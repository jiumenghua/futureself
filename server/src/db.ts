// ============================================================
// db.ts — MongoDB/Mongoose 连接管理
// 支持连接超时与优雅降级（MongoDB 不可用时服务仍可启动）
// ============================================================

import mongoose from 'mongoose'
import { config } from './config'

let isConnected = false

export async function connectDB(): Promise<void> {
  if (isConnected) return

  try {
    await mongoose.connect(config.mongodb.uri, {
      dbName: config.mongodb.dbName,
      serverSelectionTimeoutMS: 5000,  // 5s 超时
      connectTimeoutMS: 5000,
    })
    isConnected = true
    console.log(`[MongoDB] ✅ 已连接到数据库: ${config.mongodb.dbName}`)

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] 连接错误:', err.message)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] 连接断开')
      isConnected = false
    })
  } catch (err) {
    isConnected = false
    console.warn('[MongoDB] ⚠️ 无法连接（将使用降级模式）:', (err as Error).message)
    console.warn('[MongoDB] URI:', config.mongodb.uri.replace(/\/\/.*@/, '//***@'))
    // 不抛出异常，允许服务在无数据库情况下启动
  }
}

export function getConnectionState(): boolean {
  return isConnected && mongoose.connection.readyState === 1
}
