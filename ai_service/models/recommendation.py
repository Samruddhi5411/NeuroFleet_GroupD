# import numpy as np
# import pandas as pd
# from collections import Counter

# class SmartRecommendation:
#     def __init__(self):
#         pass
    
#     def recommend_vehicles(self, customer_id, available_vehicles, customer_history):
#         """Recommend vehicles based on customer preferences and history"""
        
#         if customer_history.empty:
#             # New customer - recommend based on popularity
#             return self._recommend_for_new_customer(available_vehicles)
        
#         # Analyze customer preferences
#         preferences = self._analyze_preferences(customer_history)
        
#         # Score each vehicle
#         recommendations = []
#         for _, vehicle in available_vehicles.iterrows():
#             score = self._calculate_recommendation_score(vehicle, preferences)
            
#             recommendations.append({
#                 'vehicle': vehicle.to_dict(),
#                 'recommendationScore': score,
#                 'reason': self._generate_reason(vehicle, preferences),
#                 'isRecommended': score > 70,
#                 'pricePerHour': 10.0  # Base rate
#             })
        
#         # Sort by score
#         recommendations.sort(key=lambda x: x['recommendationScore'], reverse=True)
        
#         return recommendations
    
#     def _analyze_preferences(self, history):
#         """Analyze customer booking history"""
#         preferences = {
#             'preferredType': history['type'].mode()[0] if not history['type'].empty else 'SEDAN',
#             'preferElectric': history['is_electric'].mean() > 0.5,
#             'avgPrice': history['total_price'].mean(),
#             'totalBookings': len(history)
#         }
#         return preferences
    
#     def _calculate_recommendation_score(self, vehicle, preferences):
#         """Calculate recommendation score (0-100)"""
#         score = 50  # Base score
        
#         # Type match
#         if vehicle['type'] == preferences['preferredType']:
#             score += 25
        
#         # Electric preference
#         if vehicle['is_electric'] == preferences['preferElectric']:
#             score += 15
        
#         # Health score
#         score += (vehicle['health_score'] / 100) * 10
        
#         return min(100, max(0, int(score)))
    
#     def _generate_reason(self, vehicle, preferences):
#         """Generate human-readable recommendation reason"""
#         reasons = []
        
#         if vehicle['type'] == preferences['preferredType']:
#             reasons.append(f"Matches your preferred vehicle type ({vehicle['type']})")
        
#         if vehicle['is_electric'] and preferences['preferElectric']:
#             reasons.append("Electric vehicle - eco-friendly choice")
        
#         if vehicle['health_score'] > 90:
#             reasons.append("Excellent vehicle condition")
        
#         if not reasons:
#             reasons.append("Available and ready for booking")
        
#         return ". ".join(reasons)
    
#     def _recommend_for_new_customer(self, vehicles):
#         """Recommend for customers with no history"""
#         recommendations = []
        
#         for _, vehicle in vehicles.iterrows():
#             score = 60  # Base score for new customers
            
#             if vehicle['health_score'] > 90:
#                 score += 20
            
#             if vehicle['type'] == 'SEDAN':
#                 score += 10  # Most popular
            
#             recommendations.append({
#                 'vehicle': vehicle.to_dict(),
#                 'recommendationScore': score,
#                 'reason': "Popular choice for new customers",
#                 'isRecommended': score > 70,
#                 'pricePerHour': 10.0
#             })
        
#         recommendations.sort(key=lambda x: x['recommendationScore'], reverse=True)
#         return recommendations



import numpy as np
import pandas as pd
from collections import Counter

class SmartRecommendation:
    def __init__(self):
        pass
    
    def recommend_vehicles(self, customer_id, available_vehicles, customer_history, search_filters=None):
        """
        Recommend vehicles based on customer preferences and search filters
        
        Args:
            customer_id: Customer ID
            available_vehicles: DataFrame of available vehicles
            customer_history: DataFrame of customer booking history
            search_filters: Dict with vehicleType, isElectric, minCapacity, etc.
        """
        
        # Apply search filters first
        if search_filters:
            available_vehicles = self._apply_filters(available_vehicles, search_filters)
        
        if available_vehicles.empty:
            return []
        
        if customer_history.empty:
            # New customer - recommend based on popularity and filters
            return self._recommend_for_new_customer(available_vehicles, search_filters)
        
        # Analyze customer preferences
        preferences = self._analyze_preferences(customer_history)
        
        # Score each vehicle
        recommendations = []
        for _, vehicle in available_vehicles.iterrows():
            score = self._calculate_recommendation_score(vehicle, preferences, search_filters)
            
            recommendations.append({
                'vehicle': vehicle.to_dict(),
                'recommendationScore': score,
                'matchReasons': self._generate_reasons(vehicle, preferences, search_filters),
                'isRecommended': score > 70,
                'pricePerHour': 10.0  # Base rate
            })
        
        # Sort by score
        recommendations.sort(key=lambda x: x['recommendationScore'], reverse=True)
        
        return recommendations
    
    def _apply_filters(self, vehicles, filters):
        """Apply search filters to vehicles"""
        filtered = vehicles.copy()
        
        if filters.get('vehicleType') and filters['vehicleType'] != 'ALL':
            filtered = filtered[filtered['type'] == filters['vehicleType']]
        
        if filters.get('isElectric') is not None:
            filtered = filtered[filtered['is_electric'] == filters['isElectric']]
        
        if filters.get('minCapacity'):
            filtered = filtered[filtered['capacity'] >= filters['minCapacity']]
        
        if filters.get('maxCapacity'):
            filtered = filtered[filtered['capacity'] <= filters['maxCapacity']]
        
        return filtered
    
    def _analyze_preferences(self, history):
        """Analyze customer booking history"""
        preferences = {
            'preferredType': history['type'].mode()[0] if len(history['type']) > 0 else 'SEDAN',
            'preferElectric': history['is_electric'].mean() > 0.5 if 'is_electric' in history.columns else False,
            'avgCapacity': history['capacity'].mean() if 'capacity' in history.columns else 4,
            'avgPrice': history['total_price'].mean() if 'total_price' in history.columns else 500,
            'totalBookings': len(history),
            'frequentManufacturers': history['manufacturer'].mode()[0] if 'manufacturer' in history.columns else None
        }
        return preferences
    
    def _calculate_recommendation_score(self, vehicle, preferences, filters):
        """Calculate recommendation score (0-100)"""
        score = 50  # Base score
        
        # Type match (25 points)
        if vehicle['type'] == preferences['preferredType']:
            score += 25
        elif filters and filters.get('vehicleType') == vehicle['type']:
            score += 15  # User specifically searched for this type
        
        # Electric preference (15 points)
        if vehicle['is_electric'] == preferences['preferElectric']:
            score += 15
        elif filters and filters.get('isElectric') == vehicle['is_electric']:
            score += 10
        
        # Capacity match (10 points)
        capacity_diff = abs(vehicle['capacity'] - preferences['avgCapacity'])
        if capacity_diff <= 2:
            score += 10
        elif capacity_diff <= 4:
            score += 5
        
        # Health score bonus (10 points)
        if vehicle['health_score'] >= 90:
            score += 10
        elif vehicle['health_score'] >= 80:
            score += 5
        
        # Manufacturer preference (5 points)
        if preferences.get('frequentManufacturers') and \
           vehicle['manufacturer'] == preferences['frequentManufacturers']:
            score += 5
        
        # Status bonus
        if vehicle['status'] == 'AVAILABLE':
            score += 5
        
        return min(100, max(0, int(score)))
    
    def _generate_reasons(self, vehicle, preferences, filters):
        """Generate human-readable recommendation reasons"""
        reasons = []
        
        # Search filter matches
        if filters:
            if filters.get('vehicleType') == vehicle['type']:
                reasons.append(f"Matches your search for {vehicle['type']}")
            
            if filters.get('isElectric') == vehicle['is_electric']:
                reasons.append("Electric vehicle" if vehicle['is_electric'] else "Fuel vehicle")
            
            if filters.get('minCapacity') and vehicle['capacity'] >= filters['minCapacity']:
                reasons.append(f"{vehicle['capacity']} seater - meets your capacity need")
        
        # History-based matches
        if vehicle['type'] == preferences['preferredType']:
            reasons.append(f"You frequently book {vehicle['type']} vehicles")
        
        if vehicle['is_electric'] and preferences['preferElectric']:
            reasons.append("Eco-friendly choice based on your history")
        
        # Vehicle quality
        if vehicle['health_score'] > 90:
            reasons.append("Excellent vehicle condition (Health: 90+)")
        elif vehicle['health_score'] > 80:
            reasons.append("Good vehicle condition")
        
        if not reasons:
            reasons.append("Available and ready for booking")
        
        return reasons
    
    def _recommend_for_new_customer(self, vehicles, filters):
        """Recommend for customers with no history"""
        recommendations = []
        
        for _, vehicle in vehicles.iterrows():
            score = 60  # Base score for new customers
            
            # Boost popular vehicle types
            if vehicle['type'] == 'SEDAN':
                score += 15  # Most popular
            elif vehicle['type'] == 'SUV':
                score += 10
            
            # Health score bonus
            if vehicle['health_score'] > 90:
                score += 15
            elif vehicle['health_score'] > 80:
                score += 10
            
            # Filter-based boost
            if filters:
                if filters.get('vehicleType') == vehicle['type']:
                    score += 10
                if filters.get('isElectric') == vehicle['is_electric']:
                    score += 5
            
            reasons = ["Popular choice for new customers"]
            if filters and filters.get('vehicleType') == vehicle['type']:
                reasons.append(f"Matches your search for {vehicle['type']}")
            if vehicle['health_score'] > 90:
                reasons.append("Excellent vehicle condition")
            
            recommendations.append({
                'vehicle': vehicle.to_dict(),
                'recommendationScore': score,
                'matchReasons': reasons,
                'isRecommended': score > 70,
                'pricePerHour': 10.0
            })
        
        recommendations.sort(key=lambda x: x['recommendationScore'], reverse=True)
        return recommendations