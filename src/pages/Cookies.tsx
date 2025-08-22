import React from 'react';

const Cookies: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chính Sách Cookie</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Ngày cập nhật:</strong> 15/01/2025<br />
            <strong>Phiên bản:</strong> 1.0
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Cookie Là Gì?</h2>
          <p className="text-gray-600 mb-6">
            Cookie là những file văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website. 
            Chúng giúp website ghi nhớ thông tin về chuyến thăm của bạn, giúp cải thiện trải nghiệm người dùng 
            và cung cấp thông tin hữu ích cho chủ sở hữu website.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Cookie Tôi Sử Dụng</h2>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Cookie Cần Thiết</h3>
          <p className="text-gray-600 mb-4">
            Những cookie này cần thiết để website hoạt động bình thường:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Cookie phiên đăng nhập</li>
            <li>Cookie bảo mật</li>
            <li>Cookie cài đặt ngôn ngữ</li>
            <li>Cookie ghi nhớ tùy chọn</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 Cookie Phân Tích</h3>
          <p className="text-gray-600 mb-4">
            Tôi sử dụng cookie phân tích để hiểu cách người dùng tương tác với website:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Google Analytics</li>
            <li>Thống kê truy cập</li>
            <li>Phân tích hành vi người dùng</li>
            <li>Cải thiện hiệu suất website</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.3 Cookie Quảng Cáo</h3>
          <p className="text-gray-600 mb-6">
            Nếu bạn chấp nhận, tôi có thể sử dụng cookie quảng cáo để hiển thị quảng cáo phù hợp 
            với sở thích của bạn. Các cookie này có thể được đặt bởi các đối tác quảng cáo của tôi.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cookie Của Bên Thứ Ba</h2>
          <p className="text-gray-600 mb-6">
            Tôi có thể sử dụng các dịch vụ của bên thứ ba như Google Analytics, Facebook Pixel, 
            hoặc các nền tảng quảng cáo khác. Những dịch vụ này có thể đặt cookie riêng của họ trên thiết bị của bạn.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Quản Lý Cookie</h2>
          <p className="text-gray-600 mb-4">
            Bạn có thể kiểm soát và quản lý cookie thông qua:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Cài đặt trình duyệt:</strong> Hầu hết trình duyệt cho phép bạn chặn hoặc xóa cookie</li>
            <li><strong>Bảng điều khiển cookie:</strong> Sử dụng bảng điều khiển trên website của tôi</li>
            <li><strong>Thiết lập quảng cáo:</strong> Tùy chỉnh cài đặt quảng cáo của Google</li>
            <li><strong>Opt-out tools:</strong> Sử dụng các công cụ từ chối quảng cáo</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Hướng Dẫn Theo Trình Duyệt</h2>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 Google Chrome</h3>
          <p className="text-gray-600 mb-4">
            Vào Cài đặt → Bảo mật và quyền riêng tư → Cookie và dữ liệu trang web
          </p>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">5.2 Mozilla Firefox</h3>
          <p className="text-gray-600 mb-4">
            Vào Cài đặt → Quyền riêng tư & Bảo mật → Cookie và dữ liệu trang web
          </p>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">5.3 Safari</h3>
          <p className="text-gray-600 mb-4">
            Vào Tùy chọn → Quyền riêng tư → Cookie và dữ liệu trang web
          </p>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">5.4 Microsoft Edge</h3>
          <p className="text-gray-600 mb-6">
            Vào Cài đặt → Cookie và quyền trang web
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Tác Động Của Việc Vô Hiệu Hóa Cookie</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn vô hiệu hóa cookie, một số tính năng của website có thể không hoạt động bình thường:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Không thể đăng nhập hoặc ghi nhớ tài khoản</li>
            <li>Không thể lưu cài đặt và tùy chọn</li>
            <li>Một số tính năng tương tác có thể bị gián đoạn</li>
            <li>Trải nghiệm người dùng có thể bị ảnh hưởng</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cập Nhật Chính Sách Cookie</h2>
          <p className="text-gray-600 mb-6">
            Tôi có thể cập nhật chính sách cookie này theo thời gian để phản ánh những thay đổi 
            trong cách tôi sử dụng cookie hoặc vì lý do pháp lý. Những thay đổi quan trọng sẽ được 
            thông báo qua email hoặc thông báo trên website.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Liên Hệ</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn có câu hỏi về chính sách cookie này hoặc cách tôi sử dụng cookie, 
            vui lòng liên hệ với tôi:<br /><br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Địa chỉ:</strong> P Thủ Đức, TP HCM<br />
            <strong>Điện thoại:</strong> 0876 06 6907<br />
            <strong>Trang web:</strong> <a href="/contact" className="text-blue-600 hover:underline">Liên hệ</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Cookies;
