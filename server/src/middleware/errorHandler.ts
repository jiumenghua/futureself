// ============================================================
// errorHandler.ts — 统一错误处理中间件
// 所有错误返回标准化 ApiResponse 格式
// ============================================================

import { Request, Response, NextFunction } from 'express'
import { ErrorCode } from '../types'

const ERROR_STATUS_MAP: Record<string, { status: number; code: ErrorCode; message: string }> = {
  AI_API_KEY_ERROR:    { status: 502, code: ErrorCode.AI_API_ERROR,  message: 'AI 服务密钥异常，请稍后再试' },
  AI_RATE_LIMITED:     { status: 429, code: ErrorCode.RATE_LIMITED,  message: 'AI 服务繁忙，请稍后再试' },
  AI_TIMEOUT:          { status: 504, code: ErrorCode.AI_TIMEOUT,    message: 'AI 响应超时，请重试' },
  AI_API_ERROR:        { status: 502, code: ErrorCode.AI_API_ERROR,  message: 'AI 服务暂时不可用' },
  AI_NETWORK_ERROR:    { status: 502, code: ErrorCode.AI_API_ERROR,  message: 'AI 服务连接失败' },
  AI_EMPTY_RESPONSE:   { status: 502, code: ErrorCode.AI_API_ERROR,  message: 'AI 返回了空响应' },
  VALIDATION_ERROR:    { status: 400, code: ErrorCode.BAD_REQUEST,   message: '请求参数不合法' },
  NOT_FOUND:           { status: 404, code: ErrorCode.NOT_FOUND,     message: '资源不存在' },
  DB_ERROR:            { status: 500, code: ErrorCode.DB_ERROR,      message: '数据库操作异常' },
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  const errType = err?.message || err?.type || ''

  const mapping = ERROR_STATUS_MAP[errType]
  if (mapping) {
    res.status(mapping.status).json({
      success: false,
      code: mapping.code,
      message: mapping.message,
    })
    return
  }

  // 未知错误
  console.error('[Error] 未捕获的错误:', err)
  res.status(500).json({
    success: false,
    code: ErrorCode.INTERNAL_ERROR,
    message: '服务器内部异常，请稍后再试',
  })
}

/**
 * 主动抛出标准化错误的工具函数
 */
export function throwError(type: keyof typeof ERROR_STATUS_MAP): never {
  throw new Error(type)
}

/**
 * 简单的请求校验中间件
 */
export function validateRequest(requiredFields: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const body = req.body || {}
    for (const field of requiredFields) {
      if (!body[field]) {
        return next(new Error('VALIDATION_ERROR'))
      }
    }
    next()
  }
}
