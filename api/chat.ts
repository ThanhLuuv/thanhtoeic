import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Cấu hình CORS và whitelist origin
  const origin = req.headers.origin || ''

  const defaultAllowedOrigins = [
    'https://toeic.thanhlaptrinh.online',
    'https://thanhlaptrinh.online',
    'http://localhost:3000', // CRA dev
    'http://localhost:5173'  // Vite dev
  ]

  const extraAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const allowedOrigins = new Set<string>([...defaultAllowedOrigins, ...extraAllowedOrigins])
  const isAllowedOrigin = origin ? allowedOrigins.has(origin) : false

  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    if (!isAllowedOrigin) {
      return res.status(403).json({ error: 'Forbidden origin' })
    }
    return res.status(200).end()
  }

  // Chỉ cho phép POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Chặn origin lạ
  if (!isAllowedOrigin) {
    return res.status(403).json({ error: 'Forbidden origin' })
  }

  const { messages, model = 'gpt-4o', max_tokens = 500, temperature = 0.7 } = req.body || {}

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Bad payload: messages must be an array' })
  }

  // Validate input
  if (max_tokens > 2000) {
    return res.status(400).json({ error: 'max_tokens too high' })
  }

  if (temperature < 0 || temperature > 2) {
    return res.status(400).json({ error: 'Invalid temperature value' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json(errorData)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return res.status(500).json({
      error: error?.message || 'Server error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    })
  }
}
