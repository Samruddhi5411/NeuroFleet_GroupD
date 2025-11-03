import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import joblib

# =====================================================
# 1️⃣ Load CSV data
# =====================================================
df = pd.read_csv('fleet_routes.csv')
print("✅ Loaded data successfully! Rows:", len(df))
print("Columns:", df.columns.tolist())

# =====================================================
# 2️⃣ Convert traffic_level to numeric values
# =====================================================
traffic_map = {'Low': 0.2, 'Medium': 0.5, 'High': 0.8}
df['traffic_level'] = df['traffic_level'].map(traffic_map)

# =====================================================
# 3️⃣ Ensure numeric data types for all feature columns
# =====================================================
numeric_cols = ['distance_km', 'avg_speed', 'traffic_level', 'battery_level', 'fuel_level']
df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')

# =====================================================
# 4️⃣ Clean NaNs (just in case)
# =====================================================
df = df.dropna(subset=numeric_cols + ['historical_eta_minutes'])

# =====================================================
# 5️⃣ Split features (X) and target (y)
# =====================================================
X = df[numeric_cols]
y = df['historical_eta_minutes']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# =====================================================
# 6️⃣ Train XGBoost model
# =====================================================
model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.8,
    random_state=42
)

print("🚀 Training model...")
model.fit(X_train, y_train)
print("✅ Model training completed!")

# =====================================================
# 7️⃣ Evaluate and save
# =====================================================
score = model.score(X_test, y_test)
print(f"📈 Model R² Score: {score:.3f}")

joblib.dump(model, 'eta_xgb_model.pkl')
print("💾 Model saved as eta_xgb_model.pkl")
