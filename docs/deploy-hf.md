# Deploy to Hugging Face Spaces

Hướng dẫn deploy FastAPI Human Detection lên Hugging Face Spaces.

---

## Prerequisites

1. Tài khoản Hugging Face: https://huggingface.co/join
2. Git installed
3. Model `best.pt` (optional - sẽ dùng pretrained nếu không có)

---

## Step 1: Create New Space

1. Go to: https://huggingface.co/new-space
2. SDK: Select **Docker**
3. Template: Select **Blank** (Quan trọng! Để dùng Dockerfile của mình)
4. Space hardware: **CPU basic** (Free)
5. Create Space

---

## Step 2: Copy Server Files

Copy các file từ `server/` vào root của Space:

```
deep-detection/
├── Dockerfile
├── README.md
├── requirements.txt
├── main.py
├── detection.py
├── schemas.py
└── models/
    └── best.pt (optional)
```

---

## Step 3: Add Model (Optional)

Nếu có custom model `best.pt`:

```bash
mkdir models
cp /path/to/best.pt models/
```

> **Note**: Nếu không có model, server sẽ tự động dùng pretrained YOLOv8n.

---

## Step 4: Push to Hugging Face

```bash
git add .
git commit -m "Deploy FastAPI human detection"
git push
```

---

## Step 5: Wait for Build

1. Truy cập: https://huggingface.co/spaces/ntdev204/deep-detection
2. Đợi Docker build (~5-10 phút lần đầu)
3. Khi thấy status "Running" → API ready!

---

## Test API

### Health Check

```bash
curl https://ntdev204-deep-detection.hf.space/health
```

### Detect Image (Base64)

```bash
curl -X POST https://ntdev204-deep-detection.hf.space/detect/image \
  -H "Content-Type: application/json" \
  -d '{"image": "YOUR_BASE64_IMAGE"}'
```

### Upload File

```bash
curl -X POST https://ntdev204-deep-detection.hf.space/detect/upload \
  -F "file=@test.jpg"
```

---

## Troubleshooting

| Issue           | Solution                                  |
| --------------- | ----------------------------------------- |
| Build failed    | Check Dockerfile syntax, requirements.txt |
| Model not found | Uses pretrained YOLOv8n automatically     |
| CORS errors     | Already configured in main.py             |
| Timeout         | CPU free tier có thể slow, đợi 30s        |

---

## API Response

```json
{
  "is_human": true,
  "confidence": 95.5,
  "human_count": 1,
  "boxes": [...],
  "message": "Đây là người (95.5% chính xác)"
}
```
