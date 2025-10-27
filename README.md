## 🌐 Live Demo

[![Deploy](https://img.shields.io/badge/Site-Live-blue)](https://site.spotixe.io.vn/)
[![Deploy](https://img.shields.io/badge/Admin-Live-blue)](https://dashboard.spotixe.io.vn/)

🎵 Spotixe
🧩 Giới thiệu

Spotixe là một ứng dụng nghe nhạc hiện đại được phát triển bằng Kotlin trên nền tảng Android.
Ứng dụng cho phép người dùng nghe nhạc, quản lý playlist và trải nghiệm giao diện thân thiện, mượt mà.
Dự án còn bao gồm web admin được viết bằng C# (ASP.NET) dùng để quản lý bài hát, nghệ sĩ và người dùng kết nối với ứng dụng di động.

⚙️ Cài đặt
🖥 Ứng dụng Android

Sao chép dự án từ kho lưu trữ:

git clone https://github.com/hientran-dotnet/SpotiXe

Mở dự án bằng Android Studio.

Chờ hệ thống đồng bộ Gradle.

Cài đặt các thư viện phụ thuộc (dependencies):

./gradlew build

🌐 Web Admin (C# ASP.NET)

Di chuyển đến thư mục web admin:

cd Spotixe-Web-Admin

Mở bằng Visual Studio.

Khôi phục các gói NuGet (tự động hoặc thủ công).

Chạy dự án để khởi động trang quản trị.

▶️ Sử dụng
Ứng dụng Android

Chạy dự án ở chế độ phát triển:

npm run dev

(dành cho phần web nếu cần test local)

Tạo file APK:

./gradlew assembleDebug

Chạy ứng dụng trên máy ảo hoặc thiết bị thật từ Android Studio.

Web Admin

Chạy trực tiếp bằng Visual Studio (IIS Express).

🌿 Quy tắc làm việc với Git
Đặt tên nhánh (Branch)

Nhánh tính năng: feature/[mieu-ta-ngan]
→ Ví dụ: feature/them-man-hinh-dang-nhap

Nhánh sửa lỗi: fix/[mieu-ta-ngan]
→ Ví dụ: fix/loi-phat-nhac

Tạo Pull Request (PR)

Tạo PR vào nhánh dev → Khi hoàn thành tính năng và sẵn sàng kiểm thử.

Tạo PR vào nhánh master → Khi phiên bản đã ổn định và sẵn sàng phát hành.

Đặt tên PR

Ví dụ:

[Feature] Thêm màn hình đăng nhập
[Fix] Sửa lỗi load bài hát

🧠 Công nghệ sử dụng
Ứng dụng Android

Ngôn ngữ: Kotlin

IDE: Android Studio

Kiến trúc: MVVM (Model–View–ViewModel)

Firebase: Xác thực và lưu trữ dữ liệu

Retrofit: Giao tiếp API

Coroutines & LiveData: Xử lý bất đồng bộ

Web Admin

Ngôn ngữ: C#

Framework: ASP.NET MVC / ASP.NET Core

CSDL: SQL Server

Giao diện: HTML, CSS, JavaScript, Bootstrap

📁 Cấu trúc thư mục
.....
💬 Lời cảm ơn

Xin gửi lời cảm ơn đến tất cả những người đã đóng góp vào dự án Spotixe.
Dự án được lấy cảm hứng từ các ứng dụng nghe nhạc phổ biến, với mục tiêu mang đến một ví dụ thực tế trong việc kết nối ứng dụng Android (Kotlin) với web backend viết bằng C#.
Cảm ơn cộng đồng mã nguồn mở vì những công cụ và thư viện tuyệt vời đã giúp hoàn thiện dự án này.
