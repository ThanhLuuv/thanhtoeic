# Vercel Deployment Guide - Bảo mật OpenAI API Key

## 🚀 Triển khai lên Vercel

### 1. Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### 2. Login vào Vercel
```bash
vercel login
```

### 3. Deploy project
```bash
vercel --prod
```

## 🔐 Bảo mật API Key

### **QUAN TRỌNG**: Cấu hình Environment Variables trên Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào tab **Settings** → **Environment Variables**
4. Thêm biến môi trường:

```
Name: OPENAI_API_KEY
Value: sk-your-actual-openai-api-key-here
Environment: Production, Preview, Development
```

**Lưu ý**: 
- **KHÔNG** sử dụng `REACT_APP_` prefix
- API key sẽ chỉ được sử dụng trong serverless function
- Frontend sẽ **KHÔNG BAO GIỜ** thấy được API key

## 🛡️ Các biện pháp bảo mật đã triển khai

### 1. Origin Whitelist
- Chỉ cho phép các domain được phép gọi API
- Chặn các site khác gọi trộm

### 2. Input Validation
- Kiểm tra method HTTP
- Validate payload format
- Giới hạn max_tokens và temperature

### 3. CORS Protection
- Chỉ cho phép POST method
- Origin validation
- Preflight request handling

### 4. Error Handling
- Không expose sensitive information
- Proper HTTP status codes
- Logging cho debugging

## 🔧 Cấu trúc API

```
/api/chat.ts - Serverless function xử lý OpenAI API calls
```

### Request Format:
```json
{
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "model": "gpt-4o",
  "max_tokens": 500,
  "temperature": 0.7
}
```

### Response:
- Trả về trực tiếp response từ OpenAI
- Giữ nguyên format và error handling

## 🚨 Troubleshooting

### Lỗi "Method not allowed"
- Đảm bảo gọi với method POST

### Lỗi "Forbidden origin"
- Kiểm tra domain trong allowOrigins array
- Thêm domain mới vào whitelist nếu cần

### Lỗi "Bad payload"
- Kiểm tra format của messages array
- Đảm bảo max_tokens và temperature hợp lệ

### Lỗi OpenAI API
- Kiểm tra OPENAI_API_KEY trong Vercel Environment Variables
- Kiểm tra credit và rate limit của OpenAI account

## 📱 Frontend Usage

Frontend giờ gọi API thông qua endpoint `/api/chat`:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages, model, max_tokens, temperature })
});

const data = await response.json();
```

## 🔄 Migration từ cũ

1. **Xóa** `REACT_APP_OPENAI_API_KEY` khỏi frontend
2. **Thêm** `OPENAI_API_KEY` vào Vercel Environment Variables
3. **Deploy** lại project
4. **Test** example generation functionality

## 📊 Monitoring

- Vercel Function logs trong dashboard
- OpenAI API usage tracking
- Error rate monitoring
- Performance metrics
