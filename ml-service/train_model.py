"""
Script untuk training model prediksi stunting menggunakan dataset Stunting.csv
Target: Prediksi stunting berdasarkan BB, TB, LILA, Lingkar Kepala
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import xgboost as xgb
import joblib
import os
from datetime import datetime

# Konfigurasi
DATASET_PATH = "./Dataset ML.csv"
MODEL_DIR = "./models"
RANDOM_STATE = 42

def ensure_model_dir():
    """Pastikan direktori models ada"""
    os.makedirs(MODEL_DIR, exist_ok=True)

def parse_age(age_str):
    """
    Parse umur dari format 'X Tahun - Y Bulan - Z Hari'
    Return umur dalam bulan
    """
    if pd.isna(age_str):
        return 0
    
    age_str = str(age_str).strip()
    try:
        # Format: "1 Tahun - 11 Bulan - 19 Hari"
        parts = age_str.split("-")
        tahun = bulan = hari = 0
        
        for part in parts:
            part = part.strip()
            if "Tahun" in part:
                tahun = int(part.replace("Tahun", "").strip())
            elif "Bulan" in part:
                bulan = int(part.replace("Bulan", "").strip())
            elif "Hari" in part:
                hari = int(part.replace("Hari", "").strip())
        
        total_months = tahun * 12 + bulan + (hari // 30)
        return total_months
    except:
        return 0

def create_stunting_label(z_score_tb_u):
    """
    Buat label stunting berdasarkan Z-Score TB/U (WHO standard)
    Stunting: Z-Score TB/U < -2
    """
    if pd.isna(z_score_tb_u):
        return 0
    
    try:
        z_score = float(z_score_tb_u)
        return 1 if z_score < -2 else 0
    except:
        return 0

def load_and_prepare_data(csv_path):
    """Load dan prepare data dari CSV"""
    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path, sep=';')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    
    # Clean column names (remove whitespace)
    df.columns = df.columns.str.strip()
    
    # Parse umur ke bulan
    df['Usia_Bulan'] = df['Usia Saat Ukur'].apply(parse_age)
    
    # Create stunting label (target variable)
    df['Stunting_Label'] = df['ZS TB/U'].apply(create_stunting_label)
    
    # Encode jenis kelamin (assumed dari data, jika ada)
    # Jika tidak ada, default ke 0 (Laki-laki)
    df['Jenis_Kelamin_Encoded'] = 0  # Default
    
    # Pilih features yang akan digunakan untuk model
    features = ['Berat', 'Tinggi', 'LiLA', 'Berat', 'Usia_Bulan']
    
    # Rename untuk clarity
    df['Berat_Saat_Ukur'] = df['Berat']
    df['Tinggi_Saat_Ukur'] = df['Tinggi']
    df['LILA'] = df['LiLA']
    df['Lingkar_Kepala'] = df['Berat']  # NOTE: Dataset tidak punya lingkar kepala, using berat as proxy
    
    # Features untuk model
    X_features = [
        'Berat_Saat_Ukur',      # Berat Badan saat ukur (kg)
        'Tinggi_Saat_Ukur',     # Tinggi Badan saat ukur (cm)
        'LILA',                 # Lingkar Lengan Atas (cm)
        'Lingkar_Kepala',       # Lingkar Kepala proxy (cm)
        'Usia_Bulan',           # Umur saat ukur (bulan)
        'Jenis_Kelamin_Encoded' # Jenis Kelamin (0=Laki-laki, 1=Perempuan)
    ]
    
    # Remove rows dengan missing values di features atau target
    df_clean = df[X_features + ['Stunting_Label']].dropna()
    
    print(f"Data setelah cleaning: {df_clean.shape}")
    print(f"Stunting distribution:\n{df_clean['Stunting_Label'].value_counts()}")
    
    # Prepare X dan y
    X = df_clean[X_features]
    y = df_clean['Stunting_Label']
    
    return X, y, X_features

def train_models(X, y, feature_names):
    """Train multiple models dan select yang terbaik"""
    print("\n" + "="*60)
    print("Training Models...")
    print("="*60)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    
    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    models = {
        'RandomForest': RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),
        'GradientBoosting': GradientBoostingClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=RANDOM_STATE
        ),
        'XGBoost': xgb.XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=RANDOM_STATE,
            eval_metric='logloss',
            verbosity=0
        )
    }
    
    best_model_name = None
    best_score = -1
    results = {}
    
    for model_name, model in models.items():
        print(f"\nTraining {model_name}...")
        
        # Train
        model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = model.score(X_train_scaled, y_train)
        test_score = model.score(X_test_scaled, y_test)
        
        y_pred = model.predict(X_test_scaled)
        y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
        
        roc_auc = roc_auc_score(y_test, y_pred_proba)
        
        results[model_name] = {
            'model': model,
            'train_score': train_score,
            'test_score': test_score,
            'roc_auc': roc_auc,
            'y_pred': y_pred,
            'y_test': y_test
        }
        
        print(f"  Train Accuracy: {train_score:.4f}")
        print(f"  Test Accuracy: {test_score:.4f}")
        print(f"  ROC AUC: {roc_auc:.4f}")
        print(f"\n  Classification Report:\n{classification_report(y_test, y_pred)}")
        
        if roc_auc > best_score:
            best_score = roc_auc
            best_model_name = model_name
    
    print(f"\n{'='*60}")
    print(f"Best Model: {best_model_name} (ROC AUC: {best_score:.4f})")
    print(f"{'='*60}")
    
    best_model = results[best_model_name]['model']
    
    return best_model, scaler, feature_names

def save_model(model, scaler, feature_names):
    """Simpan model dan scaler"""
    ensure_model_dir()
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    model_path = os.path.join(MODEL_DIR, f"stunting_model_{timestamp}.pkl")
    scaler_path = os.path.join(MODEL_DIR, f"scaler_{timestamp}.pkl")
    features_path = os.path.join(MODEL_DIR, f"features_{timestamp}.pkl")
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(feature_names, features_path)
    
    # Save latest version (untuk production)
    joblib.dump(model, os.path.join(MODEL_DIR, "stunting_model_latest.pkl"))
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler_latest.pkl"))
    joblib.dump(feature_names, os.path.join(MODEL_DIR, "features_latest.pkl"))
    
    print(f"\nModel saved:")
    print(f"  - {model_path}")
    print(f"  - {scaler_path}")
    print(f"  - {features_path}")
    print(f"\nLatest models:")
    print(f"  - {os.path.join(MODEL_DIR, 'stunting_model_latest.pkl')}")
    print(f"  - {os.path.join(MODEL_DIR, 'scaler_latest.pkl')}")
    print(f"  - {os.path.join(MODEL_DIR, 'features_latest.pkl')}")

def main():
    """Main training pipeline"""
    print("🚀 Stunting Prediction Model Training")
    print("="*60)
    
    # Load dan prepare data
    X, y, feature_names = load_and_prepare_data(DATASET_PATH)
    
    # Train models
    best_model, scaler, features = train_models(X, y, feature_names)
    
    # Save models
    save_model(best_model, scaler, features)
    
    print("\n✅ Training Complete!")

if __name__ == "__main__":
    main()
