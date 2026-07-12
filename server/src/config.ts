// ============================================================
// config.ts — 环境变量加载与配置校验
// 所有敏感凭据通过 .env 加载，绝不硬编码
// ============================================================

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// 加载 .env（仅在本地开发时存在，Vercel 通过 Dashboard 注入环境变量）
const envPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('[Config] 已加载本地 .env 文件')
} else {
  console.log('[Config] 使用系统环境变量（Vercel / Render 生产模式）')
}

function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
    // 在 Vercel Serverless 环境中，环境变量可能尚未配置
    // 不抛出异常（会导���模块加载失败 → 请求超时），而是记录警告并返回空字符串
    const isServerless = !!process.env.VERCEL || process.env.NODE_ENV === 'production'
    if (isServerless) {
      console.warn(`[Config] ⚠️ 缺少环境变量: ${key}（Vercel Serverless 模式下降级运行）`)
      return ''
    }
    throw new Error(`[Config] 缺少必需的环境变量: ${key}，请检查 .env 文件`)
  }
  return val
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongodb: {
    uri: requireEnv('MONGODB_URI'),
    dbName: process.env.MONGODB_DB_NAME || 'futureself',
  },
  deepseek: {
    apiKey: requireEnv('DEEPSEEK_API_KEY'),
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
  aes: {
    key: requireEnv('AES_ENCRYPTION_KEY'),
  },
  cors: {
    // 逗号分隔多个允许的源，例如：http://localhost:5173,https://futureself.vercel.app
    origins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
} as const
