"""
FastAPI Service untuk Prediksi Stunting
Endpoint untuk menerima data pengukuran anak dan melakukan prediksi
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
from typing import Optional
import logging
from enum import Enum

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Stunting Prediction Service",
    description="ML Service untuk prediksi stunting anak",
    version="1.0.0"
)

# ── CORS ── izinkan request dari frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model & Scaler paths
MODEL_DIR = "./models"
MODEL_PATH = os.path.join(MODEL_DIR, "stunting_model_latest.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler_latest.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "features_latest.pkl")

# Global variables untuk model
model = None
scaler = None
feature_names = None

# Enums
class JenisKelaminEnum(str, Enum):
    LAKI_LAKI = "Laki-laki"
    PEREMPUAN = "Perempuan"

# Request/Response Models
class PredictStuntingRequest(BaseModel):
    """Request untuk prediksi stunting"""
    bb: float = Field(..., description="Berat Badan (kg)", ge=0, le=50)
    tb: float = Field(..., description="Tinggi Badan (cm)", ge=30, le=150)
    lila: float = Field(..., description="Lingkar Lengan Atas (cm)", ge=0, le=35)
    lingkar_kepala: float = Field(default=0, description="Lingkar Kepala (cm)", ge=0, le=60)
    umur: int = Field(..., description="Umur saat ukur (bulan)", ge=0, le=60)
    jenis_kelamin: JenisKelaminEnum = Field(..., description="Jenis Kelamin")
    
    class Config:
        example = {
            "bb": 12.5,
            "tb": 85.0,
            "lila": 14.5,
            "lingkar_kepala": 46.5,
            "umur": 24,
            "jenis_kelamin": "Laki-laki"
        }

class PredictStuntingResponse(BaseModel):
    """Response untuk prediksi stunting"""
    stunting_risk: float = Field(..., description="Probabilitas stunting (0-100%)")
    classification: str = Field(..., description="Klasifikasi: STUNTING, AT_RISK, NORMAL")
    confidence: float = Field(..., description="Confidence score (0-100%)")
    z_score_tb_u_estimated: float = Field(..., description="Estimated Z-Score TB/U")
    status_tb_u: str = Field(..., description="Status Tinggi Badan/Umur")
    rekomendasi: str = Field(..., description="Rekomendasi untuk bidan")
    message: str = Field(..., description="Pesan umum")

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    message: str

# Helper functions
def load_model_and_scaler():
    """Load model dan scaler dari file"""
    global model, scaler, feature_names
    
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model tidak ditemukan di {MODEL_PATH}")
        if not os.path.exists(SCALER_PATH):
            raise FileNotFoundError(f"Scaler tidak ditemukan di {SCALER_PATH}")
        if not os.path.exists(FEATURES_PATH):
            raise FileNotFoundError(f"Features tidak ditemukan di {FEATURES_PATH}")
        
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        feature_names = joblib.load(FEATURES_PATH)

        if not isinstance(feature_names, list) or not feature_names:
            raise ValueError("Metadata feature tidak valid")
        
        logger.info("✅ Model, scaler, dan features berhasil di-load")
        return True
    except Exception as e:
        logger.error(f"❌ Error loading model: {str(e)}")
        return False

def build_feature_vector(request: PredictStuntingRequest) -> np.ndarray:
    """Bangun feature vector sesuai metadata fitur model."""
    jenis_kelamin_encoded = 1 if request.jenis_kelamin == JenisKelaminEnum.PEREMPUAN else 0

    feature_value_map = {
        "bb": request.bb,
        "berat": request.bb,
        "berat_saat_ukur": request.bb,
        "tb": request.tb,
        "tinggi": request.tb,
        "tinggi_saat_ukur": request.tb,
        "lila": request.lila,
        "lingkar_lengan_atas": request.lila,
        "lingkar_kepala": request.lingkar_kepala,
        "umur": float(request.umur),
        "usia_bulan": float(request.umur),
        "jenis_kelamin": float(jenis_kelamin_encoded),
        "jenis_kelamin_encoded": float(jenis_kelamin_encoded),
    }

    feature_row = []
    missing_features = []

    for feature_name in feature_names or []:
        normalized_name = feature_name.strip().lower().replace(" ", "_")
        value = feature_value_map.get(normalized_name)
        if value is None:
            missing_features.append(feature_name)
            value = 0.0
        feature_row.append(float(value))

    if missing_features:
        logger.warning(
            "⚠️ Feature berikut tidak ditemukan di request dan diisi 0.0: %s",
            ", ".join(missing_features),
        )

    return np.array([feature_row], dtype=float)

def classify_stunting(risk_percentage: float, z_score: float) -> tuple[str, str]:
    """
    Klasifikasi hasil prediksi
    Returns: (classification, rekomendasi)
    """
    if risk_percentage >= 70 or z_score < -2:
        classification = "STUNTING"
        rekomendasi = (
            "🚨 RISIKO TINGGI STUNTING. "
            "Anjurkan keluarga untuk konsultasi dengan dokter gizi. "
            "Tingkatkan asupan nutrisi, terutama protein dan mineral. "
            "Follow-up dalam 2 minggu."
        )
    elif risk_percentage >= 40 or -2 <= z_score < -1.5:
        classification = "AT_RISK"
        rekomendasi = (
            "⚠️ RISIKO SEDANG. "
            "Monitor pertumbuhan lebih ketat. "
            "Berikan edukasi nutrisi kepada keluarga. "
            "Follow-up dalam 1 bulan."
        )
    else:
        classification = "NORMAL"
        rekomendasi = (
            "✅ STATUS NORMAL. "
            "Pertahankan pola nutrisi yang baik. "
            "Lanjutkan pemantauan rutin di posyandu. "
            "Follow-up dalam 3 bulan."
        )
    
    return classification, rekomendasi

def estimate_z_score_tb_u(tinggi: float, umur: int) -> float:
    """
    Estimasi Z-Score TB/U berdasarkan tinggi dan umur
    Menggunakan pendekatan sederhana (bisa diganti dengan WHO growth charts)
    """
    # Simplified estimation (dalam praktik, gunakan WHO growth reference charts)
    # Ini adalah placeholder untuk demonstrasi
    
    # Expected height ranges (simplified)
    expected_heights = {
        12: 75,    # 12 bulan
        18: 80,    # 18 bulan
        24: 85,    # 2 tahun
        36: 95,    # 3 tahun
        48: 105,   # 4 tahun
        60: 110    # 5 tahun
    }
    
    # Find closest expected height
    closest_age = min(expected_heights.keys(), key=lambda x: abs(x - umur))
    expected_height = expected_heights[closest_age]
    
    # Z-Score = (Observed - Mean) / SD
    # SD untuk tinggi anak ~ 5-6 cm
    sd = 5.5
    z_score = (tinggi - expected_height) / sd
    
    return round(z_score, 2)

def get_status_tb_u(z_score: float) -> str:
    """Tentukan status TB/U berdasarkan Z-Score"""
    if z_score < -2:
        return "Sangat Pendek (Stunted)"
    elif z_score < -1:
        return "Pendek (Stunted)"
    elif z_score < 1:
        return "Normal"
    elif z_score < 2:
        return "Tinggi"
    else:
        return "Sangat Tinggi"

# Startup event
@app.on_event("startup")
async def startup_event():
    """Load model saat startup"""
    logger.info("🚀 Starting up Stunting Prediction Service...")
    if load_model_and_scaler():
        logger.info("✅ Service ready!")
    else:
        logger.error("❌ Failed to load model. Service may not work correctly.")

# Health check endpoint
@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Check health status of the service"""
    model_loaded = model is not None and scaler is not None
    
    return HealthCheckResponse(
        status="healthy" if model_loaded else "unhealthy",
        model_loaded=model_loaded,
        message="Model loaded successfully" if model_loaded else "Model not loaded"
    )

# Prediction endpoint
@app.post("/predict", response_model=PredictStuntingResponse)
async def predict_stunting(request: PredictStuntingRequest):
    """
    Prediksi stunting berdasarkan data pengukuran anak
    
    Input:
    - bb: Berat Badan (kg)
    - tb: Tinggi Badan (cm)
    - lila: Lingkar Lengan Atas (cm)
    - lingkar_kepala: Lingkar Kepala (cm)
    - umur: Umur saat ukur (bulan)
    - jenis_kelamin: Jenis Kelamin (Laki-laki/Perempuan)
    
    Output:
    - stunting_risk: Probabilitas stunting (%)
    - classification: Klasifikasi hasil (STUNTING/AT_RISK/NORMAL)
    - confidence: Tingkat kepercayaan prediksi (%)
    - z_score_tb_u_estimated: Estimated Z-Score TB/U
    - status_tb_u: Status Tinggi Badan/Umur
    - rekomendasi: Rekomendasi tindakan
    """
    
    try:
        if model is None or scaler is None:
            raise HTTPException(
                status_code=500,
                detail="Model belum di-load. Silakan coba beberapa saat lagi."
            )
        
        # Prepare features sesuai metadata training
        features = build_feature_vector(request)
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        prediction_proba = model.predict_proba(features_scaled)[0]
        
        # Get probability untuk stunting (class 1)
        stunting_probability = float(prediction_proba[1])
        stunting_risk_percent = stunting_probability * 100
        
        # Estimate Z-Score TB/U
        z_score_tb_u = estimate_z_score_tb_u(request.tb, request.umur)
        status_tb_u = get_status_tb_u(z_score_tb_u)
        
        # Classify
        classification, rekomendasi = classify_stunting(stunting_risk_percent, z_score_tb_u)
        
        # Confidence
        confidence = max(prediction_proba) * 100
        
        logger.info(f"✅ Prediction: {classification} (Risk: {stunting_risk_percent:.1f}%)")
        
        return PredictStuntingResponse(
            stunting_risk=round(stunting_risk_percent, 2),
            classification=classification,
            confidence=round(confidence, 2),
            z_score_tb_u_estimated=z_score_tb_u,
            status_tb_u=status_tb_u,
            rekomendasi=rekomendasi,
            message="Prediksi stunting berhasil dibuat"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error saat melakukan prediksi: {str(e)}"
        )

# Info endpoint
@app.get("/info")
async def info():
    """Get service information"""
    return {
        "service": "Stunting Prediction ML Service",
        "version": "1.0.0",
        "description": "Machine Learning service untuk prediksi stunting pada anak",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "info": "/info"
        },
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "scaler_path": SCALER_PATH
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Stunting Prediction ML Service",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting Stunting Prediction Service...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
