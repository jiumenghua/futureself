// ============================================================
// weather.ts — 天气查询服务
// 使用 wttr.in 免费 API，无需 Key
// 按城市缓存同日天气，失败降级返回 null
// ============================================================

import axios from 'axios'

interface WeatherResult {
  text: string    // 天气描述（如 "晴"、"小雨"）
  temp: number    // 温度（摄氏度）
}

// 缓存：同城市当日只请求一次
const cache = new Map<string, { data: WeatherResult | null; date: string }>()

/**
 * 获取城市当日天气
 * @param city 城市名（如 "北京"、"上海"），为空则返回 null
 */
export async function getWeather(city: string): Promise<WeatherResult | null> {
  if (!city || !city.trim()) return null

  const trimmed = city.trim()
  const today = new Date().toISOString().slice(0, 10)

  // 检查缓存
  const cached = cache.get(trimmed)
  if (cached && cached.date === today) return cached.data

  try {
    const url = `https://wttr.in/${encodeURIComponent(trimmed)}?format=j1`
    const res = await axios.get(url, { timeout: 8000 })

    const current = res.data?.current_condition?.[0]
    if (!current) {
      cache.set(trimmed, { data: null, date: today })
      return null
    }

    const result: WeatherResult = {
      text: current.weatherDesc?.[0]?.value || '未知',
      temp: parseInt(current.temp_C, 10) || 0,
    }

    cache.set(trimmed, { data: result, date: today })
    return result
  } catch (err) {
    console.warn(`[Weather] 获取天气失败 (${trimmed}):`, (err as Error).message)
    cache.set(trimmed, { data: null, date: today })
    return null
  }
}
