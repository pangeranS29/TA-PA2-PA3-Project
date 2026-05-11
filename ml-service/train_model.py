import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    roc_auc_score,
    confusion_matrix,
    f1_score,
    recall_score
)

from imblearn.over_sampling import SMOTE
import xgboost as xgb

# =========================================================
# CONFIG
# =========================================================

DATASET_PATH = "./Dataset ML.csv"
MODEL_DIR = "./models"

os.makedirs(MODEL_DIR, exist_ok=True)

# =========================================================
# LOAD DATA
# =========================================================

df = pd.read_csv(DATASET_PATH, sep=';')

df.columns = df.columns.str.strip()

# =========================================================
# CLEANING
# =========================================================

numeric_cols = [
    'BB Lahir',
    'TB Lahir',
    'Berat',
    'Tinggi',
    'LiLA',
    'ZS TB/U'
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# =========================================================
# PARSE UMUR
# =========================================================

def parse_age(age_str):
    if pd.isna(age_str):
        return 0

    age_str = str(age_str)

    tahun = 0
    bulan = 0

    try:
        if "Tahun" in age_str:
            tahun = int(age_str.split("Tahun")[0].strip())

        if "Bulan" in age_str:
            bulan_part = age_str.split("Bulan")[0]
            bulan = int(bulan_part.split("-")[-1].strip())

    except:
        return 0

    return (tahun * 12) + bulan

df['Usia_Bulan'] = df['Usia Saat Ukur'].apply(parse_age)

# =========================================================
# TARGET
# =========================================================

df['Stunting_Label'] = (
    df['ZS TB/U'] < -2
).astype(int)

# =========================================================
# FEATURE ENGINEERING
# =========================================================

df['BMI'] = df['Berat'] / ((df['Tinggi']/100) ** 2)

df['BB_TB_Ratio'] = (
    df['Berat'] / df['Tinggi']
)

df['Growth_Height'] = (
    df['Tinggi'] - df['TB Lahir']
)

df['Growth_Weight'] = (
    df['Berat'] - df['BB Lahir']
)

# =========================================================
# REMOVE OUTLIERS
# =========================================================

df = df[
    (df['Berat'] >= 1) &
    (df['Berat'] <= 40) &
    (df['Tinggi'] >= 30) &
    (df['Tinggi'] <= 130) &
    (df['LiLA'] >= 5) &
    (df['LiLA'] <= 30)
]

# =========================================================
# FEATURES
# =========================================================

X_features = [
    'BB Lahir',
    'TB Lahir',
    'Berat',
    'Tinggi',
    'LiLA',
    'Usia_Bulan',
    'BMI',
    'BB_TB_Ratio',
    'Growth_Height',
    'Growth_Weight'
]

X = df[X_features]
y = df['Stunting_Label']

# =========================================================
# DROP MISSING
# =========================================================

data = pd.concat([X, y], axis=1).dropna()

X = data[X_features]
y = data['Stunting_Label']

print("Dataset:", X.shape)
print(y.value_counts())

# =========================================================
# SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =========================================================
# SCALER
# =========================================================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# =========================================================
# SMOTE
# =========================================================

smote = SMOTE(random_state=42)

X_train_resampled, y_train_resampled = smote.fit_resample(
    X_train_scaled,
    y_train
)

print("After SMOTE:")
print(pd.Series(y_train_resampled).value_counts())

# =========================================================
# MODEL
# =========================================================

model = xgb.XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric='logloss'
)

# =========================================================
# TRAIN
# =========================================================

model.fit(
    X_train_resampled,
    y_train_resampled
)

# =========================================================
# EVALUATION
# =========================================================

y_pred = model.predict(X_test_scaled)

y_prob = model.predict_proba(X_test_scaled)[:,1]

accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_prob)
f1 = f1_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)

print("\n==============================")
print("EVALUATION")
print("==============================")

print("Accuracy :", accuracy)
print("ROC AUC  :", roc_auc)
print("F1 Score :", f1)
print("Recall   :", recall)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# =========================================================
# FEATURE IMPORTANCE
# =========================================================

importance_df = pd.DataFrame({
    'Feature': X_features,
    'Importance': model.feature_importances_
}).sort_values(by='Importance', ascending=False)

print("\nFeature Importance:")
print(importance_df)

# =========================================================
# SAVE
# =========================================================

joblib.dump(
    model,
    os.path.join(MODEL_DIR, "stunting_model_latest.pkl")
)

joblib.dump(
    scaler,
    os.path.join(MODEL_DIR, "scaler_latest.pkl")
)

joblib.dump(
    X_features,
    os.path.join(MODEL_DIR, "features_latest.pkl")
)

print("\n✅ MODEL SAVED")

