# TOEIC Learning Platform

Ứng dụng học tập TOEIC được xây dựng với React và Firebase, cung cấp các tính năng học tập và thực hành toàn diện.

## 🚀 Tính năng chính

- **Grammar Game**: Trò chơi ngữ pháp với nhiều chế độ khác nhau
- **Dictation Practice**: Luyện tập nghe và viết
- **Vocabulary Learning**: Học từ vựng theo chủ đề
- **Progress Tracking**: Theo dõi tiến độ học tập
- **User Authentication**: Hệ thống đăng nhập/đăng ký an toàn

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19 + TypeScript
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Deployment**: Firebase Hosting

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình Firebase
1. Tạo project Firebase mới tại [Firebase Console](https://console.firebase.google.com/)
2. Bật các service: Authentication, Firestore, Storage
3. Cập nhật cấu hình trong `src/config/firebase.ts`

### Chạy ứng dụng
```bash
# Development mode
npm start

# Production build
npm run build

# Firebase emulators (local development)
npm run firebase:emulators
```

## 🔧 Scripts có sẵn

- `npm start` - Chạy ứng dụng ở chế độ development
- `npm run build` - Build ứng dụng cho production
- `npm test` - Chạy tests
- `npm run firebase:emulators` - Chạy Firebase emulators
- `npm run firebase:deploy` - Deploy lên Firebase Hosting

## 🗄️ Cấu trúc Database

### Collections chính:
- `users` - Thông tin người dùng
- `toeic_parts` - Các phần của bài thi TOEIC
- `toeic_topics` - Chủ đề học tập
- `toeic_questions` - Câu hỏi và bài tập
- `test_results` - Kết quả bài thi
- `vocabulary` - Từ vựng và ý nghĩa

## 🔐 Security Rules

Ứng dụng sử dụng Firebase Security Rules để bảo vệ dữ liệu:
- Người dùng chỉ có thể đọc/ghi dữ liệu của mình
- Dữ liệu TOEIC công khai để đọc
- Chỉ admin mới có thể thêm/sửa/xóa dữ liệu hệ thống

## 📱 Responsive Design

Ứng dụng được thiết kế responsive và hoạt động tốt trên:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
npm run firebase:deploy
```

### Vercel
```bash
npm run build
vercel --prod
```

## 📚 Tài liệu tham khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Project này được phát hành dưới MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng:
- Tạo issue trên GitHub
- Liên hệ qua email: support@thanhtoeic.com

---

**Lưu ý**: Đây là phiên bản beta. Một số tính năng có thể chưa hoàn thiện.
