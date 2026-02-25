from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Detection:
    """Single object detection result."""
    label: str
    confidence: float
    bbox: list[float]  # [x1, y1, x2, y2] normalized 0-1


@dataclass
class DetectionResult:
    """Structured inference result from any detector."""
    detections: list[Detection] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def count(self) -> int:
        return len(self.detections)

    @property
    def max_confidence(self) -> float:
        if not self.detections:
            return 0.0
        return max(d.confidence for d in self.detections)

    @property
    def avg_confidence(self) -> float:
        if not self.detections:
            return 0.0
        return sum(d.confidence for d in self.detections) / len(self.detections)


class BaseDetector(ABC):
    """Abstract base class for all detectors (OCP: open for extension)."""

    @abstractmethod
    def load(self) -> None:
        """Load the underlying model into memory."""

    @abstractmethod
    def detect(self, image_bytes: bytes) -> DetectionResult:
        """
        Run inference on raw image bytes.

        Args:
            image_bytes: JPEG/PNG/WebP bytes.

        Returns:
            DetectionResult with bounding boxes and metadata.
        """

    def _decode_image(self, image_bytes: bytes):
        """Decode bytes to numpy array via PIL."""
        import io
        import numpy as np
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return np.array(img)
