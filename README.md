# Deep Detection 🚀

Hệ thống nhận diện thông minh sử dụng trí tuệ nhân tạo (AI) để phát hiện người và phân tích lưu lượng giao thông trong thời gian thực, được xây dựng với Next.js và FastAPI.

![Trạng thái](https://img.shields.io/badge/Status-Active-success) ![Giấy phép](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Tổng quan

Deep Detection tận dụng các mô hình thị giác máy tính hiện đại (YOLOv8) để cung cấp khả năng nhận diện chính xác theo thời gian thực. Hệ thống được thiết kế với giao diện web hiện đại, phản hồi nhanh và API backend mạnh mẽ.

## ✨ Tính năng

### 👤 Nhận diện người (Human Detection)

- **Tải lên ảnh 📸**: Tải ảnh lên để phát hiện và đếm số người ngay lập tức.
- **Webcam thời gian thực 🎥**: Phân tích luồng video trực tiếp từ trình duyệt của bạn.
- **Phản hồi trực quan**: Khung bao quanh (bounding box) và độ tin cậy được vẽ trên các đối tượng được phát hiện.
- **Quyền riêng tư**: Xử lý có thể khác nhau tùy thuộc vào việc triển khai (cục bộ vs đám mây).

### 🚦 Phát hiện giao thông (Đang phát triển)

- **Phân loại phương tiện 🚗**: Phát hiện ô tô, xe máy, xe tải và xe buýt.
- **Phân tích lưu lượng 📊**: Tính toán mật độ giao thông theo thời gian thực.
- **Bảng điều khiển**: Tổng quan thống kê về các mẫu giao thông.

## 🛠️ Công nghệ sử dụng

### Frontend (Client)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Ngôn ngữ**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Thư viện UI**: [shadcn/ui](https://ui.shadcn.com/)
- **Quản lý trạng thái**: React Hooks (Custom)

### Backend (Server)

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Ngôn ngữ**: Python 3.10+
- **Mô hình AI**: [YOLOv8](https://docs.ultralytics.com/) (Ultralytics)
- **Thị giác máy tính**: OpenCV
- **Triển khai**: Hugging Face Spaces / Docker

## 📂 Cấu trúc dự án

```bash
deep-detection/
├── client/           # Ứng dụng Frontend Next.js
│   ├── src/
│   │   ├── app/      # Các trang và layout của App Router
│   │   ├── components/ # Các thành phần UI tái sử dụng
│   │   ├── hooks/    # Các custom React hooks
│   │   └── lib/      # Các tiện ích và hằng số
├── server/           # Ứng dụng Backend FastAPI
│   ├── src/          # Mã nguồn
│   └── main.py       # Điểm vào ứng dụng
├── docs/             # Tài liệu dự án
└── training/         # Notebooks và dữ liệu huấn luyện mô hình
```

## 🚀 Bắt đầu

### Yêu cầu tiên quyết

- **Node.js**: v18 trở lên
- **Python**: v3.10 trở lên

### 1. Cài đặt Backend (Server)

Di chuyển đến thư mục server và thiết lập môi trường Python:

```bash
cd server

# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# Chạy server
uvicorn src.main:app --reload

```

Server sẽ khởi chạy tại `http://localhost:8000` (hoặc `http://localhost:7860` nếu được cấu hình cho HF Spaces).

### 2. Cài đặt Frontend (Client)

Di chuyển đến thư mục client và cài đặt các thư viện phụ thuộc:

```bash
cd client

# Cài đặt dependencies
npm install

# Tạo file môi trường
# Tạo file .env.local và thêm dòng sau (cập nhật URL nếu cần):
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Chạy server phát triển
npm run dev
```

Client sẽ khởi chạy tại `http://localhost:3000`.

## 🔧 Biến môi trường

### Client (`client/.env.local`)

```properties
NEXT_PUBLIC_API_URL=http://localhost:8000  # URL của FastAPI backend của bạn
```

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng gửi Pull Request hoặc tạo Issue để thảo luận.

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.
