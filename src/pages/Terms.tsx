import React from 'react';

const Terms: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Điều Khoản Sử Dụng</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Ngày cập nhật:</strong> 15/01/2025<br />
            <strong>Phiên bản:</strong> 1.0
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Chấp Nhận Điều Khoản</h2>
          <p className="text-gray-600 mb-6">
            Bằng việc truy cập và sử dụng nền tảng T-TOEIC, bạn đồng ý tuân thủ và bị ràng buộc bởi 
            các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, 
            vui lòng không sử dụng dịch vụ của tôi.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Mô Tả Dịch Vụ</h2>
          <p className="text-gray-600 mb-6">
            T-TOEIC cung cấp nền tảng học tập trực tuyến miễn phí bao gồm:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Bài tập và thực hành TOEIC</li>
            <li>Tài liệu học tập</li>
            <li>Hệ thống đánh giá và theo dõi tiến độ</li>
            <li>Hỗ trợ học viên</li>
            <li>Nội dung giáo dục chất lượng cao</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Đăng Ký Tài Khoản</h2>
          <p className="text-gray-600 mb-6">
            Để sử dụng một số tính năng của nền tảng, bạn cần đăng ký tài khoản. Bạn cam kết:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Cung cấp thông tin chính xác và đầy đủ</li>
            <li>Bảo mật thông tin đăng nhập</li>
            <li>Không chia sẻ tài khoản với người khác</li>
            <li>Thông báo ngay khi phát hiện vi phạm bảo mật</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Sử Dụng Dịch Vụ</h2>
          <p className="text-gray-600 mb-6">
            Bạn cam kết sử dụng dịch vụ một cách hợp pháp và phù hợp với các mục đích giáo dục. 
            Bạn không được:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Vi phạm bản quyền hoặc quyền sở hữu trí tuệ</li>
            <li>Phân phối nội dung bất hợp pháp hoặc có hại</li>
            <li>Can thiệp vào hoạt động của hệ thống</li>
            <li>Sử dụng dịch vụ cho mục đích thương mại trái phép</li>
            <li>Thu thập thông tin cá nhân của người dùng khác</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Nội Dung và Bản Quyền</h2>
          <p className="text-gray-600 mb-6">
            Tất cả nội dung trên nền tảng T-TOEIC, bao gồm văn bản, hình ảnh, âm thanh, video, 
            và phần mềm, đều thuộc quyền sở hữu của tôi hoặc được cấp phép sử dụng. 
            Bạn không được sao chép, phân phối, hoặc sử dụng nội dung này mà không có sự cho phép.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Mục Đích Giáo Dục</h2>
          <p className="text-gray-600 mb-6">
            <strong>Miễn phí:</strong> Tất cả nội dung và dịch vụ trên nền tảng đều hoàn toàn miễn phí. 
            Tôi không thu phí hay yêu cầu thanh toán từ người dùng.<br /><br />
            <strong>Mục đích:</strong> Nền tảng được phát triển với mục đích giáo dục và chia sẻ kiến thức, 
            không có mục đích thương mại hay lợi nhuận.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Bảo Mật Thông Tin</h2>
          <p className="text-gray-600 mb-6">
            Tôi cam kết bảo vệ thông tin cá nhân của bạn theo <a href="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</a>. 
            Thông tin của bạn sẽ được xử lý an toàn và chỉ sử dụng cho mục đích cung cấp dịch vụ giáo dục.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Giới Hạn Trách Nhiệm</h2>
          <p className="text-gray-600 mb-6">
            T-TOEIC cung cấp dịch vụ "nguyên trạng" và không đảm bảo rằng dịch vụ sẽ không bị gián đoạn 
            hoặc không có lỗi. Tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng dịch vụ.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Thay Đổi Điều Khoản</h2>
          <p className="text-gray-600 mb-6">
            Tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. 
            Những thay đổi sẽ có hiệu lực ngay khi được đăng tải. 
            Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là chấp nhận điều khoản mới.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Liên Hệ</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ với tôi:<br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Địa chỉ:</strong> P Thủ Đức, TP HCM<br />
            <strong>Điện thoại:</strong> 0876 06 6907
          </p>
        </div>
      </div>
    </main>
  );
};

export default Terms;
