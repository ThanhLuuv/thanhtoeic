# Firebase Migration Guide

## Tổng quan
Dự án đã được chuyển đổi từ REST API sang Firebase để sử dụng các dịch vụ cloud của Google.

## Các thay đổi chính

### 1. Cấu hình Firebase
- File: `src/config/firebase.ts`
- Chứa cấu hình Firebase và khởi tạo các service
- Sử dụng project ID: `thanhtoeic-e1f58`

### 2. Services mới

#### Firebase Service (`src/services/firebaseService.ts`)
- Service cơ bản cho tất cả các collection
- Hỗ trợ CRUD operations, pagination, querying
- Collections: `toeic`, `vocabulary`, `users`, `testResults`

#### Firebase Auth Service (`src/services/firebaseAuthService.ts`)
- Thay thế `authService.ts` cũ
- Sử dụng Firebase Authentication
- Quản lý user profile trong Firestore
- Hỗ trợ real-time auth state changes

#### Firebase TOEIC Service (`src/services/firebaseToeicService.ts`)
- Service chuyên biệt cho TOEIC data
- Quản lý parts, topics, questions, test results
- Hỗ trợ statistics và analytics

### 3. Cấu trúc Database

#### Collections trong Firestore:

```
users/
  - uid: { email, fullName, role, status, ... }

toeic_parts/
  - partId: { name, description, questionCount, timeLimit, ... }

toeic_topics/
  - topicId: { name, description, partId, difficulty, ... }

toeic_questions/
  - questionId: { partId, topicId, questionText, options, correctAnswer, ... }

test_results/
  - resultId: { userId, partId, score, answers, completedAt, ... }

vocabulary/
  - wordId: { word, meaning, examples, difficulty, ... }
```

### 4. Cách sử dụng

#### Authentication:
```typescript
import { firebaseAuthService } from '../services';

// Đăng ký
const result = await firebaseAuthService.register({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'User Name'
});

// Đăng nhập
const result = await firebaseAuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Kiểm tra trạng thái
if (firebaseAuthService.isAuthenticated()) {
  const user = firebaseAuthService.getCurrentUser();
}
```

#### TOEIC Data:
```typescript
import { firebaseToeicService } from '../services';

// Lấy tất cả parts
const parts = await firebaseToeicService.getParts();

// Lấy questions theo part
const questions = await firebaseToeicService.getQuestionsByPart('part1');

// Lưu test result
const resultId = await firebaseToeicService.saveTestResult({
  userId: 'user123',
  partId: 'part1',
  score: 85,
  totalQuestions: 10,
  correctAnswers: 8,
  timeSpent: 300,
  answers: { 'q1': 'A', 'q2': 'B' },
  completedAt: new Date()
});
```

#### General Firebase Operations:
```typescript
import { toeicService, vocabularyService } from '../services';

// Thêm document mới
const docId = await toeicService.add({
  name: 'New Document',
  description: 'Description here'
});

// Cập nhật document
await toeicService.update(docId, {
  description: 'Updated description'
});

// Query với điều kiện
const results = await toeicService.searchByField('status', 'active');

// Pagination
const { data, lastDoc } = await toeicService.getPaginated(10);
```

### 5. Migration Steps

#### Bước 1: Cập nhật imports
Thay thế:
```typescript
import { authService } from '../services/authService';
import { httpClient } from '../services/httpClient';
```

Bằng:
```typescript
import { firebaseAuthService } from '../services';
import { firebaseToeicService } from '../services';
```

#### Bước 2: Cập nhật authentication calls
Thay thế:
```typescript
await authService.login(loginData);
const user = authService.getCurrentUser();
```

Bằng:
```typescript
await firebaseAuthService.login(loginData);
const user = firebaseAuthService.getCurrentUser();
```

#### Bước 3: Cập nhật data fetching
Thay thế:
```typescript
const response = await httpClient.get('/toeic/parts');
const parts = response.data;
```

Bằng:
```typescript
const parts = await firebaseToeicService.getParts();
```

### 6. Lợi ích của Firebase

1. **Real-time updates**: Dữ liệu tự động cập nhật khi có thay đổi
2. **Offline support**: Ứng dụng hoạt động offline
3. **Scalability**: Tự động scale theo nhu cầu
4. **Security**: Rules-based security với Firestore
5. **Analytics**: Tích hợp Google Analytics
6. **Hosting**: Deploy dễ dàng với Firebase Hosting

### 7. Lưu ý quan trọng

1. **Firestore Rules**: Cần cấu hình security rules cho Firestore
2. **Indexes**: Một số query phức tạp có thể cần tạo composite indexes
3. **Cost**: Firestore tính phí theo số lần đọc/ghi
4. **Data Migration**: Cần migrate dữ liệu từ API cũ sang Firestore

### 8. Cấu hình Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for TOEIC data
    match /toeic_parts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Users can read questions and save test results
    match /toeic_questions/{document=**} {
      allow read: if true;
    }
    
    match /test_results/{resultId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.role == 'admin');
    }
  }
}
```

### 9. Troubleshooting

#### Lỗi thường gặp:
1. **Permission denied**: Kiểm tra Firestore rules
2. **Missing indexes**: Tạo composite indexes cho complex queries
3. **Network errors**: Kiểm tra cấu hình Firebase
4. **Auth errors**: Kiểm tra Firebase Auth configuration

#### Debug:
```typescript
// Enable debug logging
import { connectFirestoreEmulator } from 'firebase/firestore';
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## Kết luận
Việc migration sang Firebase sẽ mang lại nhiều lợi ích về performance, scalability và user experience. Hãy làm theo hướng dẫn này để chuyển đổi dần dần và đảm bảo ứng dụng hoạt động ổn định.
