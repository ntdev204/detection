import logging
from ultralytics import YOLO
from .detector import BaseDetector, Detection, DetectionResult
from ..config.settings import settings

logger = logging.getLogger(__name__)

PERSON_CLASS_ID = 0  # COCO class ID for 'person'
PERSON_CLASS_NAMES = {"person"}

_INFER_SIZE = 640


class HumanDetector(BaseDetector):
    """Detects humans using a trained YOLOv8 model (human.pt)."""

    def __init__(self, model_path: str = settings.human_model_path) -> None:
        self._model_path = model_path
        self._model: YOLO | None = None

    def load(self) -> None:
        logger.info("Loading HumanDetector from %s", self._model_path)
        self._model = YOLO(self._model_path)
        # Warm-up: run a dummy inference to initialize CUDA/CPU kernels
        import numpy as np
        dummy = np.zeros((480, 640, 3), dtype=np.uint8)
        self._model.predict(source=dummy, imgsz=_INFER_SIZE, verbose=False)
        logger.info("HumanDetector loaded and warmed up")

    def detect(self, image_bytes: bytes) -> DetectionResult:
        if self._model is None:
            raise RuntimeError("HumanDetector not loaded. Call load() first.")

        image = self._decode_image(image_bytes)
        results = self._model.predict(
            source=image,
            imgsz=_INFER_SIZE,
            conf=settings.confidence_threshold,
            iou=settings.iou_threshold,
            verbose=False,
        )

        detections: list[Detection] = []
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

        return DetectionResult(
            detections=detections,
            metadata={"model": "human.pt", "image_size": [w, h]},
        )
