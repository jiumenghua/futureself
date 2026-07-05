// ============================================================
// mock/journey.ts — Journey 页面 Mock 兜底数据
// ============================================================

/** JourneyTimeline — 成长足迹 */
export const mockJourneyEvents = [
  { id: 'e1', date: '2026-07-05', icon: '🤖', title: '完成机器人控制实验', description: '在实验室完成了第三章的倒立摆控制实验，效果很好' },
  { id: 'e2', date: '2026-07-03', icon: '📝', title: '英语六级模考', description: '完成了第一套模拟题，阅读理解进步明显' },
  { id: 'e3', date: '2026-07-01', icon: '🏃', title: '开始晨跑计划', description: '决定每天早上 7 点晨跑，已经坚持了 5 天' },
  { id: 'e4', date: '2026-06-28', icon: '🎯', title: '设定新学期目标', description: '和 FutureSelf 聊了新学期计划，明确了三个核心目标' },
  { id: 'e5', date: '2026-06-25', icon: '☕', title: '开始记录饮食习惯', description: '开始使用饮食记录功能，FutureSelf 在帮忙分析饮食结构' },
]

/** JourneyBadges — 成长徽章 */
export const mockJourneyBadges = [
  { id: 'b1', name: '初识 AI', icon: '🤝', description: '第一次与 FutureSelf 对话', earned: true, color: '#3B82F6', earnedDate: '2026-06-20' },
  { id: 'b2', name: '七天坚持', icon: '🔥', description: '连续 7 天使用 FutureSelf', earned: true, color: '#F59E0B', earnedDate: '2026-06-27' },
  { id: 'b3', name: '学习达人', icon: '📚', description: '累计学习时长超过 50 小时', earned: true, color: '#22C55E', earnedDate: '2026-07-03' },
  { id: 'b4', name: '美食探索', icon: '🍜', description: '记录 20 次饮食偏好', earned: false, color: '#EC4899' },
  { id: 'b5', name: '社交之星', icon: '🌟', description: '参与 5 次团队活动', earned: false, color: '#8B5CF6' },
  { id: 'b6', name: '三十天成长', icon: '🚀', description: '连续使用 FutureSelf 30 天', earned: false, color: '#6366F1' },
]

/** JourneyTrend — 成长趋势 */
export const mockJourneyTrend = [
  { date: '06/25', score: 68 },
  { date: '06/27', score: 71 },
  { date: '06/29', score: 74 },
  { date: '07/01', score: 72 },
  { date: '07/03', score: 78 },
  { date: '07/05', score: 85 },
]

/** JourneyDimensions — 成长维度 */
export const mockJourneyDimensions = [
  { id: 'd1', icon: '📚', label: '学习成长', score: 82, trend: 'up', color: '#3B82F6', aiComment: '学习习惯稳定，继续保持' },
  { id: 'd2', icon: '💪', label: '身心健康', score: 65, trend: 'up', color: '#22C55E', aiComment: '运动频率有所增加' },
  { id: 'd3', icon: '👥', label: '社交能力', score: 58, trend: 'stable', color: '#F59E0B', aiComment: '可以多参与团队活动' },
  { id: 'd4', icon: '🧠', label: '自我认知', score: 75, trend: 'up', color: '#8B5CF6', aiComment: '对自己的了解越来越深' },
]

/** JourneySuggestion — AI 建议面板（兜底） */
export const mockJourneySuggestion = {
  title: 'AI 成长评价',
  summary: '过去一周你在学习和生活方面都有不错的进展，继续保持！',
  items: [
    '机器人控制理论学得很扎实，动手实验完成度高',
    '英语复习进度稳定，建议增加听力训练',
    '运动习惯开始建立，是个很好的开端',
    '可以尝试多参与团队讨论，锻炼协作能力',
  ],
}
