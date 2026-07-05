# 🔗 DeepSeek API 调用

此文件夹下的 `deepseek.ts` 是项目中**唯一直接发起 HTTP 请求调用 DeepSeek API** 的核心文件。

所有其他模块通过导入该文件间接使用 DeepSeek：
- `routes/chat.ts` — AI 聊天回复
- `routes/diet.ts` — 饮食推荐
- `routes/behavior.ts` — 久坐提醒话术
- `routes/today.ts` — 每日建议
- `routes/journey.ts` — 成长评价
- `routes/calendar.ts` — 日历事件
