from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # Server
    host: str = "0.0.0.0"
    port: int = 8080
    debug: bool = False

    # Model paths
    human_model_path: str = str(BASE_DIR / "models" / "human.pt")
    traffic_model_path: str = str(BASE_DIR / "models" / "traffic.pt")

    # CORS — supports "*" wildcard or comma-separated origins
    cors_origins: str = "http://localhost:3000"

    # Detection thresholds
    confidence_threshold: float = 0.25
    iou_threshold: float = 0.45

    # Traffic density thresholds
    traffic_low_threshold: int = 10
    traffic_high_threshold: int = 30

    @property
    def cors_origins_list(self) -> list[str]:
        raw = self.cors_origins.strip()
        if raw == "*":
            return ["*"]
        return [o.strip() for o in raw.split(",") if o.strip()]

    class Config:
        env_file = ".env.local"
        extra = "ignore"


settings = Settings()

