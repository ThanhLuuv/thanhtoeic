import React from 'react';

const Privacy: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chính Sách Bảo Mật</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Ngày cập nhật:</strong> 15/01/2025<br />
            <strong>Phiên bản:</strong> 1.0
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Giới Thiệu</h2>
          <p className="text-gray-600 mb-6">
            T-TOEIC ("tôi", "của tôi", hoặc "nền tảng") cam kết bảo vệ quyền riêng tư 
            và thông tin cá nhân của bạn. Chính sách bảo mật này giải thích cách tôi thu thập, 
            sử dụng, bảo vệ và chia sẻ thông tin của bạn khi bạn sử dụng nền tảng học tập TOEIC của tôi.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Thông Tin Tôi Thu Thập</h2>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Thông Tin Cá Nhân</h3>
          <p className="text-gray-600 mb-4">
            Khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ, tôi có thể thu thập:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Họ và tên</li>
            <li>Địa chỉ email</li>
            <li>Số điện thoại (nếu cung cấp)</li>
            <li>Thông tin tài khoản học tập</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 Thông Tin Sử Dụng</h3>
          <p className="text-gray-600 mb-4">
            Tôi tự động thu thập thông tin về cách bạn sử dụng nền tảng:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Thời gian truy cập và sử dụng</li>
            <li>Trang web bạn truy cập</li>
            <li>Thiết bị và trình duyệt bạn sử dụng</li>
            <li>Địa chỉ IP</li>
            <li>Tiến độ học tập và kết quả</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cách Tôi Sử Dụng Thông Tin</h2>
          <p className="text-gray-600 mb-4">
            Tôi sử dụng thông tin thu thập được để:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Cung cấp và cải thiện dịch vụ học tập</li>
            <li>Gửi thông báo và cập nhật về dịch vụ</li>
            <li>Hỗ trợ học viên và giải quyết vấn đề</li>
            <li>Phân tích và tối ưu hóa trải nghiệm người dùng</li>
            <li>Tuân thủ các nghĩa vụ pháp lý</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Chia Sẻ Thông Tin</h2>
          <p className="text-gray-600 mb-6">
            Tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba 
            mà không có sự đồng ý của bạn, ngoại trừ các trường hợp sau:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Khi được yêu cầu bởi luật pháp hoặc cơ quan chính phủ</li>
            <li>Để bảo vệ quyền và tài sản của tôi</li>
            <li>Trong trường hợp khẩn cấp để bảo vệ sự an toàn của người dùng</li>
            <li>Với các nhà cung cấp dịch vụ cần thiết để vận hành nền tảng</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Bảo Mật Thông Tin</h2>
          <p className="text-gray-600 mb-6">
            Tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Mã hóa dữ liệu trong quá trình truyền tải</li>
            <li>Bảo mật cơ sở dữ liệu với tường lửa</li>
            <li>Kiểm soát truy cập nghiêm ngặt</li>
            <li>Giám sát bảo mật liên tục</li>
            <li>Tuân thủ các tiêu chuẩn bảo mật thông tin</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookie và Công Nghệ Theo Dõi</h2>
          <p className="text-gray-600 mb-6">
            Tôi sử dụng cookie và các công nghệ tương tự để:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Ghi nhớ tùy chọn và cài đặt của bạn</li>
            <li>Phân tích lưu lượng truy cập và sử dụng</li>
            <li>Cải thiện hiệu suất và trải nghiệm người dùng</li>
            <li>Cung cấp nội dung được cá nhân hóa</li>
          </ul>
          <p className="text-gray-600 mb-6">
            Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt. 
            Xem chi tiết tại trang <a href="/cookies" className="text-blue-600 hover:underline">Chính sách Cookie</a>.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Quyền Của Bạn</h2>
          <p className="text-gray-600 mb-4">
            Bạn có các quyền sau đối với thông tin cá nhân của mình:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Quyền truy cập và xem thông tin</li>
            <li>Quyền chỉnh sửa và cập nhật thông tin</li>
            <li>Quyền xóa tài khoản và dữ liệu</li>
            <li>Quyền rút lại sự đồng ý</li>
            <li>Quyền khiếu nại với cơ quan bảo vệ dữ liệu</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Bảo Lưu Dữ Liệu</h2>
          <p className="text-gray-600 mb-6">
            Tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để cung cấp dịch vụ 
            hoặc tuân thủ các nghĩa vụ pháp lý. Khi không còn cần thiết, tôi sẽ xóa hoặc ẩn danh hóa dữ liệu.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Thay Đổi Chính Sách</h2>
          <p className="text-gray-600 mb-6">
            Tôi có thể cập nhật chính sách bảo mật này theo thời gian. 
            Những thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên nền tảng. 
            Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là chấp nhận chính sách mới.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Liên Hệ</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn có câu hỏi về chính sách bảo mật này hoặc cách tôi xử lý thông tin cá nhân, 
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

export default Privacy;
