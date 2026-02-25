from datetime import datetime
from pydantic import BaseModel


class DetectionBox(BaseModel):
    label: str
    confidence: float
    bbox: list[float]  # [x1, y1, x2, y2] normalized 0-1


class TrafficDetectionResult(BaseModel):
    success: bool = True
    timestamp: str
    total_vehicles: int
    density: str  # "low" | "medium" | "high"
    class_counts: dict[str, int]
    max_confidence: float
    avg_confidence: float
    detections: list[DetectionBox]
    summary: str
    supported_classes: list[str]  # Classes the model can detect

    @classmethod
    def from_result(cls, result) -> "TrafficDetectionResult":
        meta = result.metadata
        class_counts: dict[str, int] = meta.get("class_counts", {})
        total: int = meta.get("total_vehicles", result.count)
        density: str = meta.get("density", "low")
        max_conf = result.max_confidence
        avg_conf = result.avg_confidence

        density_vi = {"low": "Thấp", "medium": "Trung bình", "high": "Cao"}.get(density, density)
        summary = (
            f"Phát hiện {total} phương tiện. Mật độ giao thông: {density_vi}. "
            f"Độ chính xác TB {avg_conf * 100:.1f}%"
        )
        if total == 0:
            summary = "Không phát hiện phương tiện trong khung hình."

        return cls(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            total_vehicles=total,
            density=density,
            class_counts=class_counts,
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
            supported_classes=sorted(meta.get("supported_classes", [])),
        )
