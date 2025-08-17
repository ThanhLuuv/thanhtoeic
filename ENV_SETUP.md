# Environment Setup

## OpenAI API Configuration

Để sử dụng tính năng generate example sentences và phonetic transcriptions, bạn cần cấu hình OpenAI API key:

### 1. Lấy OpenAI API Key
- Truy cập: https://platform.openai.com/api-keys
- Tạo API key mới hoặc sử dụng key có sẵn

### 2. Cấu hình Environment Variable
Tạo file `.env` trong thư mục gốc của project:

```bash
# OpenAI Configuration
REACT_APP_API_KEY_OPENAI=your_actual_api_key_here

# Environment
NODE_ENV=development
```

### 3. Bảo mật
⚠️ **QUAN TRỌNG**: 
- Không bao giờ commit file `.env` vào git
- File `.env` đã được thêm vào `.gitignore`
- API key sẽ được gửi trực tiếp từ frontend đến OpenAI (không qua backend)
- Để bảo mật hơn, nên tạo backend API để proxy OpenAI requests

### 4. Kiểm tra cấu hình
Sau khi cấu hình, restart development server:

```bash
npm start
```

Tính năng generate example và phonetic transcriptions sẽ tự động hoạt động nếu API key được cấu hình đúng.

### 5. Troubleshooting
- Nếu gặp lỗi "API key không được cấu hình": Kiểm tra file `.env` và restart server
- Nếu gặp lỗi "Unauthorized": Kiểm tra API key có đúng và còn hạn không
- Nếu gặp lỗi "Rate limit": Đợi vài phút rồi thử lại 