// ============================================================
// mock/profile.ts — 成长档案 Mock 兜底数据
// 当 MongoDB 不可用时使用此数据，确保前端能正常展示
// ============================================================

import type { GrowthProfile } from '@/api/profile'

export const mockProfile: GrowthProfile = {
  school: '广西科技大学',
  major: '机器人工程',
  grade: '大三',
  goals: ['通过英语六级', '完成毕业设计', '学习 Vue3 源码', '坚持每天运动'],
  studyProfile: [
    '偏好晚间学习，效率最高的时段是 20:00–22:00',
    '喜欢用番茄钟法，专注 25 分钟休息 5 分钟',
    '对动手实践类项目兴趣浓厚，理论课容易走神',
    '遇到难题倾向于先自己查资料，卡住超过 30 分钟会求助',
  ],
  foodProfile: [
    '偏爱清淡口味，不太能吃辣',
    '早餐经常省略，需要提醒',
    '喜欢喝咖啡，每天 1-2 杯',
    '对螺蛳粉情有独钟',
  ],
  personalityProfile: [
    '偏内向但愿意在熟悉的环境中表达自己',
    '做事认真细致，有时会过度追求完美',
    '对新事物保持好奇心，愿意尝试',
    '情绪管理能力较好，遇到挫折会自我调节',
  ],
  recentDiscoveries: [],
  lastProfileUpdate: new Date().toISOString(),
  growthScore: 680,
}
