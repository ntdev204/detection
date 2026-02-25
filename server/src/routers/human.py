import base64
import logging
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from ..services.detection_service import DetectionService, get_detection_service
from ..schemas.human import HumanDetectionResult

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/human", tags=["Human Detection"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/detect", response_model=HumanDetectionResult)
async def detect_human(
    file: UploadFile = File(...),
    service: DetectionService = Depends(get_detection_service),
) -> HumanDetectionResult:
    """Detect humans in an uploaded image. Returns counts and confidence stats (no bounding box image)."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG, PNG, or WebP.",
        )
    image_bytes = await file.read()
    try:
        return service.detect_human(image_bytes)
    except Exception as exc:
        logger.exception("Human detection failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.websocket("/ws")
async def human_websocket(
    websocket: WebSocket,
    service: DetectionService = Depends(get_detection_service),
) -> None:
    """
    WebSocket endpoint for real-time human detection.
    Client sends base64-encoded JPEG frames; server responds with JSON
    including bounding boxes for canvas rendering.
    """
    await websocket.accept()
    logger.info("Human WebSocket connected")
    try:
        while True:
            data = await websocket.receive_text()
            # Expected: "data:image/jpeg;base64,<data>" or raw base64
            if "," in data:
                data = data.split(",", 1)[1]
            image_bytes = base64.b64decode(data)
            result = service.detect_human(image_bytes)
            await websocket.send_json(result.model_dump())
    except WebSocketDisconnect:
        logger.info("Human WebSocket disconnected")
    except Exception as exc:
        logger.exception("Human WebSocket error")
        await websocket.send_json({"success": False, "error": str(exc)})
        await websocket.close()
