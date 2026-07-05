// ============================================================
// config.ts — 环境变量加载与配置校验
// 所有敏感凭据通过 .env 加载，绝不硬编码
// ============================================================

import dotenv from 'dotenv'
import path from 'path'

// 加载项目根目录 .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
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
