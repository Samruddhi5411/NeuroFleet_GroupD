import mysql.connector
from config import Config
import pandas as pd

class Database:
    def __init__(self):
        self.config = {
            'host': Config.DB_HOST,
            'port': Config.DB_PORT,
            'user': Config.DB_USER,
            'password': Config.DB_PASSWORD,
            'database': Config.DB_NAME
        }
    
    def get_connection(self):
        return mysql.connector.connect(**self.config)
    
    def fetch_vehicles(self):
        """Fetch all vehicles with telemetry data"""
        conn = self.get_connection()
        query = """
            SELECT id, vehicle_number, manufacturer, model, type, capacity,
                   is_electric, status, latitude, longitude, battery_level,
                   fuel_level, health_score, mileage, speed, created_at, last_updated
            FROM vehicles
        """
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    
    def fetch_bookings(self):
        """Fetch all bookings"""
        conn = self.get_connection()
        query = """
            SELECT b.id, b.customer_id, b.vehicle_id, b.driver_id, 
                   b.start_time, b.end_time, b.pickup_location, b.dropoff_location,
                   b.total_price, b.status, b.distance_km, b.created_at
            FROM bookings b
        """
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    
    def fetch_customer_preferences(self, customer_id):
        """Fetch customer booking history for recommendations"""
        conn = self.get_connection()
        query = f"""
            SELECT b.vehicle_id, v.type, v.is_electric, b.total_price
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = {customer_id}
            AND b.status = 'COMPLETED'
            ORDER BY b.created_at DESC
            LIMIT 10
        """
        df = pd.read_sql(query, conn)
        conn.close()
        return df