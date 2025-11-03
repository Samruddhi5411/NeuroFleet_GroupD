from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load trained XGBoost model
model = joblib.load('eta_xgb_model.pkl')
print("✅ ETA Predictor model loaded successfully!")

@app.route("/predict-eta", methods=["POST"])
def predict_eta():
    data = request.json
    try:
        features = np.array([[ 
            data['distanceKm'],
            data['avgSpeed'],
            data['trafficLevel'],
            data['batteryLevel'],
            data['fuelLevel']
        ]])
        prediction = model.predict(features)
        return jsonify({"predicted_eta": round(float(prediction[0]), 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
