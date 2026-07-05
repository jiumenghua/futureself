// ============================================================
// mock/today.ts — Today 页面 Mock 兜底数据
// 当 MongoDB 不可用时使用此数据
// ============================================================

/** TodayHero 快捷操作 */
export const mockQuickActions = [
  { id: 'act1', label: '开始学习', icon: '📚', route: '/chat' },
  { id: 'act2', label: '看看饮食', icon: '🍽️', route: '/today' },
  { id: 'act3', label: '成长回顾', icon: '📈', route: '/journey' },
  { id: 'act4', label: 'AI 能力', icon: '🤖', route: '/discover' },
]

/** TodayFeed 动态列表 */
export const mockFeedItems = [
  {
    id: 'feed1', type: 'learning', icon: '📖',
    title: 'AI 学习提醒',
    content: '根据你的习惯，晚上 8-10 点是最高效的学习时段。今天的学习任务已为你准备好。',
    time: '10 分钟前', actionLabel: '查看计划', actionRoute: '/chat',
  },
  {
    id: 'feed2', type: 'life', icon: '☀️',
    title: '早安问候',
    content: '新的一天！今天的天气适合出门走走，别忘了吃早餐哦。',
    time: '2 小时前', actionLabel: '查看日程', actionRoute: '/today',
  },
  {
    id: 'feed3', type: 'emotion', icon: '💭',
    title: '情绪日记提醒',
    content: '你昨天看起来有点累了，今天感觉怎么样？记录一下心情吧。',
    time: '3 小时前', actionLabel: '写日记', actionRoute: '/journey',
  },
  {
    id: 'feed4', type: 'suggestion', icon: '💡',
    title: '成长建议',
    content: '最近你在机器人课程上花了很多时间，建议安排一些休息和运动来保持平衡。',
    time: '5 小时前', actionLabel: '查看详情', actionRoute: '/journey',
  },
]

/** TodayFocus AI 重点关注 */
export const mockFocusAreas = [
  { id: 'f1', label: '学习', icon: '📚', color: '#3B82F6', title: '今日学习计划', detail: '机器人控制理论第三章、英语六级词汇复习', progress: 60 },
  { id: 'f2', label: '健康', icon: '💪', color: '#22C55E', title: '运动提醒', detail: '最近运动量偏少，建议今天安排 30 分钟有氧运动', progress: 30 },
  { id: 'f3', label: '心态', icon: '🧘', color: '#8B5CF6', title: '情绪状态', detail: '近期情绪稳定，保持当前节奏。适当给自己一些放松时间。', progress: 80 },
  { id: 'f4', label: '社交', icon: '👥', color: '#F59E0B', title: '社交建议', detail: '注意到你较少参加团队活动，下周有个机器人社团交流会', progress: 45 },
]

/** TodayTimeline — 时间线数据 */
export const mockTimelineEntries = [
  { id: 't1', time: '08:30', title: '起床', description: '新的一天开始', icon: '☀️', type: 'routine' },
  { id: 't2', time: '10:00', title: '线性代数课', description: '教学楼 A301', icon: '📐', type: 'class' },
  { id: 't3', time: '14:00', title: '机器人实验', description: '实验室 B102', icon: '🤖', type: 'lab' },
  { id: 't4', time: '20:00', title: '英语六级复习', description: '图书馆自习', icon: '📝', type: 'study' },
]

/** TodayGrowthTrend — 成长趋势 */
export const mockGrowthTrend = [
  { date: '07/01', score: 72, level: 0 },
  { date: '07/02', score: 75, level: 12 },
  { date: '07/03', score: 70, level: 8 },
  { date: '07/04', score: 78, level: 15 },
  { date: '07/05', score: 80, level: 10 },
  { date: '07/06', score: 85, level: 18 },
  { date: '07/07', score: 88, level: 20 },
]
