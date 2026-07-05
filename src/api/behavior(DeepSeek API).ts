// ============================================================
// behavior.ts — 用户行为上报 API
// ============================================================

import client from './client'

export interface BehaviorReportResponse {
  notified: boolean
  reason?: 'unsupported_behavior' | 'db_offline' | 'mute_hours' | 'daily_cap_reached' | 'cooldown'
  content?: string
  todayCount?: number
  minutesSinceLast?: number
}

/**
 * 上报用户行为到后端决策引擎
 * @param userId 用户 ID
 * @param behaviorType 行为类型（当前仅支持 sedentary_45min）
 */
export async function reportBehavior(
  userId: string,
  behaviorType: 'sedentary_45min'
): Promise<BehaviorReportResponse> {
  try {
    const res = await client.post('/behavior/report', { userId, behaviorType })
    if (res.success && res.data) {
      return res.data as BehaviorReportResponse
    }
  } catch { /* 静默失败 */ }
  return { notified: false, reason: 'db_offline' }
}
