// ============================================================
// mock/discover.ts — Discover 页面 Mock 兜底数据
// ============================================================

/** DiscoverCapabilities — AI 能力卡片 */
export const mockCapabilities = [
  { id: 'c1', icon: '💬', title: '智能对话', description: '随时随地和 FutureSelf 聊天，获得学习和生活上的帮助', status: 'active', agentLabel: 'Chat Agent', color: '#4A90D9' },
  { id: 'c2', icon: '📅', title: '日程管理', description: 'AI 帮你管理学习和生活日程，重要事件不遗漏', status: 'active', agentLabel: 'Schedule Agent', color: '#5B8DEF' },
  { id: 'c3', icon: '📊', title: '成长追踪', description: '记录你的成长轨迹，用数据可视化展示进步', status: 'active', agentLabel: 'Growth Agent', color: '#7B6BDB' },
  { id: 'c4', icon: '🍽️', title: '饮食推荐', description: '根据你的口味偏好，智能推荐每日饮食方案', status: 'beta', agentLabel: 'Diet Agent', color: '#F5A623' },
  { id: 'c5', icon: '🧠', title: '学习分析', description: '分析你的学习习惯和效率，给出个性化建议', status: 'beta', agentLabel: 'Study Agent', color: '#50B86C' },
  { id: 'c6', icon: '🔔', title: '智能提醒', description: '主动推送你关心的提醒，不错过重要时刻', status: 'active', agentLabel: 'Notify Agent', color: '#E85D75' },
]

/** DiscoverLearning — AI 正在学习的标签 */
export const mockLearnedTags = [
  { label: '机器人工程', category: 'study' },
  { label: '晚间学习型', category: 'study' },
  { label: '清淡口味', category: 'food' },
  { label: '爱喝咖啡', category: 'food' },
  { label: '自律型', category: 'life' },
  { label: '英语六级', category: 'goal' },
  { label: '内向但温暖', category: 'emotion' },
  { label: 'AI 爱好者', category: 'interest' },
]

/** DiscoverComingSoon */
export const mockComingSoonItems = [
  { id: 's1', icon: '🎮', title: '游戏化成长', description: '完成任务获取经验值和奖励，让成长充满乐趣' },
  { id: 's2', icon: '👥', title: '同伴匹配', description: '找到志同道合的学习伙伴，一起进步' },
  { id: 's3', icon: '🎯', title: '目标分解', description: 'AI 帮你把大目标拆解成可执行的小步骤' },
]
