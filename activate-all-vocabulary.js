// Script để active tất cả vocabulary trong Firebase
// Chạy trong browser console hoặc Node.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, doc, writeBatch } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase config - thay thế bằng config của bạn
const firebaseConfig = {
  // Copy config từ src/config/firebase.ts
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function activateAllVocabulary() {
  try {
    console.log('🔄 Bắt đầu active tất cả vocabulary...');
    
    // Lấy tất cả vocabulary
    const vocabularyRef = collection(db, 'vocabulary');
    const snapshot = await getDocs(vocabularyRef);
    
    console.log(`📊 Tìm thấy ${snapshot.size} vocabulary items`);
    
    // Tạo batch update
    const batch = writeBatch(db);
    let updateCount = 0;
    
    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      
      // Kiểm tra nếu vocabulary chưa có field isActive hoặc isActive = false
      if (!data.hasOwnProperty('isActive') || data.isActive === false) {
        batch.update(docSnapshot.ref, { isActive: true });
        updateCount++;
        console.log(`✅ Sẽ update: ${data.word || 'Unknown word'}`);
      } else {
        console.log(`⏭️ Đã active: ${data.word || 'Unknown word'}`);
      }
    });
    
    if (updateCount > 0) {
      // Thực hiện batch update
      await batch.commit();
      console.log(`🎉 Đã active thành công ${updateCount} vocabulary items!`);
    } else {
      console.log('ℹ️ Tất cả vocabulary đã được active rồi!');
    }
    
    // Hiển thị thống kê
    console.log('\n📈 THỐNG KÊ:');
    console.log(`- Tổng vocabulary: ${snapshot.size}`);
    console.log(`- Đã active: ${updateCount}`);
    console.log(`- Đã active trước đó: ${snapshot.size - updateCount}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi active vocabulary:', error);
  }
}

// Chạy function
activateAllVocabulary();

// Export function để có thể chạy lại
window.activateAllVocabulary = activateAllVocabulary;
