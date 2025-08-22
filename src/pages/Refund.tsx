import React from 'react';

const Refund: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Thông Báo Quan Trọng</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Ngày cập nhật:</strong> 15/01/2025<br />
            <strong>Phiên bản:</strong> 1.0
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">🎯 Dự Án Hoàn Toàn Miễn Phí</h2>
            <p className="text-blue-700 text-lg">
              AntToeic là một dự án giáo dục cá nhân, được phát triển với mục đích chia sẻ kiến thức 
              và hỗ trợ cộng đồng học tập TOEIC. <strong>Tất cả nội dung và dịch vụ đều hoàn toàn miễn phí.</strong>
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Không Có Mua Bán</h2>
          <p className="text-gray-600 mb-6">
            Trang web này không cung cấp bất kỳ khóa học trả phí nào, không có hệ thống thanh toán, 
            và không thu phí từ người dùng. Tất cả nội dung đều được chia sẻ miễn phí.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Mục Đích Giáo Dục</h2>
          <p className="text-gray-600 mb-6">
            Dự án được phát triển với mục đích:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Chia sẻ kiến thức TOEIC miễn phí</li>
            <li>Hỗ trợ cộng đồng học tập</li>
            <li>Phát triển kỹ năng công nghệ</li>
            <li>Đóng góp cho giáo dục Việt Nam</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Nguồn Thu Nhập</h2>
          <p className="text-gray-600 mb-6">
            Để duy trì và phát triển dự án, tôi có thể sử dụng:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Quảng cáo Google AdSense (nếu được chấp thuận)</li>
            <li>Hỗ trợ từ cộng đồng (nếu có)</li>
            <li>Đầu tư cá nhân</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cam Kết</h2>
          <p className="text-gray-600 mb-6">
            Tôi cam kết:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Luôn giữ nội dung học tập miễn phí</li>
            <li>Không yêu cầu thanh toán từ người dùng</li>
            <li>Duy trì chất lượng nội dung cao</li>
            <li>Hỗ trợ học viên 24/7</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Hỗ Trợ Dự Án</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn muốn hỗ trợ dự án, bạn có thể:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Chia sẻ trang web với bạn bè</li>
            <li>Để lại đánh giá tích cực</li>
            <li>Góp ý để cải thiện nội dung</li>
            <li>Báo cáo lỗi nếu gặp phải</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Liên Hệ</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn có câu hỏi về dự án hoặc cần hỗ trợ, vui lòng liên hệ với tôi:<br /><br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Điện thoại:</strong> 0876 06 6907<br />
            <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6: 8:00 - 18:00<br />
            <strong>Trang web:</strong> <a href="/contact" className="text-blue-600 hover:underline">Liên hệ</a>
          </p>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mt-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">💡 Lưu Ý</h3>
            <p className="text-green-700">
              Vì đây là dự án miễn phí, không có chính sách hoàn tiền. Tuy nhiên, tôi luôn sẵn sàng 
              hỗ trợ bạn trong quá trình sử dụng nền tảng và giải đáp mọi thắc mắc.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Refund;
