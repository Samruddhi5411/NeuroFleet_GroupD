import pandas as pd
import numpy as np

# Set a random seed for reproducibility
np.random.seed(42)

# Define the number of data points
num_samples = 1000

# Generate dummy feature data
distance_km = np.random.uniform(5, 100, num_samples).round(2)
avg_speed = np.random.uniform(20, 120, num_samples).round(2)
traffic_level = np.random.choice(['Low', 'Medium', 'High'], num_samples, p=[0.5, 0.3, 0.2])
battery_level = np.random.uniform(10, 100, num_samples).round(2)
fuel_level = np.random.uniform(0, 100, num_samples).round(2)

# Generate a plausible target variable (historical_eta_minutes)
# We can create a simple, noisy relationship. ETA might increase with distance and traffic,
# and decrease with average speed.
historical_eta_minutes = (
    (distance_km / avg_speed) * 60 +
    (np.random.normal(loc=0, scale=10, size=num_samples)) +
    np.where(traffic_level == 'High', 20, np.where(traffic_level == 'Medium', 10, 0))
)
historical_eta_minutes = np.maximum(0, historical_eta_minutes).round(2)

# Create a DataFrame
df = pd.DataFrame({
    'distance_km': distance_km,
    'avg_speed': avg_speed,
    'traffic_level': traffic_level,
    'battery_level': battery_level,
    'fuel_level': fuel_level,
    'historical_eta_minutes': historical_eta_minutes
})

# Save the DataFrame to a CSV file
file_path = 'fleet_routes.csv'
df.to_csv(file_path, index=False)

print(f"Dummy data generated and saved to '{file_path}'")
print("\nFirst 5 rows of the generated data:")
print(df.head())
