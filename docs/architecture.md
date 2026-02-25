                    ┌────────────────────┐
                    │      Client        │
                    │      Next.js       │
                    │                    │
                    │ - Human detect     │
                    │   • Upload image   │
                    │   • Webcam         │
                    │ - Traffic detect   │
                    │   • Realtime       │
                    │   • Dashboard      │
                    └─────────┬──────────┘
                              │
                        HTTP / WebSocket
                              │
                    ┌─────────▼──────────┐
                    │      FastAPI        │
                    │     API Server      │
                    │                     │
                    │ - Human detect API  │
                    │ - Traffic detect    │
                    │ - Counting logic    │
                    │ - Stats API         │
                    └───────┬───────┬────┘
                            │       │
                            │       │
                     Redis (realtime stats)
                            │
                            ▼
                     PostgreSQL (history)

                            │
                            ▼
                ┌─────────────────────────┐
                │ Hugging Face Model      │
                │ (YOLOv8 Inference)      │
                │                         │
                │ - Human model           │
                │ - Traffic model         │
                └─────────────────────────┘
