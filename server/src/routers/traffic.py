import base64
import logging
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from ..services.detection_service import DetectionService, get_detection_service
from ..schemas.traffic import TrafficDetectionResult

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/traffic", tags=["Traffic Detection"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "video/mp4", "video/mpeg", "video/webm"}


@router.post("/detect", response_model=TrafficDetectionResult)
async def detect_traffic(
    file: UploadFile = File(...),
    service: DetectionService = Depends(get_detection_service),
) -> TrafficDetectionResult:
    """
    Detect traffic objects in an uploaded image or video frame.
    For videos, the client should extract and send a representative frame.
    """
    image_bytes = await file.read()
    try:
        return service.detect_traffic(image_bytes)
    except Exception as exc:
        logger.exception("Traffic detection failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.websocket("/ws")
async def traffic_websocket(
    websocket: WebSocket,
    service: DetectionService = Depends(get_detection_service),
) -> None:
    """
    WebSocket endpoint for real-time traffic detection.
    Client sends base64-encoded JPEG frames; server responds with JSON
    including per-class vehicle counts and bounding boxes.
    """
    await websocket.accept()
    logger.info("Traffic WebSocket connected")
    try:
        while True:
            data = await websocket.receive_text()
            if "," in data:
                data = data.split(",", 1)[1]
            image_bytes = base64.b64decode(data)
            result = service.detect_traffic(image_bytes)
            await websocket.send_json(result.model_dump())
    except WebSocketDisconnect:
        logger.info("Traffic WebSocket disconnected")
    except Exception as exc:
        logger.exception("Traffic WebSocket error")
        await websocket.send_json({"success": False, "error": str(exc)})
        await websocket.close()
