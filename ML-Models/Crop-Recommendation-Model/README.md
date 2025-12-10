# Crop Prediction System

A machine learning system that predicts the best crop to grow based on soil and weather conditions using multiple tree-based algorithms.

## Features

- **Multiple Models**: Trains and compares 6 different tree-based algorithms:
  - Decision Tree
  - Random Forest
  - Extra Trees
  - Gradient Boosting
  - XGBoost
  - LightGBM

- **High Accuracy**: Achieves 99.55% accuracy with the best model (Random Forest)

- **Hyperparameter Tuning**: Automatically tunes the top-performing models for optimal performance

- **Easy to Use**: Simple Python interface for making predictions

- **Batch Processing**: Support for single predictions and batch predictions

## Dataset

The system uses a dataset with 2,200 samples and 22 different crop types:
- **Features**: N, P, K (soil nutrients), temperature, humidity, pH, rainfall
- **Target**: Crop type (22 different crops including rice, cotton, maize, coffee, etc.)

## Installation

1. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### 1. Training the Model

First, train the model using the provided dataset:

```bash
python crop_model_training.py
```

This will:
- Load and preprocess the dataset
- Train 6 different models
- Perform hyperparameter tuning on the best models
- Select the best performing model
- Save the trained model and label encoder

### 2. Making Predictions

#### Interactive Mode
```bash
python crop_prediction.py
```

#### Programmatic Usage
```python
from crop_prediction import CropPredictor

# Initialize predictor (auto-detects trained model)
predictor = CropPredictor()

# Single prediction
result = predictor.predict_single(
    N=90, P=42, K=43, 
    temperature=20.88, humidity=82.0, 
    ph=6.5, rainfall=202.9
)

print(f"Predicted Crop: {result['predicted_crop']}")
print(f"Confidence: {result['confidence']:.2%}")

# Batch prediction
batch_data = [
    {'N': 85, 'P': 58, 'K': 41, 'temperature': 21.77, 'humidity': 80.3, 'ph': 7.0, 'rainfall': 226.7},
    {'N': 60, 'P': 55, 'K': 44, 'temperature': 23.0, 'humidity': 82.3, 'ph': 7.8, 'rainfall': 264.0}
]

batch_results = predictor.predict_batch(batch_data)
for result in batch_results:
    print(f"Crop: {result['predicted_crop']}, Confidence: {result['confidence']:.2%}")
```

### 3. Testing the System

Run the test script to verify everything works:

```bash
python test_prediction.py
```

## Model Performance

The best model (Random Forest) achieved:
- **Accuracy**: 99.55%
- **Cross-validation Score**: 99.60% (±0.85%)

### Feature Importance
1. **Rainfall** (22.31%) - Most important factor
2. **Humidity** (21.69%)
3. **Potassium (K)** (18.34%)
4. **Phosphorus (P)** (14.56%)
5. **Nitrogen (N)** (10.20%)
6. **Temperature** (7.55%)
7. **pH** (5.35%)

## Input Parameters

| Parameter | Description | Range |
|-----------|-------------|-------|
| N | Nitrogen content in soil | 0-140 |
| P | Phosphorus content in soil | 5-145 |
| K | Potassium content in soil | 5-205 |
| temperature | Temperature in Celsius | 8.8-43.7°C |
| humidity | Humidity percentage | 14.3-99.9% |
| ph | Soil pH value | 3.5-9.9 |
| rainfall | Rainfall in mm | 20.2-298.6mm |

## Supported Crops

The system can predict 22 different crop types:
- apple, banana, blackgram, chickpea, coconut, coffee, cotton, grapes, jute, kidneybeans, lentil, maize, mango, mothbeans, mungbean, muskmelon, orange, papaya, pigeonpeas, pomegranate, rice, watermelon

## Files

- `crop_model_training.py` - Main training script
- `crop_prediction.py` - Prediction system
- `test_prediction.py` - Test script
- `example_usage.py` - Usage examples
- `requirements.txt` - Python dependencies
- `SIHDataset_Crop_recommend.csv` - Training dataset

## Output Files

After training, the following files are generated:
- `best_crop_model_YYYYMMDD_HHMMSS.pkl` - Trained model
- `label_encoder_YYYYMMDD_HHMMSS.pkl` - Label encoder
- `feature_importance_*.png` - Feature importance plots

## Example Results

```
Input: N=90, P=42, K=43, Temp=20.88°C, Humidity=82.0%, pH=6.5, Rainfall=202.9mm
Predicted Crop: rice
Confidence: 90.00%

Top 3 predictions:
1. rice: 90.00%
2. jute: 8.01%
3. pomegranate: 1.35%
```

## Requirements

- Python 3.7+
- pandas
- numpy
- scikit-learn
- xgboost
- lightgbm
- matplotlib
- seaborn
- joblib

## License

This project is open source and available under the MIT License.
