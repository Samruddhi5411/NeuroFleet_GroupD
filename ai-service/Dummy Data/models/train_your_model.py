import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import joblib

# =====================================================
# 1️⃣ Load CSV data
# =====================================================
print("📊 Loading fleet routes data...")
df = pd.read_csv('../data/fleet_routes.csv')
print(f"✅ Loaded {len(df)} records")
print("Columns:", df.columns.tolist())

# =====================================================
# 2️⃣ Convert traffic_level to numeric values
# =====================================================
traffic_map = {'Low': 0.2, 'Medium': 0.5, 'High': 0.8}
df['traffic_level'] = df['traffic_level'].map(traffic_map)

# =====================================================
# 3️⃣ Ensure numeric data types
# =====================================================
numeric_cols = ['distance_km', 'avg_speed', 'traffic_level', 'battery_level', 'fuel_level']
df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')

# =====================================================
# 4️⃣ Clean NaNs
# =====================================================
df = df.dropna(subset=numeric_cols + ['historical_eta_minutes'])
print(f"✅ Clean dataset: {len(df)} records")

# =====================================================
# 5️⃣ Split features (X) and target (y)
# =====================================================
X = df[numeric_cols]
y = df['historical_eta_minutes']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# =====================================================
# 6️⃣ Train XGBoost model
# =====================================================
print("\n🚀 Training XGBoost model...")
model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.8,
    random_state=42
)

model.fit(X_train, y_train)
print("✅ Model training completed!")

# =====================================================
# 7️⃣ Evaluate model
# =====================================================
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"\n📈 Model Performance:")
print(f"   Training R² Score: {train_score:.3f}")
print(f"   Testing R² Score: {test_score:.3f}")

# =====================================================
# 8️⃣ Save model
# =====================================================
joblib.dump(model, 'eta_xgb_model.pkl')
print("\n💾 Model saved as eta_xgb_model.pkl")

# =====================================================
# 9️⃣ Test prediction
# =====================================================
print("\n🧪 Testing prediction...")
test_input = np.array([[50, 60, 0.5, 80, 70]])  # distance, speed, traffic, battery, fuel
prediction = model.predict(test_input)
print(f"   Input: 50km, 60km/h, Medium traffic, 80% battery, 70% fuel")
print(f"   Predicted ETA: {prediction[0]:.2f} minutes")