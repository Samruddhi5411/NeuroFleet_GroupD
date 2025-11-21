import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

class MaintenancePredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.is_trained = False
    
    def train(self, vehicles_df):
        """Train the maintenance prediction model"""
        if vehicles_df.empty:
            print("⚠️ No vehicle data to train on")
            return
        
        # Create training features
        X = vehicles_df[['health_score', 'mileage', 'fuel_level', 'battery_level']].fillna(0)
        
        # Create labels based on health score
        y = vehicles_df['health_score'].apply(lambda x: 
            'CRITICAL' if x < 60 else 
            'HIGH' if x < 75 else 
            'MEDIUM' if x < 85 else 'LOW'
        )
        
        self.model.fit(X, y)
        self.is_trained = True
        print(f"✅ Model trained on {len(vehicles_df)} vehicles")
    
    def predict(self, vehicle_data):
        """
        Predict maintenance needs for a single vehicle
        Returns detailed health analysis
        """
        health_score = vehicle_data.get('healthScore', 100)
        mileage = vehicle_data.get('mileage', 0)
        fuel_level = vehicle_data.get('fuelLevel', 100)
        battery_level = vehicle_data.get('batteryLevel', 100)
        
        # Calculate risk score (0-100)
        risk_score = 100 - health_score
        
        # Determine risk level
        if risk_score >= 40:
            risk_level = 'CRITICAL'
            priority = 'URGENT'
        elif risk_score >= 25:
            risk_level = 'HIGH'
            priority = 'HIGH'
        elif risk_score >= 15:
            risk_level = 'MEDIUM'
            priority = 'MEDIUM'
        else:
            risk_level = 'LOW'
            priority = 'LOW'
        
        # Predict days to failure
        days_to_failure = self._calculate_days_to_failure(health_score, mileage)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            health_score, mileage, fuel_level, battery_level, risk_level
        )
        
        # Component health breakdown
        component_health = self._analyze_components(vehicle_data)
        
        # Generate alerts
        alerts = self._generate_alerts(health_score, mileage, fuel_level, battery_level)
        
        return {
            'vehicleId': vehicle_data.get('id'),
            'vehicleNumber': vehicle_data.get('vehicleNumber'),
            'healthScore': health_score,
            'riskScore': risk_score,
            'riskLevel': risk_level,
            'priority': priority,
            'predictedDaysToFailure': days_to_failure,
            'recommendedActions': recommendations,
            'componentHealth': component_health,
            'alerts': alerts,
            'nextMaintenanceDate': self._calculate_next_maintenance(mileage),
            'estimatedCost': self._estimate_cost(risk_level),
            'isPredictive': True
        }
    
    def _calculate_days_to_failure(self, health_score, mileage):
        """Calculate estimated days until potential failure"""
        if health_score >= 90:
            return 90
        elif health_score >= 80:
            return 60
        elif health_score >= 70:
            return 30
        elif health_score >= 60:
            return 15
        else:
            return 7
    
    def _generate_recommendations(self, health, mileage, fuel, battery, risk):
        """Generate maintenance recommendations"""
        recommendations = []
        
        if health < 70:
            recommendations.append("Immediate inspection required")
        elif health < 85:
            recommendations.append("Schedule service within 7 days")
        
        if mileage > 80000:
            recommendations.append("Engine oil change due")
        
        if mileage > 50000 and mileage % 10000 < 1000:
            recommendations.append("Major service recommended")
        
        if fuel < 20 and fuel > 0:
            recommendations.append("Refuel required")
        
        if battery < 30 and battery > 0:
            recommendations.append("Battery charging needed")
        
        if risk == 'CRITICAL':
            recommendations.append("⚠️ URGENT: Take vehicle off-road immediately")
        
        return recommendations if recommendations else ["No immediate action required"]
    
    def _analyze_components(self, vehicle_data):
        """Analyze individual component health"""
        health_score = vehicle_data.get('healthScore', 100)
        mileage = vehicle_data.get('mileage', 0)
        
        # Simulate component degradation
        engine_health = max(50, health_score - (mileage / 10000) * 2)
        brake_health = max(60, health_score - (mileage / 8000) * 3)
        tire_health = max(55, health_score - (mileage / 5000) * 4)
        battery_health = vehicle_data.get('batteryLevel', 100)
        transmission_health = max(65, health_score - (mileage / 12000) * 2)
        
        return {
            'engine': {'health': round(engine_health, 1), 'status': self._get_status(engine_health)},
            'brakes': {'health': round(brake_health, 1), 'status': self._get_status(brake_health)},
            'tires': {'health': round(tire_health, 1), 'status': self._get_status(tire_health)},
            'battery': {'health': round(battery_health, 1), 'status': self._get_status(battery_health)},
            'transmission': {'health': round(transmission_health, 1), 'status': self._get_status(transmission_health)}
        }
    
    def _get_status(self, health):
        """Get status label for health score"""
        if health >= 90:
            return 'EXCELLENT'
        elif health >= 75:
            return 'GOOD'
        elif health >= 60:
            return 'FAIR'
        else:
            return 'POOR'
    
    def _generate_alerts(self, health, mileage, fuel, battery):
        """Generate real-time alerts"""
        alerts = []
        
        if health < 60:
            alerts.append({
                'type': 'CRITICAL',
                'message': 'Vehicle health critical - Immediate attention required',
                'severity': 'HIGH',
                'icon': '🚨'
            })
        elif health < 75:
            alerts.append({
                'type': 'WARNING',
                'message': 'Vehicle health degrading - Schedule maintenance',
                'severity': 'MEDIUM',
                'icon': '⚠️'
            })
        
        if mileage > 100000:
            alerts.append({
                'type': 'MAINTENANCE',
                'message': 'High mileage detected - Full inspection recommended',
                'severity': 'MEDIUM',
                'icon': '🔧'
            })
        
        if fuel < 15 and fuel > 0:
            alerts.append({
                'type': 'FUEL',
                'message': 'Low fuel level - Refuel soon',
                'severity': 'LOW',
                'icon': '⛽'
            })
        
        if battery < 20 and battery > 0:
            alerts.append({
                'type': 'BATTERY',
                'message': 'Low battery - Charging required',
                'severity': 'MEDIUM',
                'icon': '🔋'
            })
        
        return alerts
    
    def _calculate_next_maintenance(self, mileage):
        """Calculate next scheduled maintenance"""
        next_service_km = ((mileage // 10000) + 1) * 10000
        return f"{next_service_km} km"
    
    def _estimate_cost(self, risk_level):
        """Estimate maintenance cost"""
        cost_map = {
            'LOW': (500, 1000),
            'MEDIUM': (1000, 3000),
            'HIGH': (3000, 7000),
            'CRITICAL': (7000, 15000)
        }
        
        min_cost, max_cost = cost_map.get(risk_level, (500, 1000))
        return {
            'min': min_cost,
            'max': max_cost,
            'currency': 'INR'
        }
    
    def analyze_fleet_health(self, vehicles):
        """Analyze overall fleet health"""
        predictions = []
        
        for vehicle in vehicles:
            prediction = self.predict(vehicle)
            predictions.append(prediction)
        
        # Calculate fleet statistics
        total_vehicles = len(predictions)
        critical_count = len([p for p in predictions if p['riskLevel'] == 'CRITICAL'])
        high_risk_count = len([p for p in predictions if p['riskLevel'] == 'HIGH'])
        medium_risk_count = len([p for p in predictions if p['riskLevel'] == 'MEDIUM'])
        low_risk_count = len([p for p in predictions if p['riskLevel'] == 'LOW'])
        
        avg_health = sum([p['healthScore'] for p in predictions]) / total_vehicles if total_vehicles > 0 else 0
        
        return {
            'totalVehicles': total_vehicles,
            'averageHealth': round(avg_health, 1),
            'criticalCount': critical_count,
            'highRiskCount': high_risk_count,
            'mediumRiskCount': medium_risk_count,
            'lowRiskCount': low_risk_count,
            'healthyCount': low_risk_count,
            'vehiclesPredictions': predictions,
            'fleetStatus': 'CRITICAL' if critical_count > 0 else 'HEALTHY'
        }