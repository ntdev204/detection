import logging
from functools import lru_cache
from ..models.human_detector import HumanDetector
from ..models.traffic_detector import TrafficDetector
from ..schemas.human import HumanDetectionResult
from ..schemas.traffic import TrafficDetectionResult

logger = logging.getLogger(__name__)


class DetectionService:
    """
    Singleton service holding all detector instances.
    Loaded once at startup via app lifespan — never re-instantiated per request.
    """

    def __init__(self) -> None:
        self._human = HumanDetector()
        self._traffic = TrafficDetector()
        self._loaded = False

    def load_all(self) -> None:
        """Load all models into memory (called on app startup)."""
        if self._loaded:
            return
        logger.info("Loading all detection models...")
        self._human.load()
        self._traffic.load()
        self._loaded = True
        logger.info("All models loaded successfully")

    def detect_human(self, image_bytes: bytes) -> HumanDetectionResult:
        result = self._human.detect(image_bytes)
        return HumanDetectionResult.from_result(result)

    def detect_traffic(self, image_bytes: bytes) -> TrafficDetectionResult:
        result = self._traffic.detect(image_bytes)
        return TrafficDetectionResult.from_result(result)


@lru_cache(maxsize=1)
def get_detection_service() -> DetectionService:
    """FastAPI dependency — returns the singleton DetectionService."""
    return DetectionService()
