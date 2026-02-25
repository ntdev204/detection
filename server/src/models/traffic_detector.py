import logging
from ultralytics import YOLO
from .detector import BaseDetector, Detection, DetectionResult
from ..config.settings import settings

logger = logging.getLogger(__name__)

TRAFFIC_CLASSES = {"car", "motorbike", "motorcycle", "truck", "bus", "person",
                   "bicycle", "van"}

# Inference image size — smaller = faster, 640 is YOLO default
_INFER_SIZE = 640


class TrafficDetector(BaseDetector):
    """Detects traffic objects (vehicles + pedestrians) using traffic.pt."""

    def __init__(self, model_path: str = settings.traffic_model_path) -> None:
        self._model_path = model_path
        self._model: YOLO | None = None

    def load(self) -> None:
        logger.info("Loading TrafficDetector from %s", self._model_path)
        self._model = YOLO(self._model_path)
        # Warm-up: run a dummy inference to initialize CUDA/CPU kernels
        import numpy as np
        dummy = np.zeros((480, 640, 3), dtype=np.uint8)
        self._model.predict(source=dummy, imgsz=_INFER_SIZE, verbose=False)
        logger.info("TrafficDetector loaded and warmed up")

    def detect(self, image_bytes: bytes) -> DetectionResult:
        if self._model is None:
            raise RuntimeError("TrafficDetector not loaded. Call load() first.")

        image = self._decode_image(image_bytes)
        results = self._model.predict(
            source=image,
            imgsz=_INFER_SIZE,
            conf=settings.confidence_threshold,
            iou=settings.iou_threshold,
            verbose=False,
        )

        detections: list[Detection] = []
        class_counts: dict[str, int] = {}
        h, w = image.shape[:2]

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                class_name = result.names[int(box.cls.item())]
                confidence = float(box.conf.item())
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append(Detection(
                    label=class_name,
                    confidence=round(confidence, 4),
                    bbox=[
                        round(x1 / w, 4),
                        round(y1 / h, 4),
                        round(x2 / w, 4),
                        round(y2 / h, 4),
                    ],
                ))
                class_counts[class_name] = class_counts.get(class_name, 0) + 1

        total = sum(class_counts.values())
        density = self._compute_density(total)

        return DetectionResult(
            detections=detections,
            metadata={
                "model": "traffic.pt",
                "image_size": [w, h],
                "class_counts": class_counts,
                "total_vehicles": total,
                "density": density,
                "supported_classes": sorted(TRAFFIC_CLASSES),
            },
        )

    def _compute_density(self, total: int) -> str:
        if total < settings.traffic_low_threshold:
            return "low"
        elif total < settings.traffic_high_threshold:
            return "medium"
        return "high"
