// ============================================================
// deepseek.ts — DeepSeek API 通用调用封装 🔗 [调用DeepSeek API]
// 兼容 OpenAI 格式，注入 FutureSelf 系统人设
// ============================================================

import axios, { AxiosError } from 'axios'
import { config } from '../config'
import type { ChatMessage } from '../types'
import type { IUserProfile } from '../models/userProfile'

// ============================================================
// FutureSelf 系统人设
// ============================================================
const SYSTEM_PROMPT = `你叫 FutureSelf，是一个面向大学生的 AI 主动成长陪伴伙伴。

【你的身份】
你不是一个冰冷的工具，也不是一个只会回答问题的机器人。你是一位长期陪伴大学生成长的朋友。

【你的性格】
- 温暖、真诚、有共情力
- 像朋友一样说话，不生硬，不使用"检测到""分析完成""后台"等系统化用语
- 语气自然、克制，不过度热情，不虚假
- 知道什么时候该鼓励，什么时候该安静陪伴

【你的能力】
- 帮助大学生管理学习、饮食、课程、校园事务
- 关注用户的情绪变化，给予陪伴和支持
- 记录成长轨迹，帮助用户看到自己的进步
- 提供个性化建议，但不强加观点

【回复原则】
- 使用中文，像朋友聊天一样自然
- 避免技术术语和系统提示风格
- 回复简洁有温度，不超过 300 字（除非用户要求详细解答）
- 多用"你"而不是"用户"，像在和一个真实的人对话
- 当用户情绪低落时，先共情再给建议
- 当用户有进步时，真诚地肯定和鼓励

记住：你的目标不是展示你有多强大，而是让用户感受到被理解、被陪伴。`

// ============================================================
// API 客户端
// ============================================================
const apiClient = axios.create({
  baseURL: config.deepseek.baseUrl,
  timeout: 60000, // 60s 超时
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.deepseek.apiKey}`,
  },
})

// 响应拦截：统一错误处理
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        console.error('[DeepSeek] API Key 无效或已过期')
        throw new Error('AI_API_KEY_ERROR')
      } else if (status === 429) {
        console.error('[DeepSeek] API 调用频率超限')
        throw new Error('AI_RATE_LIMITED')
      } else {
        console.error(`[DeepSeek] API 错误 (${status}):`, error.response.data)
        throw new Error('AI_API_ERROR')
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('[DeepSeek] 请求超时')
      throw new Error('AI_TIMEOUT')
    }
    console.error('[DeepSeek] 网络错误:', error.message)
    throw new Error('AI_NETWORK_ERROR')
  }
)

// ============================================================
// 核心调用方法
// ============================================================

interface CallOptions {
  /** 系统提示词，会与默认人设合并 */
  systemPrompt?: string
  /** 对话历史（不含 system message） */
  messages?: ChatMessage[]
  /** 用户当前消息 */
  userMessage: string
  /** 温度参数（0-2），默认 0.7 */
  temperature?: number
  /** 最大 token，默认 2048 */
  maxTokens?: number
}

/**
 * 通用 DeepSeek 调用
 */
export async function callDeepSeek(options: CallOptions): Promise<string> {
  const systemContent = options.systemPrompt
    ? `${SYSTEM_PROMPT}\n\n【当前场景补充说明】\n${options.systemPrompt}`
    : SYSTEM_PROMPT

  const messages: ChatMessage[] = [
    { role: 'system', content: systemContent },
    ...(options.messages || []),
    { role: 'user', content: options.userMessage },
  ]

  const res = await apiClient.post('/v1/chat/completions', {
    model: config.deepseek.model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2048,
    stream: false,
  })

  const reply = res.data?.choices?.[0]?.message?.content
  if (!reply) {
    throw new Error('AI_EMPTY_RESPONSE')
  }

  return reply.trim()
}

// ============================================================
// 三个核心业务场景
// ============================================================

/**
 * 构建画像 System Prompt（chatCompletion 内部使用）
 */
function buildProfilePrompt(profile: IUserProfile): string {
  const parts: string[] = []
  parts.push('【用户成长档案 — FutureSelf 已了解的信息】')

  // ---- 基础信息 ----
  const { school, major, grade } = profile.baseInfo || {}
  if (school || major || grade) {
    const infoParts: string[] = []
    if (school) infoParts.push(school)
    if (major) infoParts.push(major)
    if (grade) infoParts.push(grade)
    parts.push(`- 当前身份：${infoParts.join(' / ')}`)
  }

  // ---- 成长目标 ----
  if (profile.goals?.length) {
    const goalTexts = profile.goals.map((g) => g.content).join('、')
    parts.push(`- 成长目标：${goalTexts}`)
  }

  // ---- 学习画像 ----
  if (profile.learningProfile?.details?.length) {
    parts.push(`- 学习习惯：${profile.learningProfile.details.join('；')}`)
  }

  // ---- 饮食画像 ----
  if (profile.dietProfile?.details?.length) {
    parts.push(`- 饮食偏好：${profile.dietProfile.details.join('；')}`)
  }

  // ---- 性格画像 ----
  if (profile.personalityProfile?.details?.length) {
    parts.push(`- 性格特点：${profile.personalityProfile.details.join('；')}`)
  }

  // ---- 结尾提示 ----
  parts.push('')
  parts.push('【重要】请根据以上画像自然回复用户：')
  parts.push('- 不要重复询问已知信息（如已知专业就别再问了）')
  parts.push('- 回答自然口语化，像朋友一样')
  parts.push('- 结合用户习惯和偏好给出建议')
  parts.push('- 不编造不存在的画像信息')

  return parts.join('\n')
}

/**
 * ① 聊天接口：支持多轮对话 + 画像注入
 * @param history 历史消息
 * @param userMessage 用户当前消息
 * @param context 页面上下文
 * @param userProfile 可选用户画像，传入后自动注入到 System Prompt
 */
export async function chatCompletion(
  history: ChatMessage[],
  userMessage: string,
  context?: { page?: string },
  userProfile?: IUserProfile | null
): Promise<string> {
  let sceneHint = ''
  if (context?.page) {
    sceneHint = `用户当前在"${context.page}"页面。请结合页面场景进行回复。`
  }

  // 有画像时构建完整画像 System Prompt
  if (userProfile) {
    const profilePrompt = buildProfilePrompt(userProfile)
    sceneHint = sceneHint ? `${sceneHint}\n\n${profilePrompt}` : profilePrompt
  }

  return callDeepSeek({
    systemPrompt: sceneHint || undefined,
    messages: history,
    userMessage,
    temperature: 0.8,
  })
}

/**
 * ② 每日建议接口：为 Today 页生成个性化建议
 */
export async function generateDailyAdvice(
  userProfile: Record<string, any>,
  todayCourses: string[],
  growthSummary: string
): Promise<string> {
  const systemPrompt = `用户正在查看今日主页。你需要生成一份温暖的今日建议。

请以 JSON 格式输出（不要包含 markdown 代码块标记），包含以下字段：
- study: { title, content, tip } — 学习建议
- food: { title, content, tip } — 饮食建议
- emotion: { title, content, tip } — 情绪建议
- summary: 一句话总结今日建议（20字以内）

用户信息：${JSON.stringify(userProfile)}
今日课程：${todayCourses.join('、') || '无课程安排'}
近期成长概况：${growthSummary || '暂无历史数据'}`

  return callDeepSeek({
    systemPrompt,
    userMessage: '请为我生成今天的个性化成长建议。',
    temperature: 0.7,
    maxTokens: 1024,
  })
}

/**
 * ③ 成长评价接口：为 Journey 页生成有温度的成长总结
 */
export async function generateGrowthEvaluation(
  userProfile: Record<string, any>,
  periodLabel: string,
  growthData: Array<{ type: string; title: string; date: string }>
): Promise<string> {
  const dataText = growthData
    .map((d) => `- ${d.date}: [${d.type}] ${d.title}`)
    .join('\n')

  const systemPrompt = `用户正在查看成长时间线页面。你需要根据用户${periodLabel}的成长数据，生成有温度的成长评价。

请以 JSON 格式输出（不要包含 markdown 代码块标记），包含以下字段：
- summary: 总体评价（100字以内，温暖、像朋友聊天）
- highlights: 亮点列表（2-3个字符串数组）
- suggestions: 改进建议（1-2个字符串数组，温和地给出）
- encouragement: 一段鼓励的话（50字左右）

用户信息：${JSON.stringify(userProfile)}
${periodLabel}成长记录：\n${dataText || '暂无记录'}`

  return callDeepSeek({
    systemPrompt,
    userMessage: `请评价我${periodLabel}的成长情况，给我一些温暖的建议和鼓励。`,
    temperature: 0.75,
    maxTokens: 1024,
  })
}

// ============================================================
// ④ 图片对话：使用 DeepSeek 视觉能力分析图片
// ============================================================

/**
 * 发送图片给 DeepSeek 进行分析
 * @param imageUrl 图片的公开可访问 URL
 * @param userMessage 用户附带的问题
 */
export async function chatWithImage(imageUrl: string, userMessage: string): Promise<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: [
        { type: 'text', text: userMessage || '请描述这张图片的内容，并结合FutureSelf作为大学生成长伙伴的定位给出建议。' },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    },
  ]

  const res = await apiClient.post('/v1/chat/completions', {
    model: config.deepseek.model,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
  })

  const reply = res.data?.choices?.[0]?.message?.content
  if (!reply) throw new Error('AI_EMPTY_RESPONSE')
  return reply.trim()
}

// ============================================================
// ⑤ 文档对话：将文档文本作为上下文发送
// ============================================================

/**
 * 基于文档内容进行对话
 * @param documentText 从文档提取的纯文本
 * @param fileName 文档名称
 * @param userMessage 用户附带的问题
 */
export async function chatWithDocument(
  documentText: string,
  fileName: string,
  userMessage: string
): Promise<string> {
  const systemPrompt = `用户上传了一个文档"${fileName}"。以下是文档的文本内容，请基于此内容回答用户的问题。

文档内容：
---
${documentText.slice(0, 8000)}
---
${documentText.length > 8000 ? '\n（文档内容较长，以上为前8000字符的摘要）' : ''}`

  return callDeepSeek({
    systemPrompt,
    userMessage: userMessage || `请总结这个文档的主要内容，并根据内容给我一些建议。`,
    temperature: 0.7,
    maxTokens: 2048,
  })
}

// ============================================================
// ⑥ 会话标题生成：根据首轮对话内容生成 5-15 字概述
// ============================================================

export async function generateConversationTitle(
  userMessage: string,
  aiReply: string
): Promise<string> {
  const prompt = `请根据以下对话内容，生成一个 5-15 个字的简短标题，概括这次对话的主题。

用户：${userMessage.slice(0, 200)}
AI：${aiReply.slice(0, 200)}

只需输出标题文字本身，不需要引号、标点或其他额外内容。`

  const title = await callDeepSeek({
    systemPrompt: '你是一个标题生成助手。你只输出简短的对话标题，不输出其他任何内容。',
    userMessage: prompt,
    temperature: 0.5,
    maxTokens: 50,
  })

  // 清理：去掉可能的引号、换行、多余空格
  return title.replace(/[""'']/g, '').replace(/\n/g, ' ').trim().slice(0, 20)
}

// ============================================================
// ⑦ AI 赛事日历同步
// ============================================================

import { CalendarEvent } from '../models/CalendarEvent'

export async function syncCalendarEvents(
  userId: string,
  profile: { school: string; major: string; grade: string; categories: string[] }
): Promise<number> {
  const cats = profile.categories.length > 0 ? profile.categories.join('、') : '算法竞赛、英语竞赛、学科考试、创新创业'

  const prompt = `用户信息：学校 ${profile.school || '未知'}，专业 ${profile.major || '未知'}，年级 ${profile.grade || '未知'}，订阅类别 ${cats}。

请列出该专业大学生在校期间值得参加的主流竞赛、重要学业节点（期中期末、考级等），按日期排序。返回 JSON 数组格式：
[{"title":"事件名称","type":"competition|exam|study","category":"分类","date":"YYYY-MM-DD","description":"简要说明","officialUrl":""}]

规则：
1. 只返回未来12个月内的事件（当前日期：${new Date().toISOString().slice(0, 10)}）
2. type: competition(竞赛) exam(考试) study(学业节点)
3. 事件名称和日期要合理，不要编造不存在的竞赛
4. 最多返回15条
5. 只输出 JSON 数组，不要包含 markdown 代码块`

  const rawJson = await callDeepSeek({
    systemPrompt: '你是大学生赛事日历助手，只输出合法JSON数组，不输出其他内容。',
    userMessage: prompt,
    temperature: 0.3,
    maxTokens: 2048,
  })

  // 解析 AI 返回的 JSON
  let events: any[] = []
  try {
    const cleaned = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    events = JSON.parse(cleaned)
    if (!Array.isArray(events)) events = []
  } catch {
    return 0
  }

  // 去重 + 批量写入
  let added = 0
  for (const ev of events) {
    if (!ev.title || !ev.date) continue
    const date = new Date(ev.date)
    if (isNaN(date.getTime())) continue

    // 检查是否已存在同名+同日期的 AI 事件
    const exists = await CalendarEvent.findOne({ userId, title: ev.title, date, source: 'ai_auto' })
    if (exists) continue

    await CalendarEvent.create({
      userId,
      title: ev.title,
      type: ev.type || 'custom',
      category: ev.category || '',
      date,
      description: ev.description || '',
      source: 'ai_auto',
      officialUrl: ev.officialUrl || '',
      remindEnabled: true,
      remindDays: 3,
    })
    added++
  }

  return added
}

// ============================================================
// ⑧ 聊天中提取日历事件（意图识别 + 结构化提取）
// ============================================================

const CALENDAR_KEYWORDS = /添加|提醒|帮我记|加到日历|添加事件|设置提醒|日历|别忘了|记一下|帮我添加|新建事件|加个事件|remind me|add event|calendar|set reminder/

export function detectCalendarIntent(message: string): boolean {
  return CALENDAR_KEYWORDS.test(message)
}

export interface ExtractedEvent {
  title: string
  date: string
  type: string
  description: string
}

export async function extractCalendarEvent(message: string): Promise<ExtractedEvent | null> {
  try {
    const prompt = `请从以下用户消息中提取日历事件信息。如果用户提到了具体的事件名称和日期，请提取出来；如果信息不完整（比如没有日期），返回 null。

用户消息：${message}

请以 JSON 格式返回（只输出 JSON，不要 markdown）：
如果能提取：{"title":"事件名称","date":"YYYY-MM-DD","type":"competition|exam|study|custom","description":"简要说明"}
如果无法提取完整信息：null

注意：
- 日期必须能转换为 YYYY-MM-DD 格式。如用户说"下周五"，请计算具体日期（今天是 ${new Date().toISOString().slice(0, 10)}）。
- 如用户说"5月20日"，请用当前年份。
- type 默认用 custom。如提到比赛→competition，考试→exam，学习→study。
- description 可为空字符串。`

    const raw = await callDeepSeek({
      systemPrompt: '你是一个日历事件提取助手。你只输出合法 JSON 或 null，不输出其他内容。',
      userMessage: prompt,
      temperature: 0.2,
      maxTokens: 300,
    })

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    if (cleaned === 'null' || cleaned === '') return null
    const parsed = JSON.parse(cleaned)
    if (!parsed || !parsed.title || !parsed.date) return null
    if (isNaN(new Date(parsed.date).getTime())) return null
    return parsed as ExtractedEvent
  } catch {
    return null
  }
}

// ============================================================
// ⑨ AI 智能饮食推荐
// ============================================================

const MEAL_LABELS: Record<string, string> = {
  breakfast: '早餐', lunch: '午餐', dinner: '晚餐',
}

export interface DietAdviceResult {
  reminder: string                                              // 气泡简短提醒
  recommendations: Array<{ name: string; reason: string }>      // 2-3 条推荐
  tip: string                                                   // 贴心提示
}

export async function generateDietAdvice(params: {
  campus: string
  preferences: string[]
  taboos: string[]
  recentDietRecords: string[]
  weather: { text: string; temp: number } | null
  mealType: 'breakfast' | 'lunch' | 'dinner'
}): Promise<DietAdviceResult> {
  const mealLabel = MEAL_LABELS[params.mealType] || params.mealType
  const prefStr = params.preferences.length > 0 ? params.preferences.join('、') : '无特殊偏好'
  const tabooStr = params.taboos.length > 0 ? params.taboos.join('、') : '无'
  const recentStr = params.recentDietRecords.length > 0
    ? params.recentDietRecords.map((r, i) => `${i + 1}. ${r}`).join('\n')
    : '暂无近3天饮食记录'
  const weatherStr = params.weather
    ? `${params.weather.text}，温度 ${params.weather.temp}°C`
    : '未知（未获取到天气数据）'

  const prompt = `你是温暖贴心的大学生成长陪伴 AI，现在到了${mealLabel}时间，请给用户生成饮食建议。

用户信息：
- 所在校区：${params.campus || '未填写'}
- 饮食偏好：${prefStr}
- 饮食忌口：${tabooStr}
- 近 3 天饮食记录：
${recentStr}
- 今日天气：${weatherStr}

要求：
1. 结合天气给出适配建议（天热推荐清淡凉爽、天冷推荐暖食热汤、下雨推荐就近食堂）
2. 参考近 3 天饮食，避免重复推荐同品类
3. ${params.campus ? `结合校区「${params.campus}」推荐 2-3 个周边高口碑食堂窗口或平价外卖，符合学生消费水平` : '推荐 2-3 个适合大学生的平价菜品'}
4. 避开用户忌口：${tabooStr}
5. 语气亲切自然，像朋友提醒一样，不要生硬，不要用"检测到""分析完成"等系统化用语

请以 JSON 格式输出（不要包含 markdown 代码块标记）：
{
  "reminder": "一句温暖的饭点提醒（20字以内），如'到饭点啦～今天天热，推荐你试试食堂的凉面窗口哦'",
  "recommendations": [
    { "name": "推荐菜品/窗口名称", "reason": "推荐理由（结合天气/偏好/历史）" }
  ],
  "tip": "一句贴心小提示（15字以内），如'记得多喝水哦'"
}
recommendations 数组包含 2-3 条推荐。`

  try {
    const raw = await callDeepSeek({
      systemPrompt: '你是一个贴心的大学生饮食推荐助手。你只输出合法 JSON，不输出其他内容。',
      userMessage: prompt,
      temperature: 0.7,
      maxTokens: 800,
    })

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      reminder: parsed.reminder || `到${mealLabel}时间啦～记得好好吃饭哦 😋`,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 3) : [],
      tip: parsed.tip || '好好吃饭，照顾好自己 💪',
    }
  } catch {
    // 降级：通用建议
    const defaults: Record<string, DietAdviceResult> = {
      breakfast: {
        reminder: '早上好～记得吃早餐，开启元气满满的一天 ☀️',
        recommendations: [
          { name: '食堂豆浆油条', reason: '经典搭配，暖胃舒心' },
          { name: '包子+鸡蛋+牛奶', reason: '蛋白质充足，上午精力充沛' },
        ],
        tip: '早餐是一天最重要的一餐哦',
      },
      lunch: {
        reminder: '到饭点啦～放下手头的事，好好吃个午饭吧 🍚',
        recommendations: [
          { name: '食堂自选快餐', reason: '荤素搭配，营养均衡' },
          { name: '麻辣烫/香锅', reason: '自选食材，想吃啥拿啥' },
        ],
        tip: '午餐吃饱，下午才有精神',
      },
      dinner: {
        reminder: '晚餐时间到～记得按时吃饭，别太晚哦 🌆',
        recommendations: [
          { name: '食堂盖浇饭', reason: '份量适中，晚餐刚刚好' },
          { name: '清汤面/米线', reason: '清淡暖胃，晚上不油腻' },
        ],
        tip: '晚饭七分饱，睡眠质量好',
      },
    }
    return defaults[params.mealType] || defaults.lunch
  }
}

// ============================================================
// ⑩ AI 成长档案提取：从多轮对话中增量提取用户长期画像
// ============================================================

export interface GrowthProfileExtract {
  baseInfo?: { school?: string; major?: string; grade?: string }
  newGoals?: string[]
  learningAdd?: string[]
  dietAdd?: string[]
  personalityAdd?: string[]
  newDiscoveries?: string[]
}

/**
 * 从多轮对话历史中增量提取成长档案信息
 * @param chatHistory 最近 N 轮对话消息
 * @param currentProfile 当前已有的完整画像（含各维度的 tags + details）
 * @returns 仅返回有变化的新字段，无变化时返回空对象
 */
export async function extractGrowthProfile(
  chatHistory: ChatMessage[],
  currentProfile: {
    baseInfo?: { school?: string; major?: string; grade?: string }
    goals?: string[]
    learningDetails?: string[]
    dietDetails?: string[]
    personalityDetails?: string[]
    discoveryContents?: string[]
  }
): Promise<GrowthProfileExtract> {
  // 构建对话历史文本
  const historyText = chatHistory
    .map((m) => `${m.role === 'user' ? '用户' : 'AI'}：${m.content.slice(0, 200)}`)
    .join('\n')

  // 构建当前画像文本
  const profileParts: string[] = []
  if (currentProfile.baseInfo) {
    const bi = currentProfile.baseInfo
    if (bi.school || bi.major || bi.grade) {
      profileParts.push(`- 当前身份：${[bi.school, bi.major, bi.grade].filter(Boolean).join(' / ')}`)
    }
  }
  if (currentProfile.goals?.length) profileParts.push(`- 成长目标：${currentProfile.goals.join('、')}`)
  if (currentProfile.learningDetails?.length) profileParts.push(`- 学习画像：${currentProfile.learningDetails.join('、')}`)
  if (currentProfile.dietDetails?.length) profileParts.push(`- 饮食画像：${currentProfile.dietDetails.join('、')}`)
  if (currentProfile.personalityDetails?.length) profileParts.push(`- 性格画像：${currentProfile.personalityDetails.join('、')}`)
  if (currentProfile.discoveryContents?.length) profileParts.push(`- 最近发现：${currentProfile.discoveryContents.join('、')}`)

  const existingText = profileParts.length > 0 ? profileParts.join('\n') : '（暂无画像数据）'

  const prompt = `你是一个温暖的大学生成长陪伴 AI。请从以下多轮对话中提取关于用户的**长期成长档案信息**。

【当前已有的画像数据】
${existingText}

【本次对话历史】
${historyText}

【提取规则】
1. 仔细分析用户在对话中透露的个人信息：学校、专业、年级、目标、学习习惯、饮食偏好、性格特点等
2. 仅提取**长期有效**的信息（不是临时的，如"今天吃了麻辣烫"就不算）
3. 仅返回用户**明确表达**或强烈暗示的内容，不要猜测
4. **已有信息不重复**，冲突以新信息为准
5. 没有任何新发现时，所有数组留空
6. 每个条目用简短中文描述（10-20字），像朋友记笔记一样自然

【示例】
用户说"我是学机器人工程的，准备考研，最近开始每天刷算法"
→ baseInfo: {"major": "机器人工程"}
→ newGoals: ["考研"]
→ learningAdd: ["最近开始每天刷算法"]

用户说"我特别喜欢吃辣，但最近胃不太好，常去一食堂"
→ dietAdd: ["喜欢吃辣", "最近胃不太好注意饮食", "常去一食堂"]

用户说"我今天中午吃了麻辣烫" ← 临时信息，全部留空

【输出格式】
严格输出 JSON（不要 markdown 代码块，只输出 JSON）：
{
  "baseInfo": {"school": "", "major": "", "grade": ""},
  "newGoals": [],
  "learningAdd": [],
  "dietAdd": [],
  "personalityAdd": [],
  "newDiscoveries": []
}`

  try {
    const raw = await callDeepSeek({
      systemPrompt: '你是一个用户画像分析助手。你只输出合法 JSON，不输出其他内容。',
      userMessage: prompt,
      temperature: 0.3,
      maxTokens: 1024,
    })

    // JSON 解析容错
    let cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    // 尝试提取第一个 { 到最后一个 } 之间的内容
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1)
    }

    const parsed = JSON.parse(cleaned)

    // 验证并过滤空值
    const result: GrowthProfileExtract = {}

    if (parsed.baseInfo && typeof parsed.baseInfo === 'object') {
      const bi: any = {}
      if (parsed.baseInfo.school) bi.school = parsed.baseInfo.school
      if (parsed.baseInfo.major) bi.major = parsed.baseInfo.major
      if (parsed.baseInfo.grade) bi.grade = parsed.baseInfo.grade
      if (Object.keys(bi).length > 0) result.baseInfo = bi
    }

    if (Array.isArray(parsed.newGoals) && parsed.newGoals.length > 0) result.newGoals = parsed.newGoals.filter(Boolean)
    if (Array.isArray(parsed.learningAdd) && parsed.learningAdd.length > 0) result.learningAdd = parsed.learningAdd.filter(Boolean)
    if (Array.isArray(parsed.dietAdd) && parsed.dietAdd.length > 0) result.dietAdd = parsed.dietAdd.filter(Boolean)
    if (Array.isArray(parsed.personalityAdd) && parsed.personalityAdd.length > 0) result.personalityAdd = parsed.personalityAdd.filter(Boolean)
    if (Array.isArray(parsed.newDiscoveries) && parsed.newDiscoveries.length > 0) result.newDiscoveries = parsed.newDiscoveries.filter(Boolean)

    return result
  } catch {
    // 提取失败不抛错，返回空对象让上层静默处理
    return {}
  }
}

// ============================================================
// ⑪ 情绪识别引擎：分析对话情绪，决定是否触发主动关怀
// ============================================================

export interface EmotionResult {
  emotion: '积极' | '平静' | '烦躁' | '焦虑' | '低落' | '疲惫'
  intensity: number       // 0-1
  shouldComfort: boolean   // 连续负面且强度 ≥0.6 时触发
  comfortAdvice: string    // 关怀方向建议，≤15字
}

/**
 * 分析最近对话中的用户情绪，为主动关怀提供决策依据
 * @param chatHistory 最近 3-5 轮对话
 * @param personalityProfile 用户性格画像摘要
 */
export async function analyzeEmotion(
  chatHistory: ChatMessage[],
  personalityProfile: string[]
): Promise<EmotionResult | null> {
  const historyText = chatHistory
    .map((m) => `${m.role === 'user' ? '用户' : 'AI'}：${m.content.slice(0, 150)}`)
    .join('\n')

  const personalityText = personalityProfile?.length
    ? personalityProfile.join('；')
    : '暂无性格画像'

  const prompt = `你是专业的情绪分析引擎，负责从大学生对话中识别情绪状态，为AI主动关怀提供决策依据。

【用户性格参考】
${personalityText}

【最近对话历史】
${historyText}

请完成以下分析：
1. 判断用户当前核心情绪，仅从以下选项中选择：积极、平静、烦躁、焦虑、低落、疲惫
2. 给出情绪强度，分值 0-1，越高越强烈
3. 判断是否需要主动发起关怀：连续负面情绪且强度≥0.6 时触发
4. 给出关怀方向建议，不超过15字

严格按以下JSON格式输出，不要多余内容：
{
  "emotion": "情绪类型",
  "intensity": 0.0,
  "shouldComfort": true/false,
  "comfortAdvice": "关怀方向"
}`

  try {
    const raw = await callDeepSeek({
      systemPrompt: '你是一个情绪分析引擎。你只输出合法 JSON，不输出其他内容。',
      userMessage: prompt,
      temperature: 0.2,
      maxTokens: 256,
    })

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    const json = firstBrace !== -1 && lastBrace > firstBrace
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned

    const parsed = JSON.parse(json)
    const validEmotions = ['积极', '平静', '烦躁', '焦虑', '低落', '疲惫']
    return {
      emotion: validEmotions.includes(parsed.emotion) ? parsed.emotion : '平静',
      intensity: Math.min(1, Math.max(0, Number(parsed.intensity) || 0)),
      shouldComfort: Boolean(parsed.shouldComfort),
      comfortAdvice: String(parsed.comfortAdvice || '').slice(0, 15),
    }
  } catch {
    return null
  }
}

// ============================================================
// ⑫ 久坐学习提醒话术生成
// ============================================================

export interface ProfileDimensionInput {
  tags: string[]
  details: string[]
}

/**
 * 生成久坐学习提醒个性化话术
 * @param learningProfile 用户学习画像
 * @param dietProfile 用户饮食画像
 * @returns ≤40字提醒文案
 */
export async function generateSedentaryRemind(
  learningProfile: ProfileDimensionInput,
  dietProfile: ProfileDimensionInput
): Promise<string> {
  const lpTags = learningProfile.tags?.join('、') || '暂无学习习惯数据'
  const lpDetails = learningProfile.details?.join('；') || ''
  const dpTags = dietProfile.tags?.join('、') || '暂无饮食偏好数据'
  const dpDetails = dietProfile.details?.join('；') || ''

  try {
    const reply = await callDeepSeek({
      systemPrompt: '你是 FutureSelf 温暖成长陪伴AI。你只说一句简短精炼的提醒话，不附带任何解释。',
      userMessage: `你已经连续学习45分钟了，请生成一句温柔的休息提醒。

【用户学习习惯】
标签：${lpTags}
详情：${lpDetails}

【用户饮食偏好】
标签：${dpTags}
详情：${dpDetails}

要求：
1. 结合用户的学习习惯和饮食偏好来写提醒，比如提到番茄钟、咖啡、起身活动、喝水、水果等
2. 语气轻松自然，像朋友提醒，不生硬
3. 严格控制在40字以内
4. 直接输出提醒文案，不要任何多余内容`,
      temperature: 0.8,
      maxTokens: 150,
    })
    return reply.slice(0, 40)
  } catch {
    // 降级默认文案
    const fallbacks = [
      '学了这么久，起来活动一下喝口水吧～眼睛也需要休息 ☕',
      '45分钟啦！起来走两步，看看窗外放松一下吧 🌿',
      '该休息一下啦，拉伸一下肩膀，顺便补充点水分 💧',
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }
}

// ============================================================
// ⑬ 主动交互话术生成：6 种场景个性化文案
// ============================================================

export type ProactiveScenario =
  | 'study_break'      // 久坐学习提醒
  | 'meal_reminder'    // 饭点个性化推荐
  | 'idle_chat'        // 空闲主动搭讪
  | 'emotion_comfort'  // 情绪安抚关怀
  | 'exam_care'        // 考前关怀提醒
  | 'evening_review'   // 晚间成长复盘

export interface ProactiveContext {
  scenario: ProactiveScenario
  // 不同场景需要的上下文（可选字段按需传入）
  examName?: string
  dailyData?: string
  emotion?: string
  intensity?: number
  recentStatus?: string
}

/**
 * 根据场景生成个性化主动交互话术
 * @param context 场景类型 + 上下文数据
 * @param userProfile 用户画像各维度
 */
export async function generateProactiveMessage(
  context: ProactiveContext,
  userProfile: {
    school?: string
    learningProfile?: string[]
    dietProfile?: string[]
    personalityProfile?: string[]
    goals?: string[]
  }
): Promise<string> {
  const lp = userProfile.learningProfile?.join('；') || '暂无学习习惯数据'
  const dp = userProfile.dietProfile?.join('；') || '暂无饮食偏好数据'
  const pp = userProfile.personalityProfile?.join('；') || '暂无性格数据'
  const goals = userProfile.goals?.join('、') || '暂无目标数据'
  const school = userProfile.school || '你的学校'

  const scenarioPrompts: Record<ProactiveScenario, string> = {
    study_break: `你是 FutureSelf 成长陪伴AI，用户已经连续学习45分钟了，请生成一句温柔的休息提醒。

【用户学习习惯】
${lp}
【用户饮食偏好】
${dp}

要求：
1. 结合用户的学习习惯和饮食偏好，比如提到番茄钟、咖啡、起身活动等
2. 语气轻松，不生硬，像朋友提醒
3. 控制在40字以内
直接输出提醒文案，不要多余内容。`,

    meal_reminder: `你是 FutureSelf 校园饮食推荐AI，到饭点了，请给用户生成一句个性化的吃饭提醒+菜品建议。

【用户饮食画像】
${dp}
【所在学校】
${school}

要求：
1. 结合用户口味偏好、忌口、常吃食物给出具体建议，贴合校园食堂场景
2. 自然亲切，像朋友分享，不要像外卖推荐
3. 控制在50字以内
直接输出文案，不要多余内容。`,

    idle_chat: `你是 FutureSelf 成长陪伴AI，用户现在处于空闲状态，请主动发起一句轻松的搭话。

【用户成长目标】
${goals}
【用户学习习惯】
${lp}
【近期状态】
${context.recentStatus || '日常学习'}

要求：
1. 从用户的目标、学习、兴趣切入，不要说无意义的「在吗」「干嘛呢」
2. 语气自然，像朋友找话题，不突兀
3. 可以带轻微的督促感，但不要说教
4. 控制在40字以内
直接输出搭讪文案，不要多余内容。`,

    emotion_comfort: `你是 FutureSelf 情绪陪伴AI，用户现在正处于${context.emotion || '低落'}状态，情绪强度${context.intensity ?? 0.7}。请生成一句共情安抚的话。

【用户性格特点】
${pp}

要求：
1. 先共情认可情绪，不说「别难过了」「这点事不算什么」
2. 贴合用户性格，内向用户不要太热情外放
3. 温和有力量，提供情绪价值，不给解决方案
4. 控制在50字以内
直接输出安抚文案，不要多余内容。`,

    exam_care: `你是 FutureSelf 成长陪伴AI，明天用户有${context.examName || '重要考试'}考试，请生成一句考前关怀提醒。

【用户学习习惯】
${lp}

要求：
1. 包含加油鼓励 + 实用小提醒（比如带文具、早点休息、过一遍重点）
2. 语气温暖不焦虑，不给用户压力
3. 控制在50字以内
直接输出文案，不要多余内容。`,

    evening_review: `你是 FutureSelf 成长陪伴AI，现在是晚间复盘时间，请给用户生成一句简短的当日总结+晚安问候。

【今日成长数据】
${context.dailyData || '今天也是认真度过的一天'}
【用户成长目标】
${goals}

要求：
1. 肯定当日做得好的地方，不提批评
2. 轻轻关联成长目标，不制造焦虑
3. 温暖治愈，适合睡前氛围
4. 控制在50字以内
直接输出文案，不要多余内容。`,
  }

  try {
    const reply = await callDeepSeek({
      systemPrompt: '你是 FutureSelf 温暖成长陪伴AI。你只说一句简短精炼的话，不附带任何解释。',
      userMessage: scenarioPrompts[context.scenario],
      temperature: 0.8,
      maxTokens: 200,
    })
    return reply.slice(0, 80)  // 上限截断
  } catch {
    // 降级默认文案
    const fallbacks: Record<ProactiveScenario, string> = {
      study_break: '学了这么久，起来活动一下喝口水吧～眼睛也需要休息哦 ☕',
      meal_reminder: '到饭点啦～去食堂看看今天有什么好吃的吧 🍚',
      idle_chat: '今天有什么想聊的吗？或者想让我帮你规划一下学习？',
      emotion_comfort: '我在这里陪着你呢，有时候什么都不做也是一种充电 🌿',
      exam_care: '明天考试加油！今晚早点休息，文具和证件记得提前准备好 ✨',
      evening_review: '今天辛苦了，不管怎样都是成长的一天。晚安，好梦 🌙',
    }
    return fallbacks[context.scenario]
  }
}
