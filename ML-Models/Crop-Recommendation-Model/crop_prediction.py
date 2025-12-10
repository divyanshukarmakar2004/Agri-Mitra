import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import os

class CropPredictor:
    def __init__(self, model_path=None, encoder_path=None):
        """
        Initialize the crop predictor with trained model and label encoder
        
        Args:
            model_path: Path to the trained model file (.pkl)
            encoder_path: Path to the label encoder file (.pkl)
        """
        self.model = None
        self.label_encoder = None
        self.feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        # Auto-detect model files if not provided
        if model_path is None or encoder_path is None:
            model_path, encoder_path = self._find_model_files()
        
        self.load_model(model_path, encoder_path)
    
    def _find_model_files(self):
        """Auto-detect the most recent model and encoder files"""
        model_files = [f for f in os.listdir('.') if f.startswith('best_crop_model_') and f.endswith('.pkl')]
        encoder_files = [f for f in os.listdir('.') if f.startswith('label_encoder_') and f.endswith('.pkl')]
        
        if not model_files or not encoder_files:
            raise FileNotFoundError("No trained model files found. Please run crop_model_training.py first.")
        
        # Get the most recent files
        model_path = max(model_files, key=os.path.getctime)
        encoder_path = max(encoder_files, key=os.path.getctime)
        
        print(f"Auto-detected model file: {model_path}")
        print(f"Auto-detected encoder file: {encoder_path}")
        
        return model_path, encoder_path
    
    def load_model(self, model_path, encoder_path):
        """Load the trained model and label encoder"""
        try:
            self.model = joblib.load(model_path)
            self.label_encoder = joblib.load(encoder_path)
            print(f"Model loaded successfully from {model_path}")
            print(f"Label encoder loaded successfully from {encoder_path}")
            print(f"Available crop types: {list(self.label_encoder.classes_)}")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def predict_single(self, N, P, K, temperature, humidity, ph, rainfall):
        """
        Predict crop type for a single set of input values
        
        Args:
            N: Nitrogen content
            P: Phosphorus content  
            K: Potassium content
            temperature: Temperature in Celsius
            humidity: Humidity percentage
            ph: pH value
            rainfall: Rainfall in mm
            
        Returns:
            dict: Prediction results with crop name, confidence, and probabilities
        """
        if self.model is None or self.label_encoder is None:
            raise ValueError("Model not loaded. Please load a trained model first.")
        
        # Create input array
        input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        
        # Make prediction
        prediction_encoded = self.model.predict(input_data)[0]
        crop_name = self.label_encoder.inverse_transform([prediction_encoded])[0]
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(input_data)[0]
        
        # Create results dictionary
        results = {
            'predicted_crop': crop_name,
            'confidence': float(max(probabilities)),
            'all_probabilities': dict(zip(self.label_encoder.classes_, probabilities))
        }
        
        return results
    
    def predict_batch(self, data):
        """
        Predict crop types for multiple sets of input values
        
        Args:
            data: List of dictionaries or pandas DataFrame with input features
            
        Returns:
            list: List of prediction results
        """
        if self.model is None or self.label_encoder is None:
            raise ValueError("Model not loaded. Please load a trained model first.")
        
        # Convert to DataFrame if needed
        if isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = data.copy()
        
        # Ensure all required columns are present
        missing_cols = set(self.feature_columns) - set(df.columns)
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        # Reorder columns to match training data
        df = df[self.feature_columns]
        
        # Make predictions
        predictions_encoded = self.model.predict(df.values)
        crop_names = self.label_encoder.inverse_transform(predictions_encoded)
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(df.values)
        
        # Create results
        results = []
        for i, (crop_name, probs) in enumerate(zip(crop_names, probabilities)):
            result = {
                'predicted_crop': crop_name,
                'confidence': float(max(probs)),
                'all_probabilities': dict(zip(self.label_encoder.classes_, probs))
            }
            results.append(result)
        
        return results
    
    def get_feature_importance(self):
        """Get feature importance from the trained model"""
        if self.model is None:
            raise ValueError("Model not loaded. Please load a trained model first.")
        
        if hasattr(self.model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': self.feature_columns,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            return importance_df
        else:
            return None
    
    def interactive_prediction(self):
        """Interactive mode for making predictions"""
        print("=" * 60)
        print("CROP PREDICTION SYSTEM")
        print("=" * 60)
        print("Enter the following soil and weather parameters:")
        print()
        
        try:
            N = float(input("Nitrogen (N) content: "))
            P = float(input("Phosphorus (P) content: "))
            K = float(input("Potassium (K) content: "))
            temperature = float(input("Temperature (°C): "))
            humidity = float(input("Humidity (%): "))
            ph = float(input("pH value: "))
            rainfall = float(input("Rainfall (mm): "))
            
            print("\n" + "=" * 60)
            print("PREDICTION RESULTS")
            print("=" * 60)
            
            result = self.predict_single(N, P, K, temperature, humidity, ph, rainfall)
            
            print(f"Predicted Crop: {result['predicted_crop']}")
            print(f"Confidence: {result['confidence']:.4f} ({result['confidence']*100:.2f}%)")
            
            print(f"\nTop 5 Most Likely Crops:")
            sorted_probs = sorted(result['all_probabilities'].items(), 
                                key=lambda x: x[1], reverse=True)[:5]
            
            for i, (crop, prob) in enumerate(sorted_probs, 1):
                print(f"{i}. {crop}: {prob:.4f} ({prob*100:.2f}%)")
            
            return result
            
        except ValueError as e:
            print(f"Error: {e}")
            print("Please enter valid numeric values.")
            return None
        except KeyboardInterrupt:
            print("\nPrediction cancelled.")
            return None

def main():
    """Main function to run the crop prediction system"""
    try:
        # Initialize predictor
        predictor = CropPredictor()
        
        # Show feature importance
        print("\n" + "=" * 60)
        print("FEATURE IMPORTANCE")
        print("=" * 60)
        importance = predictor.get_feature_importance()
        if importance is not None:
            print(importance.to_string(index=False))
        else:
            print("Feature importance not available for this model type.")
        
        # Run interactive prediction
        while True:
            print("\n" + "=" * 60)
            choice = input("Enter 'p' to predict, 'q' to quit: ").lower().strip()
            
            if choice == 'q':
                print("Goodbye!")
                break
            elif choice == 'p':
                predictor.interactive_prediction()
            else:
                print("Invalid choice. Please enter 'p' or 'q'.")
    
    except Exception as e:
        print(f"Error: {e}")
        print("Please make sure you have trained the model first by running crop_model_training.py")

if __name__ == "__main__":
    main()
