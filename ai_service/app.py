# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import traceback
# from config import Config
# from utils.database import Database
# from models.maintenance_model import MaintenancePredictor
# from models.route_optimizer import RouteOptimizer
# from models.recommendation import SmartRecommendation

# app = Flask(__name__)
# CORS(app)

# # Initialize models
# db = Database()
# maintenance_predictor = MaintenancePredictor()
# route_optimizer = RouteOptimizer()
# recommender = SmartRecommendation()

# # Train maintenance model on startup
# try:
#     vehicles_df = db.fetch_vehicles()
#     maintenance_predictor.train(vehicles_df)
#     print("✅ Maintenance model trained successfully")
# except Exception as e:
#     print(f"⚠️ Could not train maintenance model: {e}")

# # ========== HEALTH CHECK ==========
# @app.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({
#         'status': 'healthy',
#         'service': 'NeuroFleetX AI Service',
#         'version': '1.0.0'
#     })

# # ========== PREDICTIVE MAINTENANCE ==========
# @app.route('/api/ai/maintenance/predict', methods=['POST'])
# def predict_maintenance():
#     try:
#         vehicle_data = request.json
#         prediction = maintenance_predictor.predict(vehicle_data)
        
#         print(f"🔧 Maintenance prediction for vehicle {vehicle_data.get('vehicleNumber')}: {prediction['riskLevel']}")
        
#         return jsonify(prediction)
#     except Exception as e:
#         print(f"❌ Error in maintenance prediction: {str(e)}")
#         traceback.print_exc()
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/ai/maintenance/analyze-fleet', methods=['GET'])
# def analyze_fleet():
#     try:
#         vehicles_df = db.fetch_vehicles()
        
#         high_risk_vehicles = []
        
#         for _, vehicle in vehicles_df.iterrows():
#             vehicle_dict = vehicle.to_dict()
#             prediction = maintenance_predictor.predict(vehicle_dict)
            
#             if prediction['riskLevel'] in ['HIGH', 'MEDIUM']:
#                 high_risk_vehicles.append({
#                     'vehicleId': int(vehicle['id']),
#                     'vehicleNumber': vehicle['vehicle_number'],
#                     'model': vehicle['model'],
#                     'riskLevel': prediction['riskLevel'],
#                     'riskScore': prediction['riskScore'],
#                     'recommendations': prediction['recommendedActions']
#                 })
        
#         return jsonify({
#             'totalVehicles': len(vehicles_df),
#             'highRiskCount': len([v for v in high_risk_vehicles if v['riskLevel'] == 'HIGH']),
#             'mediumRiskCount': len([v for v in high_risk_vehicles if v['riskLevel'] == 'MEDIUM']),
#             'highRiskVehicles': high_risk_vehicles
#         })
#     except Exception as e:
#         print(f"❌ Error analyzing fleet: {str(e)}")
#         traceback.print_exc()
#         return jsonify({'error': str(e)}), 500

# # ========== ROUTE OPTIMIZATION ==========
# @app.route('/api/ai/route/optimize', methods=['POST'])
# def optimize_route():
#     try:
#         data = request.json
        
#         start_lat = data.get('startLatitude')
#         start_lon = data.get('startLongitude')
#         end_lat = data.get('endLatitude')
#         end_lon = data.get('endLongitude')
#         vehicle_type = data.get('vehicleType', 'SEDAN')
        
#         route = route_optimizer.optimize_route(
#             start_lat, start_lon, end_lat, end_lon, vehicle_type
#         )
        
#         print(f"🗺️ Route optimized: {route['distanceKm']} km, ETA: {route['etaMinutes']} min")
        
#         return jsonify(route)
#     except Exception as e:
#         print(f"❌ Error in route optimization: {str(e)}")
#         traceback.print_exc()
#         return jsonify({'error': str(e)}), 500

# # ========== SMART RECOMMENDATIONS ==========
# @app.route('/api/ai/recommend/vehicles', methods=['POST'])
# def recommend_vehicles():
#     try:
#         data = request.json
#         customer_id = data.get('customerId')
        
#         # Fetch available vehicles
#         vehicles_df = db.fetch_vehicles()
#         available = vehicles_df[vehicles_df['status'] == 'AVAILABLE']
        
#         # Fetch customer history
#         history = db.fetch_customer_preferences(customer_id)
        
#         # Get recommendations
#         recommendations = recommender.recommend_vehicles(
#             customer_id, available, history
#         )
        
#         print(f"🚗 Generated {len(recommendations)} recommendations for customer {customer_id}")
        
#         return jsonify({
#             'totalVehicles': len(recommendations),
#             'recommendedCount': len([r for r in recommendations if r['isRecommended']]),
#             'recommendations': recommendations[:10]  # Top 10
#         })
#     except Exception as e:
#         print(f"❌ Error in recommendations: {str(e)}")
#         traceback.print_exc()
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     print("🚀 Starting NeuroFleetX AI Service...")
#     print(f"📊 Database: {Config.DB_NAME}")
#     print(f"🌐 Backend API: {Config.BACKEND_URL}")
#     app.run(host='0.0.0.0', port=5001, debug=True)