from datetime import datetime
from pydantic import BaseModel


class DetectionBox(BaseModel):
    label: str
    confidence: float
    bbox: list[float]  # [x1, y1, x2, y2] normalized 0-1


class HumanDetectionResult(BaseModel):
    success: bool = True
    timestamp: str
    count: int
    max_confidence: float
    avg_confidence: float
    detections: list[DetectionBox]
    summary: str

    @classmethod
    def from_result(cls, result) -> "HumanDetectionResult":
        count = result.count
        max_conf = result.max_confidence
        avg_conf = result.avg_confidence

        summary = (
            f"Đã xác định {count} người trong khung hình. "
            f"Mô hình YOLOv8 với độ chính xác {avg_conf * 100:.1f}%"
        )
        if count == 0:
            summary = "Không phát hiện người trong ảnh."

        return cls(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            count=count,
            max_confidence=round(max_conf * 100, 1),
            avg_confidence=round(avg_conf * 100, 1),
            detections=[
                DetectionBox(
                    label=d.label,
                    confidence=round(d.confidence * 100, 1),
                    bbox=d.bbox,
                )
                for d in result.detections
            ],
            summary=summary,
        )
