"""
FastAPI Service untuk Deteksi Risiko Stunting
Menggunakan model XGBoost hasil training.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enum import Enum

import numpy as np
import joblib
import logging
import os

# =========================================================
# LOGGING
# =========================================================

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

# =========================================================
# FASTAPI INIT
# =========================================================

app = FastAPI(
    title="Stunting Detection ML Service",
    description="Machine Learning Service untuk deteksi risiko stunting anak",
    version="2.0.0"
)

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# MODEL PATH
# =========================================================

MODEL_DIR = "./models"

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "stunting_model_latest.pkl"
)

SCALER_PATH = os.path.join(
    MODEL_DIR,
    "scaler_latest.pkl"
)

FEATURES_PATH = os.path.join(
    MODEL_DIR,
    "features_latest.pkl"
)

# =========================================================
# GLOBAL VARIABLES
# =========================================================

model = None
scaler = None
feature_names = None

# =========================================================
# ENUMS
# =========================================================

class JenisKelaminEnum(str, Enum):
    LAKI_LAKI = "Laki-laki"
    PEREMPUAN = "Perempuan"

# =========================================================
# REQUEST MODEL
# =========================================================

class PredictStuntingRequest(BaseModel):

    bb_lahir: float = Field(
        ...,
        description="Berat badan lahir (kg)",
        ge=1,
        le=6
    )

    tb_lahir: float = Field(
        ...,
        description="Tinggi badan lahir (cm)",
        ge=30,
        le=60
    )

    bb: float = Field(
        ...,
        description="Berat badan saat ukur (kg)",
        ge=0,
        le=50
    )

    tb: float = Field(
        ...,
        description="Tinggi badan saat ukur (cm)",
        ge=0,
        le=150
    )

    lila: float = Field(
        ...,
        description="Lingkar Lengan Atas (cm)",
        ge=0,
        le=35
    )

    umur: int = Field(
        ...,
        description="Umur dalam bulan",
        ge=0,
        le=60
    )

    jenis_kelamin: JenisKelaminEnum

    class Config:
        json_schema_extra = {
            "example": {
                "bb_lahir": 3.1,
                "tb_lahir": 49,
                "bb": 10.5,
                "tb": 78,
                "lila": 13.5,
                "umur": 24,
                "jenis_kelamin": "Laki-laki"
            }
        }

# =========================================================
# RESPONSE MODEL
# =========================================================

class PredictStuntingResponse(BaseModel):

    stunting_risk: float

    classification: str

    confidence: float

    status_tb_u: str

    rekomendasi: str

    feature_summary: dict

    message: str

# =========================================================
# HEALTH CHECK
# =========================================================

class HealthCheckResponse(BaseModel):

    status: str

    model_loaded: bool

    message: str

# =========================================================
# LOAD MODEL
# =========================================================

def load_model_and_scaler():

    global model
    global scaler
    global feature_names

    try:

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model tidak ditemukan: {MODEL_PATH}"
            )

        if not os.path.exists(SCALER_PATH):
            raise FileNotFoundError(
                f"Scaler tidak ditemukan: {SCALER_PATH}"
            )

        if not os.path.exists(FEATURES_PATH):
            raise FileNotFoundError(
                f"Features tidak ditemukan: {FEATURES_PATH}"
            )

        model = joblib.load(MODEL_PATH)

        scaler = joblib.load(SCALER_PATH)

        feature_names = joblib.load(FEATURES_PATH)

        logger.info("✅ Model berhasil di-load")

        return True

    except Exception as e:

        logger.error(f"❌ Error loading model: {str(e)}")

        return False

# =========================================================
# FEATURE ENGINEERING
# =========================================================

def build_feature_vector(
    request: PredictStuntingRequest
):

    # =====================================================
    # FEATURE ENGINEERING
    # =====================================================

    bmi = request.bb / (
        (request.tb / 100) ** 2
    )

    bb_tb_ratio = (
        request.bb / request.tb
    )

    growth_height = (
        request.tb - request.tb_lahir
    )

    growth_weight = (
        request.bb - request.bb_lahir
    )

    # =====================================================
    # FEATURE MAP
    # =====================================================

    feature_value_map = {

        'BB Lahir': request.bb_lahir,

        'TB Lahir': request.tb_lahir,

        'Berat': request.bb,

        'Tinggi': request.tb,

        'LiLA': request.lila,

        'Usia_Bulan': request.umur,

        'BMI': bmi,

        'BB_TB_Ratio': bb_tb_ratio,

        'Growth_Height': growth_height,

        'Growth_Weight': growth_weight
    }

    # =====================================================
    # BUILD FEATURE ROW
    # =====================================================

    feature_row = []

    for feature_name in feature_names:

        value = feature_value_map.get(
            feature_name,
            0
        )

        feature_row.append(float(value))

    return (
        np.array([feature_row]),
        {
            "BMI": round(bmi, 2),
            "BB_TB_Ratio": round(bb_tb_ratio, 4),
            "Growth_Height": round(growth_height, 2),
            "Growth_Weight": round(growth_weight, 2)
        }
    )

# =========================================================
# CLASSIFICATION
# =========================================================

def classify_stunting(
    risk_percentage: float
):

    if risk_percentage >= 70:

        classification = "STUNTING"

        rekomendasi = (
            "RISIKO TINGGI STUNTING. "
            "Segera konsultasi ke dokter atau ahli gizi. "
            "Lakukan pemantauan pertumbuhan intensif."
        )

        status = "Sangat Pendek"

    elif risk_percentage >= 40:

        classification = "AT_RISK"

        rekomendasi = (
            "RISIKO SEDANG. "
            "Perlu pemantauan rutin dan edukasi nutrisi."
        )

        status = "Pendek"

    else:

        classification = "NORMAL"

        rekomendasi = (
            "Pertumbuhan anak normal. "
            "Lanjutkan pola makan sehat dan pemantauan rutin."
        )

        status = "Normal"

    return classification, rekomendasi, status

# =========================================================
# STARTUP
# =========================================================

@app.on_event("startup")
async def startup_event():

    logger.info(
        "🚀 Starting Stunting ML Service..."
    )

    if load_model_and_scaler():

        logger.info("✅ Service Ready")

    else:

        logger.error("❌ Failed loading model")

# =========================================================
# ROOT
# =========================================================

@app.get("/")
async def root():

    return {
        "message": "Stunting Detection ML Service",
        "version": "2.0.0",
        "docs": "/docs"
    }

# =========================================================
# HEALTH
# =========================================================

@app.get(
    "/health",
    response_model=HealthCheckResponse
)
async def health_check():

    model_loaded = (
        model is not None and
        scaler is not None
    )

    return HealthCheckResponse(
        status="healthy" if model_loaded else "unhealthy",
        model_loaded=model_loaded,
        message="Model loaded successfully"
        if model_loaded
        else "Model not loaded"
    )

# =========================================================
# INFO
# =========================================================

@app.get("/info")
async def info():

    return {
        "service": "Stunting Detection ML Service",
        "version": "2.0.0",
        "model_loaded": model is not None,
        "features": feature_names
    }

# =========================================================
# PREDICT
# =========================================================

@app.post(
    "/predict",
    response_model=PredictStuntingResponse
)
async def predict_stunting(
    request: PredictStuntingRequest
):

    try:

        if model is None or scaler is None:

            raise HTTPException(
                status_code=500,
                detail="Model belum di-load"
            )

        # =================================================
        # FEATURE ENGINEERING
        # =================================================

        features, feature_summary = (
            build_feature_vector(request)
        )

        # =================================================
        # SCALING
        # =================================================

        features_scaled = scaler.transform(
            features
        )

        # =================================================
        # PREDICT
        # =================================================

        prediction_proba = (
            model.predict_proba(
                features_scaled
            )[0]
        )

        stunting_probability = float(
            prediction_proba[1]
        )

        stunting_risk_percent = (
            stunting_probability * 100
        )

        confidence = (
            max(prediction_proba) * 100
        )

        # =================================================
        # CLASSIFICATION
        # =================================================

        classification, rekomendasi, status = (
            classify_stunting(
                stunting_risk_percent
            )
        )

        logger.info(
            f"Prediction => "
            f"{classification} | "
            f"Risk: {stunting_risk_percent:.2f}%"
        )

        return PredictStuntingResponse(

            stunting_risk=round(
                stunting_risk_percent,
                2
            ),

            classification=classification,

            confidence=round(
                confidence,
                2
            ),

            status_tb_u=status,

            rekomendasi=rekomendasi,

            feature_summary=feature_summary,

            message="Prediksi berhasil"
        )

    except HTTPException:

        raise

    except Exception as e:

        logger.error(
            f"Prediction error: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

