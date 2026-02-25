## Page 1 – Human Detection

### Chức năng

1. Upload ảnh từ máy tính.
2. Webcam realtime.
3. Hiển thị:
   - Bounding box quanh người.
   - Số lượng người trong ảnh hoặc khung hình.

---

### Luồng xử lý

#### Trường hợp upload ảnh

```
User upload image
    ↓
Next.js
    ↓ POST /api/human/detect
FastAPI
    ↓
Hugging Face model
    ↓
Kết quả (boxes + count)
    ↓
Next.js hiển thị
```

---

#### Trường hợp webcam

```
Webcam
    ↓
Next.js capture frame (300–500ms)
    ↓ POST /api/human/detect
FastAPI
    ↓
HF model
    ↓
JSON result
    ↓
Next.js vẽ bounding box
```

---

## Page 2 – Traffic Detection

### Chức năng

1. Webcam hoặc video stream.
2. Detect các đối tượng:
   - Car
   - Motorbike
   - Truck
   - Bus
   - Person

3. Tính toán:
   - Mật độ giao thông.
   - Lưu lượng theo thời gian.

---

### Logic tính mật độ (trong FastAPI)

Ví dụ:

```
total = car + motorbike + truck + bus

if total < 10:
    density = "low"
elif total < 30:
    density = "medium"
else:
    density = "high"
```

---

### Logic lưu lượng (flow)

Mỗi phút tính tổng số phương tiện:

```
car_per_minute
motorbike_per_minute
truck_per_minute
bus_per_minute
```

---

### Lưu trữ dữ liệu

- Redis: lưu thống kê realtime.
- PostgreSQL: lưu lịch sử dài hạn.

Luồng:

```
FastAPI detect
    ↓
Update counters
    ↓
Redis (realtime)
    ↓
Periodic job (mỗi phút)
    ↓
PostgreSQL (history)
```
