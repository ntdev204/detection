import logging
import sys
import os

# ── Bootstrap: allow `python src/main.py` from the server/ directory ──────────
# Adds server/ (parent of src/) to sys.path so `from src.X import ...` works
# whether the file is run directly or via `python -m src.main`.
_server_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _server_dir not in sys.path:
    sys.path.insert(0, _server_dir)
# ──────────────────────────────────────────────────────────────────────────────

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config.settings import settings
from src.services.detection_service import get_detection_service
from src.routers import human, traffic

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models once at startup; clean up on shutdown."""
    service = get_detection_service()
    service.load_all()
    yield
    logger.info("Shutting down detection service")


app = FastAPI(
    title="Detection API",
    description="Human & Traffic detection API powered by YOLOv8",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(human.router)
app.include_router(traffic.router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "models": ["human.pt", "traffic.pt"]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
