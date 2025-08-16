const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { word, meaning, type, existingExamples } = req.body;
    
    if (!word || !meaning || !type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const apiKey = process.env.REACT_APP_API_KEY_OPENAI;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    const existingExamplesText = existingExamples && existingExamples.length > 0 
      ? `\n\nCÁC CÂU ĐÃ TẠO TRƯỚC ĐÓ (KHÔNG ĐƯỢC TẠO LẠI):\n${existingExamples.map((example, index) => `${index + 1}. ${example}`).join('\n')}`
      : '';

    const prompt = `Tạo một câu mẫu sử dụng từ "${word}" (${meaning}) - loại từ: ${type}.

Yêu cầu:
1. Tạo một câu tiếng Anh tự nhiên, đúng ngữ pháp ngắn và đơn giản
2. Sử dụng từ "${word}" trong ngữ cảnh phù hợp
3. Cung cấp bản dịch tiếng Việt
4. Câu phải dễ hiểu và thực tế
5. QUAN TRỌNG: KHÔNG được tạo câu giống với các câu đã tạo trước đó${existingExamplesText}

Trả về JSON với format:
{
  "exampleSentence": {
    "english": "Câu tiếng Anh mẫu",
    "vietnamese": "Bản dịch tiếng Việt",
    "wordHighlight": "${word}",
    "context": "Giải thích ngắn về cách sử dụng từ này bằng tiếng Việt"
  }
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Bạn là giáo viên tiếng Anh chuyên tạo câu mẫu để giúp học sinh hiểu cách sử dụng từ vựng trong ngữ cảnh thực tế.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Vui lòng thử lại sau vài phút.' });
      } else if (response.status === 401) {
        return res.status(401).json({ error: 'API key không hợp lệ hoặc đã hết hạn.' });
      } else if (response.status === 403) {
        return res.status(403).json({ error: 'Tài khoản không có quyền truy cập hoặc đã hết credit.' });
      } else {
        return res.status(response.status).json({ error: `OpenAI API error: ${response.status} ${response.statusText}` });
      }
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Tìm JSON trong response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
      } else {
        throw new Error('Không tìm thấy JSON trong response');
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw response:', content);
      res.status(500).json({ error: 'Lỗi phân tích response từ AI' });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
