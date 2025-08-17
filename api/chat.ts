import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Chặn phương thức lạ
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Kiểm tra Origin để tránh site khác gọi trộm
  const origin = req.headers.origin || ''
  const allowOrigins = [
    'https://toeic.thanhlaptrinh.online', 
    'https://thanhlaptrinh.online',
    'http://localhost:3000', // Cho development
    'http://localhost:5173'  // Cho Vite dev server
  ]
  
  if (!allowOrigins.includes(origin)) {
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

    // Trả thẳng JSON về FE
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    const data = await response.json()
    res.status(200).json(data)
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    res.status(500).json({ 
      error: error?.message || 'Server error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    })
  }
}

// Handle preflight CORS request
export async function OPTIONS(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || ''
  const allowOrigins = [
    'https://your-domain.com', 
    'https://thanhlaptrinh.online',
    'http://localhost:3000',
    'http://localhost:5173'
  ]
  
  if (allowOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
}
