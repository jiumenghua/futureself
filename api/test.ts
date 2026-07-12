// Minimal Vercel serverless function for testing
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    success: true,
    message: 'Serverless function is working!',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  })
}
