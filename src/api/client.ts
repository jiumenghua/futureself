// ============================================================
// client.ts — 统一请求层
// axios 封装：统一前缀 /api、错误拦截、响应提取
// 生产环境通过 VITE_API_BASE_URL 指定后端地址
// 开发环境使用 Vite 代理 → localhost:3000
// ============================================================

import axios, { AxiosError } from 'axios'

// 生产构建时设置 VITE_API_BASE_URL 为完整 API 地址
// 例如 https://futureself-api.onrender.com/api
// 开发时留空，走 Vite proxy（/api → localhost:3000）
const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

const client = axios.create({
  baseURL: apiBase,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ---- 响应拦截：统一提取 data ----
client.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body && body.success !== undefined) {
      // 标准化响应 { success, code, message, data }
      return body
    }
    return { success: true, code: 0, message: 'ok', data: body }
  },
  (error: AxiosError) => {
    // 网络错误或服务端错误
    if (error.response) {
      const body = error.response.data as any
      return {
        success: false,
        code: error.response.status,
        message: body?.message || '服务器异常',
        data: null,
      }
    }
    return {
      success: false,
      code: 0,
      message: error.message || '网络连接失败',
      data: null,
    }
  }
)

export default client
