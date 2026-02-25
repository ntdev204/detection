# Công nghệ sử dụng

## 1. Frontend

- **Next.js**
  Framework React cho giao diện web, hỗ trợ SSR/CSR, routing và tối ưu hiệu năng.
- **TypeScript**
  Tăng độ an toàn kiểu dữ liệu, dễ maintain khi hệ thống lớn.
- **Tailwind CSS**
  Framework CSS utility-first để xây dựng UI nhanh, gọn và đồng nhất.
- **WebRTC / getUserMedia**
  Dùng để truy cập webcam từ trình duyệt cho chức năng detect realtime.

---

## 2. Backend

- **FastAPI**
  Framework Python hiệu năng cao cho API:
  - Hỗ trợ async
  - Tự sinh Swagger docs
  - Phù hợp cho hệ thống AI inference

- **Uvicorn**
  ASGI server chạy FastAPI trong môi trường production.

- **Redis** (tuỳ chọn nhưng khuyến nghị)
  - Lưu thống kê realtime
  - Cache kết quả detect
  - Giảm tải cho database

- **PostgreSQL**
  - Lưu dữ liệu lịch sử giao thông
  - Phục vụ dashboard và phân tích

---

## 3. AI / Machine Learning

- **YOLOv8**
  - Model object detection nhẹ, nhanh.
  - Phù hợp realtime và web application.
  - Hỗ trợ training và inference dễ dàng.

- **PyTorch**
  - Framework deep learning cho YOLOv8.

- **Hugging Face**
  - Lưu trữ model.
  - Deploy model thành inference API.
  - Dễ tích hợp với FastAPI.

---

## 4. Training Environment

- **Google Colab**
  - GPU miễn phí.
  - Dùng để train model YOLOv8.
  - Xuất file `best.pt` sau khi huấn luyện.

---

## 5. DevOps & Deployment (khuyến nghị)

- **Docker**
  - Đóng gói FastAPI server.
  - Dễ triển khai trên VPS hoặc cloud.

- **Vercel**
  - Deploy frontend Next.js nhanh và miễn phí.

- **VPS hoặc GPU Server**
  - Chạy FastAPI backend.
  - Hoặc thay bằng Hugging Face Inference Endpoint.
