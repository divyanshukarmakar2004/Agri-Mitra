import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

# Load the dataset
print("Loading dataset...")
df = pd.read_csv('SIHfinaldataset.csv')
print(f"Dataset shape: {df.shape}")

# Prepare features and target
print("Preprocessing data...")
# Encode categorical variables
le_crop = LabelEncoder()
le_soil = LabelEncoder()

df['Crop_Type_encoded'] = le_crop.fit_transform(df['Crop_Type'])
df['Soil_Type_encoded'] = le_soil.fit_transform(df['Soil_Type'])

# Select features for training
feature_columns = ['Soil_pH', 'Temperature (celcius)', 'Humidity', 'Wind_Speed (km/hr)', 
                   'N (ppm)', 'P (ppm)', 'K (ppm)', 'Soil_Quality', 'Crop_Type_encoded', 'Soil_Type_encoded']

X = df[feature_columns]
y = df['Crop_Yield (tons/hectare)']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Training set size: {X_train.shape[0]}")
print(f"Testing set size: {X_test.shape[0]}")

# Train XGBoost model
print("\nTraining XGBoost Regressor...")
print("=" * 60)

model = xgb.XGBRegressor(random_state=42)

# Train the model
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Calculate metrics
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Print results
print(f"\nModel Performance:")
print(f"RMSE: {rmse:.4f}")
print(f"MAE: {mae:.4f}")
print(f"R² Score: {r2:.4f}")
print(f"Accuracy: {r2*100:.2f}%")

# Retrain on full data for production use
print("\nRetraining on full dataset...")
model.fit(X, y)

# Save model and encoders
joblib.dump(model, 'model.pkl')
joblib.dump(le_crop, 'label_encoder_crop.pkl')
joblib.dump(le_soil, 'label_encoder_soil.pkl')
print("✓ Model saved to model.pkl")
print("✓ Label encoders saved")

# Display feature importance
print("\n" + "=" * 60)
print("Top 5 Most Important Features:")
print("=" * 60)

importance_df = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

print(importance_df.head())

print("\nTraining completed! Model ready for prediction.")

# Get user input for prediction
print("\n" + "=" * 60)
print("Enter crop details for yield prediction:")
print("=" * 60)
print("Crop Types available: ", list(le_crop.classes_))
print("Soil Types available: ", list(le_soil.classes_))

croptype = input("\nEnter crop type: ")
soiltype = input("Enter soil type: ")
soilph = float(input("Enter soil pH: "))
temp = float(input("Enter temperature (°C): "))
humidity = float(input("Enter humidity (%): "))
windspeed = float(input("Enter wind speed (km/hr): "))
n = float(input("Enter N (ppm): "))
p = float(input("Enter P (ppm): "))
k = float(input("Enter K (ppm): "))
soilquality = float(input("Enter soil quality: "))

# Encode categorical variables
crop_encoded = le_crop.transform([croptype])[0]
soil_encoded = le_soil.transform([soiltype])[0]

# Create input DataFrame
input_data = pd.DataFrame({
    'Soil_pH': [soilph],
    'Temperature (celcius)': [temp],
    'Humidity': [humidity],
    'Wind_Speed (km/hr)': [windspeed],
    'N (ppm)': [n],
    'P (ppm)': [p],
    'K (ppm)': [k],
    'Soil_Quality': [soilquality],
    'Crop_Type_encoded': [crop_encoded],
    'Soil_Type_encoded': [soil_encoded]
})

# Make prediction
prediction = model.predict(input_data)
print(f"\n{'='*60}")
print(f"Predicted Crop Yield: {prediction[0]:.4f} tons/hectare")
print(f"{'='*60}")
