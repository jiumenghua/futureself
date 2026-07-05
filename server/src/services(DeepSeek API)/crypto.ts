// ============================================================
// crypto.ts — AES-256-GCM 对称加密服务
// 用于加密数据库中敏感字段（用户资料、AI 记忆标签等）
// ============================================================

import crypto from 'crypto'
import { config } from '../config'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const TAG_LENGTH = 16
const KEY_BUFFER = Buffer.from(config.aes.key, 'base64')

if (KEY_BUFFER.length !== 32) {
  throw new Error('[Crypto] AES 密钥必须为 32 字节（256 位）')
}

/**
 * 加密明文
 * @returns base64 编码的密文（格式: iv + ciphertext + authTag）
 */
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  const authTag = cipher.getAuthTag()

  // iv + ciphertext + authTag → base64 拼接
  const combined = Buffer.concat([iv, Buffer.from(encrypted, 'base64'), authTag])
  return combined.toString('base64')
}

/**
 * 解密密文
 * @param ciphertext encrypt() 返回的 base64 密文
 * @returns 原始明文
 */
export function decrypt(ciphertext: string): string {
  try {
    const combined = Buffer.from(ciphertext, 'base64')
    const iv = combined.subarray(0, IV_LENGTH)
    const authTag = combined.subarray(combined.length - TAG_LENGTH)
    const encrypted = combined.subarray(IV_LENGTH, combined.length - TAG_LENGTH)

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (err) {
    // 解密失败时返回占位符，避免程序崩溃
    console.error('[Crypto] 解密失败:', (err as Error).message)
    return '[加密数据]'
  }
}
