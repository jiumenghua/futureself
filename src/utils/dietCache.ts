// ============================================================
// dietCache.ts — 饮食推荐本地缓存
// ============================================================

const DIET_KEY = (userId: string) => `fs_diet_${userId}`

export interface CachedDietMeal {
  mealType: string
  foodContent: string
  reminder: string
  tip: string
  date: string
  createdAt: string
}

export function loadCachedDiet(userId: string): Record<string, CachedDietMeal> {
  try {
    const raw = localStorage.getItem(DIET_KEY(userId))
    if (!raw) return {}
    const data = JSON.parse(raw)
    return data || {}
  } catch { return {} }
}

export function saveCachedDiet(userId: string, meals: Record<string, CachedDietMeal>): void {
  try {
    localStorage.setItem(DIET_KEY(userId), JSON.stringify(meals))
  } catch { /* full */ }
}

/** 缓存今日某餐次推荐 */
export function setCachedMeal(userId: string, date: string, meal: CachedDietMeal): void {
  const all = loadCachedDiet(userId)
  // 清理非今日缓存
  Object.keys(all).forEach((k) => { if (!k.startsWith(date)) delete all[k] })
  all[`${date}_${meal.mealType}`] = meal
  saveCachedDiet(userId, all)
}

/** 获取缓存中最近一条气泡消息 */
export function getLatestMealBubble(userId: string): string {
  const all = loadCachedDiet(userId)
  const today = new Date().toISOString().slice(0, 10)
  const meals = Object.values(all).filter((m) => m.date === today)
  return meals.length > 0 ? meals[meals.length - 1].reminder : ''
}
