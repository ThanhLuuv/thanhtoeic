# Hướng dẫn thiết lập biến môi trường

## Vấn đề hiện tại
Dự án của bạn không load được biến môi trường vì thiếu file `.env`. Các biến như `process.env.REACT_APP_API_KEY_OPENAI` đang trả về `undefined`.

## Cách khắc phục

### Bước 1: Tạo file .env
Tạo file `.env` trong thư mục gốc của dự án (cùng cấp với `package.json`):

```bash
# Trong thư mục gốc dự án
touch .env
```

### Bước 2: Thêm các biến môi trường
Mở file `.env` và thêm các biến sau:

```env
# API Keys
REACT_APP_API_KEY_OPENAI=your_openai_api_key_here
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_GOOGLE_TTS_KEY=your_google_tts_key_here

# App Configuration
REACT_APP_APP_NAME=TOEIC Vocabulary Practice
REACT_APP_VERSION=1.0.0
```

### Bước 3: Lấy API Keys

#### OpenAI API Key:
1. Đăng ký tại https://platform.openai.com/
2. Tạo API key mới
3. Copy và paste vào `REACT_APP_API_KEY_OPENAI`

#### Google TTS Key:
1. Đăng ký Google Cloud Console
2. Bật Text-to-Speech API
3. Tạo API key
4. Copy và paste vào `REACT_APP_GOOGLE_TTS_KEY`

#### Gemini API Key (nếu cần):
1. Đăng ký tại https://makersuite.google.com/app/apikey
2. Tạo API key
3. Copy và paste vào `REACT_APP_GEMINI_API_KEY`

### Bước 4: Restart development server
Sau khi tạo file `.env`, bạn cần restart server:

```bash
npm start
```

## Lưu ý quan trọng

1. **File .env phải ở thư mục gốc**: Cùng cấp với `package.json`
2. **Tên biến phải bắt đầu bằng REACT_APP_**: Create React App chỉ load các biến có prefix này
3. **Không commit file .env**: File này đã được thêm vào `.gitignore`
4. **Restart server**: Mọi thay đổi trong `.env` cần restart server để có hiệu lực

## Kiểm tra biến môi trường

Bạn có thể kiểm tra xem biến môi trường đã load chưa bằng cách:

```javascript
console.log('API Key:', process.env.REACT_APP_API_KEY_OPENAI);
```

Nếu hiển thị `undefined` thì file `.env` chưa được tạo đúng cách. 