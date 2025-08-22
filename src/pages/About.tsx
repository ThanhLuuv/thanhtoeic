import React from 'react';

const About: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Về Tôi</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            T-TOEIC là nền tảng học tập TOEIC cá nhân, được phát triển bởi tôi - một người có đam mê 
            với giáo dục và công nghệ, mong muốn chia sẻ kiến thức và giúp đỡ các bạn học viên đạt được 
            mục tiêu TOEIC của mình.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thông Tin Cá Nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-700">Họ và Tên:</h3>
              <p className="text-gray-600">Lưu Văn Thành</p>
            </div>
           
            <div>
              <h3 className="font-semibold text-gray-700">Địa Chỉ:</h3>
              <p className="text-gray-600">P Thủ Đức, TP HCM</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Email:</h3>
              <p className="text-gray-600">lvthanh.work@gmail.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Điện Thoại:</h3>
              <p className="text-gray-600">0876 06 6907</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Website:</h3>
              <p className="text-gray-600">thanhtoeic.online</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sứ Mệnh</h2>
          <p className="text-gray-600 mb-6">
            Tôi cam kết cung cấp giải pháp học tập TOEIC hiệu quả, chất lượng cao với công nghệ tiên tiến, 
            giúp học viên đạt được mục tiêu điểm số mong muốn một cách nhanh chóng và bền vững.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Giá Trị Cốt Lõi</h2>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Chất lượng giáo dục hàng đầu</li>
            <li>Đổi mới công nghệ liên tục</li>
            <li>Trải nghiệm người dùng tối ưu</li>
            <li>Hỗ trợ học viên 24/7</li>
            <li>Cam kết kết quả học tập</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Về Dự Án</h2>
          <p className="text-gray-600 mb-6">
            Đây là dự án cá nhân được phát triển với mục đích giáo dục và chia sẻ kiến thức. 
            Tôi không có mục đích thương mại hay bán khóa học. Tất cả nội dung đều miễn phí 
            và được tạo ra từ kinh nghiệm và kiến thức cá nhân.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cam Kết</h2>
          <p className="text-gray-600 mb-6">
            Tôi cam kết duy trì chất lượng nội dung, cập nhật thường xuyên và luôn sẵn sàng 
            hỗ trợ các bạn học viên trong quá trình học tập TOEIC.
          </p>
        </div>
      </div>
      
      {/* Schema.org Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Lưu Văn Thành",
            "url": "https://thanhtoeic.online",
            "image": "https://thanhtoeic.online/logo.png",
            "description": "Người phát triển nền tảng học tập TOEIC T-TOEIC",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "P Thủ Đức",
              "addressLocality": "TP HCM",
              "addressRegion": "TP HCM",
              "addressCountry": "VN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "0876 06 6907",
              "contactType": "personal",
              "email": "lvthanh.work@gmail.com"
            },
            "sameAs": [
              "https://thanhtoeic.online"
            ]
          })
        }}
      />
    </main>
  );
};

export default About;
