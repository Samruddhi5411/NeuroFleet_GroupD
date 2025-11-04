from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Load trained models (you'll train these)
try:
    eta_model = joblib.load('models/eta_xgb_model.pkl')
    print("✅ ETA model loaded")
except:
    print("⚠️ ETA model not found, using fallback")
    eta_model = None

# Traffic level mapping
TRAFFIC_MAP = {'Low': 0.2, 'Medium': 0.5, 'High': 0.8}

@app.route('/predict-eta', methods=['POST'])
def predict_eta():
    """Predict ETA using XGBoost model"""
    try:
        data = request.json
        
        # Extract features
        distance_km = data.get('distanceKm', 0)
        avg_speed = data.get('avgSpeed', 50)
        traffic_level = TRAFFIC_MAP.get(data.get('trafficLevel', 'Medium'), 0.5)
        battery_level = data.get('batteryLevel', 100)
        fuel_level = data.get('fuelLevel', 100)
        
        if eta_model:
            # Use trained model
            features = np.array([[distance_km, avg_speed, traffic_level, battery_level, fuel_level]])
            prediction = eta_model.predict(features)
            eta = round(float(prediction[0]), 2)
        else:
            # Fallback calculation
            base_time = (distance_km / avg_speed) * 60
            traffic_factor = 1 + traffic_level
            eta = round(base_time * traffic_factor, 2)
        
        return jsonify({
            'predicted_eta': eta,
            'distance_km': distance_km,
            'avg_speed': avg_speed,
            'traffic_level': data.get('trafficLevel', 'Medium')
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/predict-maintenance', methods=['POST'])
def predict_maintenance():
    """Predict maintenance needs based on vehicle data"""
    try:
        data = request.json
        
        health_score = data.get('healthScore', 100)
        mileage = data.get('mileage', 0)
        kms_since_service = data.get('kmsSinceService', 0)
        battery_level = data.get('batteryLevel', 100)
        
        # Simple predictive logic
        risk_score = 0
        issues = []
        
        if health_score < 70:
            risk_score += 30
            issues.append('Low health score detected')
        
        if kms_since_service > 5000:
            risk_score += 25
            issues.append('Service overdue')
        
        if battery_level < 20:
            risk_score += 20
            issues.append('Low battery/fuel')
        
        if mileage > 50000:
            risk_score += 15
            issues.append('High mileage vehicle')
        
        # Determine priority
        if risk_score > 60:
            priority = 'CRITICAL'
            days_to_failure = random.randint(1, 7)
        elif risk_score > 40:
            priority = 'HIGH'
            days_to_failure = random.randint(7, 15)
        elif risk_score > 20:
            priority = 'MEDIUM'
            days_to_failure = random.randint(15, 30)
        else:
            priority = 'LOW'
            days_to_failure = random.randint(30, 90)
        
        return jsonify({
            'risk_score': risk_score,
            'priority': priority,
            'predicted_days_to_failure': days_to_failure,
            'issues': issues,
            'recommended_action': 'Schedule maintenance soon' if risk_score > 40 else 'Monitor regularly'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/recommend-vehicle', methods=['POST'])
def recommend_vehicle():
    """Recommend best vehicle for customer"""
    try:
        data = request.json
        
        customer_prefs = data.get('preferences', {})
        available_vehicles = data.get('vehicles', [])
        
        # Score vehicles based on preferences
        scored_vehicles = []
        for vehicle in available_vehicles:
            score = 0
            
            # Type preference
            if customer_prefs.get('preferredType') == vehicle.get('type'):
                score += 30
            
            # Electric preference
            if customer_prefs.get('preferElectric') == vehicle.get('isElectric'):
                score += 25
            
            # Capacity match
            if vehicle.get('capacity', 0) >= customer_prefs.get('minCapacity', 4):
                score += 20
            
            # Vehicle health
            score += vehicle.get('healthScore', 100) * 0.25
            
            scored_vehicles.append({
                'vehicle': vehicle,
                'score': score
            })
        
        # Sort by score
        scored_vehicles.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'recommendations': [sv['vehicle'] for sv in scored_vehicles[:3]],
            'scores': [sv['score'] for sv in scored_vehicles[:3]]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/optimize-route', methods=['POST'])
def optimize_route():
    """Optimize route between pickup and dropoff"""
    try:
        data = request.json
        
        pickup = data.get('pickup', {})
        dropoff = data.get('dropoff', {})
        traffic_condition = data.get('trafficCondition', 'Medium')
        
        # Calculate distance (simplified Haversine)
        lat1, lon1 = pickup.get('lat', 19.0760), pickup.get('lon', 72.8777)
        lat2, lon2 = dropoff.get('lat', 19.1136), dropoff.get('lon', 72.8697)
        
        distance_km = ((lat2 - lat1)**2 + (lon2 - lon1)**2)**0.5 * 111  # rough approximation
        
        # Traffic impact
        traffic_multiplier = TRAFFIC_MAP.get(traffic_condition, 0.5) + 1
        
        # Generate route options
        routes = [
            {
                'name': 'Fastest Route',
                'distance_km': round(distance_km, 2),
                'duration_minutes': round(distance_km / 40 * 60 * traffic_multiplier, 0),
                'traffic_condition': traffic_condition,
                'fuel_efficiency': 'Medium'
            },
            {
                'name': 'Shortest Route',
                'distance_km': round(distance_km * 0.9, 2),
                'duration_minutes': round(distance_km * 0.9 / 35 * 60 * traffic_multiplier, 0),
                'traffic_condition': traffic_condition,
                'fuel_efficiency': 'High'
            },
            {
                'name': 'Scenic Route',
                'distance_km': round(distance_km * 1.2, 2),
                'duration_minutes': round(distance_km * 1.2 / 45 * 60 * traffic_multiplier, 0),
                'traffic_condition': 'Low',
                'fuel_efficiency': 'Low'
            }
        ]
        
        return jsonify({
            'routes': routes,
            'recommended': routes[0]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'NeuroFleetX AI Service'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)