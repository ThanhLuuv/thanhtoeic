import React from 'react';

const DMCA: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chính Sách DMCA</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">📋 Thông Tin DMCA</h2>
            <p className="text-blue-700 text-lg">
              AntToeic tôn trọng quyền sở hữu trí tuệ và cam kết tuân thủ 
              Đạo luật Bản quyền Kỹ thuật số Thiên niên kỷ (DMCA).
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Giới Thiệu</h2>
          <p className="text-gray-600 mb-6">
            Chính sách DMCA này giải thích cách AntToeic xử lý các khiếu nại về vi phạm bản quyền 
            theo Đạo luật Bản quyền Kỹ thuật số Thiên niên kỷ (DMCA) của Hoa Kỳ. 
            Chúng tôi cam kết bảo vệ quyền sở hữu trí tuệ và xử lý nghiêm túc mọi khiếu nại.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Thông Báo Vi Phạm Bản Quyền</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn tin rằng nội dung trên AntToeic vi phạm bản quyền của bạn, 
            vui lòng gửi thông báo vi phạm bản quyền theo DMCA với các thông tin sau:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Thông tin người khiếu nại:</strong> Họ tên, địa chỉ, số điện thoại, email</li>
            <li><strong>Mô tả tác phẩm:</strong> Mô tả chi tiết tác phẩm bị vi phạm bản quyền</li>
            <li><strong>Vị trí vi phạm:</strong> URL cụ thể của nội dung vi phạm trên AntToeic</li>
            <li><strong>Tuyên bố:</strong> Tuyên bố rằng bạn tin rằng việc sử dụng không được ủy quyền</li>
            <li><strong>Xác nhận:</strong> Xác nhận thông tin trong thông báo là chính xác</li>
            <li><strong>Chữ ký:</strong> Chữ ký điện tử hoặc vật lý của chủ sở hữu bản quyền</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Gửi Thông Báo DMCA</h2>
          <p className="text-gray-600 mb-6">
            Thông báo vi phạm bản quyền có thể được gửi qua:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 font-semibold">Email:</p>
            <p className="text-gray-600">lvthanh.work@gmail.com</p>
            <p className="text-gray-700 font-semibold mt-2">Tiêu đề email:</p>
            <p className="text-gray-600">"DMCA Takedown Request - [Tên tác phẩm]"</p>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Quy Trình Xử Lý</h2>
          <p className="text-gray-600 mb-6">
            Khi nhận được thông báo vi phạm bản quyền hợp lệ, AntToeic sẽ:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Xem xét thông báo:</strong> Kiểm tra tính hợp lệ của thông báo DMCA</li>
            <li><strong>Xác minh quyền sở hữu:</strong> Xác minh quyền sở hữu bản quyền</li>
            <li><strong>Gỡ bỏ nội dung:</strong> Gỡ bỏ hoặc vô hiệu hóa nội dung vi phạm</li>
            <li><strong>Thông báo cho người dùng:</strong> Thông báo cho người dùng đã đăng nội dung</li>
            <li><strong>Ghi nhận:</strong> Ghi nhận việc xử lý trong hệ thống</li>
          </ol>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Phản Đối (Counter-Notice)</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn tin rằng nội dung của bạn bị gỡ bỏ nhầm, bạn có thể gửi phản đối với:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ, số điện thoại, email</li>
            <li><strong>Xác định nội dung:</strong> Xác định nội dung đã bị gỡ bỏ</li>
            <li><strong>Tuyên bố:</strong> Tuyên bố rằng bạn tin rằng nội dung bị gỡ bỏ nhầm</li>
            <li><strong>Đồng ý:</strong> Đồng ý với thẩm quyền của tòa án địa phương</li>
            <li><strong>Chữ ký:</strong> Chữ ký điện tử hoặc vật lý</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Lặp Lại Vi Phạm</h2>
          <p className="text-gray-600 mb-6">
            AntToeic có chính sách nghiêm khắc đối với người dùng vi phạm bản quyền lặp lại:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Lần đầu:</strong> Cảnh báo và gỡ bỏ nội dung vi phạm</li>
            <li><strong>Lần thứ hai:</strong> Tạm thời đình chỉ tài khoản</li>
            <li><strong>Lần thứ ba:</strong> Đình chỉ vĩnh viễn tài khoản</li>
            <li><strong>Báo cáo:</strong> Báo cáo cho cơ quan có thẩm quyền nếu cần thiết</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Liên Hệ</h2>
          <p className="text-gray-600 mb-6">
            Nếu bạn có câu hỏi về chính sách DMCA hoặc cần hỗ trợ, 
            vui lòng liên hệ với tôi:<br /><br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Điện thoại:</strong> 0876 06 6907<br />
            <strong>Địa chỉ:</strong> P Thủ Đức, TP HCM<br />
            <strong>Trang web:</strong> <a href="/contact" className="text-blue-600 hover:underline">Liên hệ</a>
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Lưu Ý Quan Trọng</h3>
            <p className="text-yellow-700">
              Chỉ gửi thông báo DMCA nếu bạn thực sự sở hữu bản quyền của nội dung bị vi phạm. 
              Gửi thông báo sai có thể dẫn đến hậu quả pháp lý nghiêm trọng.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DMCA;
