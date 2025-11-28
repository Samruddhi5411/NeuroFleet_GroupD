

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import math
from datetime import datetime, timedelta
import requests
import os

app = Flask(__name__)
CORS(app)

#  Update backend URL to match YOUR backend
SPRING_BOOT_URL = os.getenv('BACKEND_URL', 'http://localhost:8083/api')
MODEL_DIR = 'models'
os.makedirs(MODEL_DIR, exist_ok=True)

# Global variables for models
eta_predictor = None
vehicle_recommender = None
maintenance_predictor = None


# UTILITY FUNCTIONS


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two GPS coordinates in km"""
    R = 6371  # Earth's radius in km
    
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def get_traffic_factor(hour):
    """Simulate traffic patterns based on hour of day"""
    if 8 <= hour <= 10 or 18 <= hour <= 20:
        return 1.5  # Heavy traffic
    elif 11 <= hour <= 17:
        return 1.2  # Moderate traffic
    else:
        return 1.0  # Light traffic

def fetch_backend_data(endpoint):
    """Fetch data from Spring Boot backend"""
    try:
        # ✅ IMPORTANT: Add proper headers if needed
        url = f"{SPRING_BOOT_URL}/{endpoint}"
        print(f"📡 Fetching from: {url}")
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Successfully fetched {len(data) if isinstance(data, list) else 1} items from {endpoint}")
            return data
        else:
            print(f"⚠️ Backend returned status {response.status_code} for {endpoint}")
            return None
    except Exception as e:
        print(f"❌ Error fetching from backend: {e}")
        return None


#  ETA PREDICTION AI MODEL



class ETAPredictorAI:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_training_data(self):
        """Fetch real bookings data and prepare for training"""
        print("📊 Fetching booking data from backend...")
        
        bookings = fetch_backend_data('admin/bookings')
        
        if not bookings or len(bookings) < 10:
            print("⚠️ Not enough booking data, generating synthetic data...")
            return self._generate_synthetic_data()
        
        features = []
        targets = []
        
        for booking in bookings:
            if booking.get('status') == 'COMPLETED' and booking.get('startTime') and booking.get('endTime'):
                try:
                    distance = haversine_distance(
                        booking.get('pickupLatitude', 0),
                        booking.get('pickupLongitude', 0),
                        booking.get('dropoffLatitude', 0),
                        booking.get('dropoffLongitude', 0)
                    )
                    
                    start_time = datetime.fromisoformat(booking['startTime'].replace('Z', '+00:00'))
                    end_time = datetime.fromisoformat(booking['endTime'].replace('Z', '+00:00'))
                    actual_duration = (end_time - start_time).total_seconds() / 60  # minutes
                    
                    hour = start_time.hour
                    day_of_week = start_time.weekday()
                    traffic_factor = get_traffic_factor(hour)
                    
                    vehicle = booking.get('vehicle', {})
                    health_score = vehicle.get('healthScore', 80) / 100
                    is_electric = 1 if vehicle.get('isElectric') else 0
                    
                    features.append([
                        distance,
                        hour,
                        day_of_week,
                        traffic_factor,
                        health_score,
                        is_electric
                    ])
                    
                    targets.append(actual_duration)
                except Exception as e:
                    print(f"⚠️ Skipping booking {booking.get('id')}: {e}")
                    continue
        
        if len(features) < 10:
            print("⚠️ Insufficient completed bookings, adding synthetic data...")
            synthetic_features, synthetic_targets = self._generate_synthetic_data()
            features.extend(synthetic_features)
            targets.extend(synthetic_targets)
        
        print(f"✅ Prepared {len(features)} training samples")
        return np.array(features), np.array(targets)
    
    def _generate_synthetic_data(self, n_samples=100):
        """Generate REALISTIC synthetic training data for Indian cities"""
        features = []
        targets = []
        
        for _ in range(n_samples):
            distance = np.random.uniform(1, 50)  # 1-50 km
            hour = np.random.randint(0, 24)
            day_of_week = np.random.randint(0, 7)
            traffic_factor = get_traffic_factor(hour)
            health_score = np.random.uniform(0.7, 1.0)
            is_electric = np.random.choice([0, 1])
            
            #  Realistic speed calculation
            if traffic_factor > 1.3:  # Heavy traffic (peak hours)
                avg_speed = np.random.uniform(15, 25)  # 15-25 km/h
            elif traffic_factor > 1.1:  # Moderate traffic
                avg_speed = np.random.uniform(25, 40)  # 25-40 km/h
            else:  # Light traffic (late night)
                avg_speed = np.random.uniform(40, 60)  # 40-60 km/h
            
            # Calculate base time in minutes
            base_time = (distance / avg_speed) * 60
            
         
            health_penalty = (1 - health_score) * 3  # Max 3 min penalty
            electric_bonus = -1 if is_electric else 0  # EVs slightly faster
            random_variation = np.random.normal(0, 2)  # ±2 min variation
            
            # Final ETA
            eta = base_time + health_penalty + electric_bonus + random_variation
            eta = max(5, eta)  # Minimum 5 minutes
            
            features.append([distance, hour, day_of_week, traffic_factor, health_score, is_electric])
            targets.append(eta)
        
        return features, targets
    
    def train(self):
        """Train the ETA prediction model"""
        print("🤖 Training ETA Predictor AI...")
        
        X, y = self.prepare_training_data()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)
        
        score = self.model.score(X_test, y_test)
        print(f"✅ ETA Model trained! R² Score: {score:.3f}")
        
        joblib.dump(self.model, f'{MODEL_DIR}/eta_model.pkl')
        joblib.dump(self.scaler, f'{MODEL_DIR}/eta_scaler.pkl')
        
        self.is_trained = True
        return score
    
    def predict(self, pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, 
                vehicle_health=0.85, is_electric=False):
        """Predict ETA for a trip"""
        if not self.is_trained:
            print("⚠️ Model not trained, training now...")
            self.train()
        
        distance = haversine_distance(pickup_lat, pickup_lon, dropoff_lat, dropoff_lon)
        now = datetime.now()
        hour = now.hour
        day_of_week = now.weekday()
        traffic_factor = get_traffic_factor(hour)
        
        features = np.array([[
            distance,
            hour,
            day_of_week,
            traffic_factor,
            vehicle_health,
            1 if is_electric else 0
        ]])
        
        features_scaled = self.scaler.transform(features)
        eta_minutes = self.model.predict(features_scaled)[0]
        
        # 🔧 SAFETY CHECK: Cap unrealistic predictions
        if eta_minutes > distance * 10:  # If ETA > 10 min/km, recalculate
            print(f"⚠️ Unrealistic prediction detected: {eta_minutes:.1f} min for {distance:.2f} km")
            # Fallback to rule-based calculation
            if traffic_factor > 1.3:
                avg_speed = 20  # km/h
            elif traffic_factor > 1.1:
                avg_speed = 30  # km/h
            else:
                avg_speed = 45  # km/h
            
            eta_minutes = (distance / avg_speed) * 60
            print(f"✅ Using fallback calculation: {eta_minutes:.1f} min")
        
        # Cap maximum ETA at 3 hours for safety
        eta_minutes = min(eta_minutes, 180)
        
        return {
            'eta_minutes': round(eta_minutes, 1),
            'distance_km': round(distance, 2),
            'estimated_arrival': (now + timedelta(minutes=eta_minutes)).isoformat(),
            'traffic_condition': 'Heavy' if traffic_factor > 1.3 else 'Moderate' if traffic_factor > 1.1 else 'Light'
        }

#  SMART VEHICLE RECOMMENDATION AI

class VehicleRecommenderAI:
    def __init__(self):
        self.vehicle_cache = []
        # Indian state codes mapping
        self.state_mapping = {
            'MH': 'Maharashtra', 'KA': 'Karnataka', 'DL': 'Delhi',
            'TN': 'Tamil Nadu', 'UP': 'Uttar Pradesh', 'GJ': 'Gujarat',
            'RJ': 'Rajasthan', 'WB': 'West Bengal', 'MP': 'Madhya Pradesh',
            'AP': 'Andhra Pradesh', 'TG': 'Telangana', 'KL': 'Kerala',
            'HR': 'Haryana', 'PB': 'Punjab', 'BR': 'Bihar', 'OR': 'Odisha'
        }
    
    def fetch_vehicles(self):
        """Fetch available vehicles from backend"""
        vehicles = fetch_backend_data('customer/vehicles/search')
        
        if vehicles:
            self.vehicle_cache = [v for v in vehicles if v.get('status') == 'AVAILABLE']
            print(f"✅ Loaded {len(self.vehicle_cache)} available vehicles")
        else:
            print("⚠️ No vehicles fetched from backend")
            self.vehicle_cache = []
        
        return self.vehicle_cache
    
    def get_state_from_coordinates(self, lat, lon):
        """Determine state from GPS coordinates (simplified)"""
        # Maharashtra (Mumbai, Pune)
        if 15.6 <= lat <= 22.0 and 72.6 <= lon <= 80.9:
            return 'MH'
        # Karnataka (Bangalore)
        elif 11.5 <= lat <= 18.5 and 74.0 <= lon <= 78.5:
            return 'KA'
        # Delhi NCR
        elif 28.4 <= lat <= 28.9 and 76.8 <= lon <= 77.3:
            return 'DL'
        # Tamil Nadu (Chennai)
        elif 8.0 <= lat <= 13.5 and 76.2 <= lon <= 80.3:
            return 'TN'
        # Gujarat (Ahmedabad)
        elif 20.0 <= lat <= 24.7 and 68.1 <= lon <= 74.5:
            return 'GJ'
        # Rajasthan (Jaipur)
        elif 24.0 <= lat <= 30.2 and 69.5 <= lon <= 78.3:
            return 'RJ'
        # West Bengal (Kolkata)
        elif 21.5 <= lat <= 27.2 and 85.8 <= lon <= 89.9:
            return 'WB'
        else:
            return 'UNKNOWN'
    
    def calculate_score(self, vehicle, pickup_lat, pickup_lon, pickup_state, 
                       passengers, prefer_electric=False):
        """Calculate recommendation score with STATE PRIORITY"""
        
        #  STATE MATCH BONUS (HIGHEST PRIORITY)
        vehicle_state = vehicle.get('state', 'UNKNOWN')
        state_match_bonus = 0
        
        if vehicle_state == pickup_state:
            state_match_bonus = 100  #  MASSIVE bonus for same state
        else:
            state_match_bonus = -50  #  Heavy penalty for different state
        
        # Distance score
        distance = haversine_distance(
            pickup_lat, pickup_lon,
            vehicle.get('latitude', 0),
            vehicle.get('longitude', 0)
        )
        distance_score = max(0, 100 - distance * 5)
        
        # Capacity score
        capacity = vehicle.get('capacity', 4)
        capacity_score = 100 if capacity >= passengers else 50
        
        # Health score
        health_score = vehicle.get('healthScore', 80)
        
        # Energy score
        if vehicle.get('isElectric'):
            battery = vehicle.get('batteryLevel', 0)
            energy_score = battery
            electric_bonus = 20 if prefer_electric else 0
        else:
            fuel = vehicle.get('fuelLevel', 0)
            energy_score = fuel
            electric_bonus = -10 if prefer_electric else 0
        
        # Vehicle type bonus
        vehicle_type = vehicle.get('type', 'SEDAN')
        type_score = {'SEDAN': 10, 'SUV': 15, 'VAN': 5, 'LUXURY': 20}.get(vehicle_type, 0)
        
        #  NEW WEIGHTED SCORING (State is TOP priority)
        total_score = (
            state_match_bonus * 0.40 +      # 40% STATE MATCH
            distance_score * 0.25 +          # 25% distance
            capacity_score * 0.15 +          # 15% capacity
            health_score * 0.12 +            # 12% health
            energy_score * 0.05 +            # 5% energy
            type_score * 0.03 +              # 3% type
            electric_bonus
        )
        
        return {
            'score': round(total_score, 2),
            'distance_km': round(distance, 2),
            'state_match': vehicle_state == pickup_state,
            'vehicle_state': vehicle_state,
            'breakdown': {
                'state_match_bonus': state_match_bonus,
                'distance_score': round(distance_score, 1),
                'capacity_score': capacity_score,
                'health_score': health_score,
                'energy_score': round(energy_score, 1)
            }
        }
    
    def recommend(self, pickup_lat, pickup_lon, passengers=1, 
                  prefer_electric=False, top_n=5, pickup_state=None):
        """Get top N recommended vehicles with STATE PRIORITY"""
        
        # Auto-detect state if not provided
        if not pickup_state:
            pickup_state = self.get_state_from_coordinates(pickup_lat, pickup_lon)
            print(f"🗺️ Auto-detected pickup state: {pickup_state}")
        
        vehicles = self.fetch_vehicles()
        
        if not vehicles:
            print("⚠️ No vehicles available for recommendation")
            return []
        
        recommendations = []
        same_state_count = 0
        
        for vehicle in vehicles:
            score_data = self.calculate_score(
                vehicle, pickup_lat, pickup_lon, pickup_state,
                passengers, prefer_electric
            )
            
            if score_data['state_match']:
                same_state_count += 1
            
            recommendations.append({
                'vehicle': vehicle,
                'recommendation_score': score_data['score'],
                'distance_km': score_data['distance_km'],
                'state_match': score_data['state_match'],
                'vehicle_state': score_data['vehicle_state'],
                'score_breakdown': score_data['breakdown'],
                'reason': self._generate_reason(vehicle, score_data, pickup_state)
            })
        
        # Sort by score (state-matching vehicles rank higher automatically)
        recommendations.sort(key=lambda x: x['recommendation_score'], reverse=True)
        
        print(f"✅ Found {same_state_count} vehicles in {pickup_state}")
        print(f"✅ Returning top {top_n} recommendations")
        
        return recommendations[:top_n]
    
    def _generate_reason(self, vehicle, score_data, pickup_state):
        """Generate human-readable recommendation reason"""
        reasons = []
        
        # STATE MATCH is PRIMARY reason
        if score_data['state_match']:
            state_name = self.state_mapping.get(pickup_state, pickup_state)
            reasons.append(f"✅ Available in {state_name}")
        else:
            reasons.append(f"⚠️ From {score_data['vehicle_state']} (outside your state)")
        
        if score_data['distance_km'] < 2:
            reasons.append("Very close to pickup")
        elif score_data['distance_km'] < 5:
            reasons.append("Nearby")
        
        if vehicle.get('healthScore', 0) > 90:
            reasons.append("Excellent condition")
        
        if vehicle.get('isElectric'):
            reasons.append("Eco-friendly EV")
        
        return ", ".join(reasons)
#  PREDICTIVE MAINTENANCE AI


class PredictiveMaintenanceAI:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_training_data(self):
        """Prepare training data from vehicles"""
        print("📊 Fetching vehicle data for maintenance prediction...")
        
        #  Fetch from correct endpoint
        vehicles = fetch_backend_data('admin/vehicles')
        
        if not vehicles or len(vehicles) < 5:
            print("⚠️ Not enough vehicle data, using synthetic data...")
            return self._generate_synthetic_maintenance_data()
        
        features = []
        labels = []
        
        for vehicle in vehicles:
            mileage = vehicle.get('mileage', 0) / 1000
            health_score = vehicle.get('healthScore', 100)
            is_electric = vehicle.get('isElectric', False)
            battery_level = vehicle.get('batteryLevel', 100) if is_electric else 100
            fuel_level = vehicle.get('fuelLevel', 100) if not is_electric else 100
            
            vehicle_age_days = 365
            if vehicle.get('createdAt'):
                try:
                    created = datetime.fromisoformat(vehicle['createdAt'].replace('Z', '+00:00'))
                    vehicle_age_days = (datetime.now(created.tzinfo) - created).days
                except:
                    pass
            
            features.append([
                mileage,
                health_score,
                battery_level if is_electric else fuel_level,
                vehicle_age_days / 365,
                1 if is_electric else 0
            ])
            
            # Determine maintenance priority based on vehicle condition
            if health_score < 70 or mileage > 100:
                label = 2  # HIGH
            elif health_score < 85 or mileage > 50:
                label = 1  # MEDIUM
            else:
                label = 0  # LOW
            
            labels.append(label)
        
        print(f"✅ Prepared {len(features)} vehicle samples for training")
        return np.array(features), np.array(labels)
    
    def _generate_synthetic_maintenance_data(self, n_samples=200):
        """Generate synthetic maintenance data"""
        features = []
        labels = []
        
        for _ in range(n_samples):
            mileage = np.random.uniform(10, 200)
            health_score = np.random.uniform(60, 100)
            energy_level = np.random.uniform(40, 100)
            age_years = np.random.uniform(0.5, 5)
            is_electric = np.random.choice([0, 1])
            
            risk_score = (
                (mileage / 200) * 40 +
                ((100 - health_score) / 100) * 40 +
                (age_years / 5) * 20
            )
            
            if risk_score > 60:
                label = 2  # HIGH
            elif risk_score > 30:
                label = 1  # MEDIUM
            else:
                label = 0  # LOW
            
            features.append([mileage, health_score, energy_level, age_years, is_electric])
            labels.append(label)
        
        return np.array(features), np.array(labels)
    
    def train(self):
        """Train the predictive maintenance model"""
        print("🤖 Training Predictive Maintenance AI...")
        
        X, y = self.prepare_training_data()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = GradientBoostingClassifier(
            n_estimators=100,
            max_depth=5,
            random_state=42
        )
        
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)
        
        score = self.model.score(X_test, y_test)
        print(f"✅ Maintenance Model trained! Accuracy: {score:.3f}")
        
        joblib.dump(self.model, f'{MODEL_DIR}/maintenance_model.pkl')
        joblib.dump(self.scaler, f'{MODEL_DIR}/maintenance_scaler.pkl')
        
        self.is_trained = True
        return score
    
    def predict(self, vehicle_data):
        """Predict maintenance priority for a vehicle"""
        if not self.is_trained:
            print("⚠️ Model not trained, training now...")
            self.train()
        
        mileage = vehicle_data.get('mileage', 0) / 1000
        health_score = vehicle_data.get('healthScore', 100)
        is_electric = vehicle_data.get('isElectric', False)
        battery_level = vehicle_data.get('batteryLevel', 100) if is_electric else 100
        fuel_level = vehicle_data.get('fuelLevel', 100) if not is_electric else 100
        
        vehicle_age_days = 365
        if vehicle_data.get('createdAt'):
            try:
                created = datetime.fromisoformat(vehicle_data['createdAt'].replace('Z', '+00:00'))
                vehicle_age_days = (datetime.now(created.tzinfo) - created).days
            except:
                pass
        
        features = np.array([[
            mileage,
            health_score,
            battery_level if is_electric else fuel_level,
            vehicle_age_days / 365,
            1 if is_electric else 0
        ]])
        
        features_scaled = self.scaler.transform(features)
        
        priority_code = self.model.predict(features_scaled)[0]
        probabilities = self.model.predict_proba(features_scaled)[0]
        
        priority_map = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}
        priority = priority_map[priority_code]
        
        # Generate recommendations
        recommendations = []
        if health_score < 75:
            recommendations.append("Schedule comprehensive health check")
        if mileage > 100:
            recommendations.append("Engine oil change recommended")
        if vehicle_age_days > 730:
            recommendations.append("Full vehicle inspection due to age")
        if (battery_level if is_electric else fuel_level) < 50:
            recommendations.append("Refuel/recharge before long trips")
        
        return {
            'priority': priority,
            'risk_score': round(probabilities[priority_code] * 100, 1),
            'confidence': {
                'LOW': round(probabilities[0] * 100, 1),
                'MEDIUM': round(probabilities[1] * 100, 1),
                'HIGH': round(probabilities[2] * 100, 1)
            },
            'recommendations': recommendations if recommendations else ["Vehicle in good condition"],
            'next_maintenance_days': self._calculate_next_maintenance(priority_code, mileage)
        }
    
    def _calculate_next_maintenance(self, priority_code, mileage):
        """Calculate days until next maintenance"""
        if priority_code == 2:
            return 7
        elif priority_code == 1:
            return 30
        else:
            return 90

# INITIALIZE AI MODELS



eta_predictor = ETAPredictorAI()
vehicle_recommender = VehicleRecommenderAI()
maintenance_predictor = PredictiveMaintenanceAI()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'backend_url': SPRING_BOOT_URL,
        'models': {
            'eta_predictor': eta_predictor.is_trained,
            'maintenance_predictor': maintenance_predictor.is_trained
        }
    })

@app.route('/train', methods=['POST'])
def train_models():
    """Train all AI models"""
    results = {}
    
    try:
        eta_score = eta_predictor.train()
        results['eta_model'] = {'status': 'success', 'score': eta_score}
    except Exception as e:
        results['eta_model'] = {'status': 'error', 'message': str(e)}
    
    try:
        maintenance_score = maintenance_predictor.train()
        results['maintenance_model'] = {'status': 'success', 'score': maintenance_score}
    except Exception as e:
        results['maintenance_model'] = {'status': 'error', 'message': str(e)}
    
    return jsonify(results)

@app.route('/predict/eta', methods=['POST'])
def predict_eta():
    """Predict ETA for a trip"""
    data = request.json
    
    result = eta_predictor.predict(
        pickup_lat=data['pickupLat'],
        pickup_lon=data['pickupLon'],
        dropoff_lat=data['dropoffLat'],
        dropoff_lon=data['dropoffLon'],
        vehicle_health=data.get('vehicleHealth', 0.85),
        is_electric=data.get('isElectric', False)
    )
    
    return jsonify(result)



@app.route('/recommend/vehicles', methods=['POST'])
def recommend_vehicles():
    """Get vehicle recommendations with STATE PRIORITY"""
    data = request.json
    
    
    pickup_state = data.get('pickupState')  # "MH", "KA"
    
    recommendations = vehicle_recommender.recommend(
        pickup_lat=data['pickupLat'],
        pickup_lon=data['pickupLon'],
        passengers=data.get('passengers', 1),
        prefer_electric=data.get('preferElectric', False),
        top_n=data.get('topN', 5),
        pickup_state=pickup_state  
    )
    
    return jsonify(recommendations)


@app.route('/predict/maintenance/<int:vehicle_id>', methods=['GET'])
def predict_maintenance(vehicle_id):
    """Predict maintenance priority for a vehicle"""
    vehicles = fetch_backend_data('admin/vehicles')
    
    if not vehicles:
        return jsonify({'error': 'Cannot fetch vehicle data'}), 500
    
    vehicle = next((v for v in vehicles if v.get('id') == vehicle_id), None)
    
    if not vehicle:
        return jsonify({'error': 'Vehicle not found'}), 404
    
    result = maintenance_predictor.predict(vehicle)
    return jsonify(result)

@app.route('/predict/maintenance/all', methods=['GET'])
def predict_all_maintenance():
    """Predict maintenance for all vehicles"""
    vehicles = fetch_backend_data('admin/vehicles')
    
    if not vehicles:
        return jsonify({'error': 'Cannot fetch vehicle data'}), 500
    
    results = []
    for vehicle in vehicles:
        try:
            prediction = maintenance_predictor.predict(vehicle)
            results.append({
                'vehicle_id': vehicle.get('id'),
                'vehicle_number': vehicle.get('vehicleNumber'),
                'prediction': prediction
            })
        except Exception as e:
            print(f"⚠️ Error predicting for vehicle {vehicle.get('id')}: {e}")
    
    print(f"✅ Returning {len(results)} maintenance predictions")
    return jsonify(results)

if __name__ == '__main__':
    print("🚀 Starting NeuroFleetX AI Microservice...")
    print("📡 Backend URL:", SPRING_BOOT_URL)
    print("\n🤖 Training AI models on startup...")
    
    try:
        eta_predictor.train()
        maintenance_predictor.train()
        print("\n✅ All models trained successfully!")
    except Exception as e:
        print(f"\n⚠️ Warning: Could not train models on startup: {e}")
        print("Models will be trained on first request")
    
    app.run(host='0.0.0.0', port=5000, debug=True)