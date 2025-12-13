from flask import Flask, render_template, request, jsonify
import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import json

app = Flask(__name__)
app.secret_key = 'rice-disease-classification-2024'

class RiceDiseasePredictor:
    def __init__(self, model_path='rice_disease_model_fixed.h5'):
        """Initialize the rice disease predictor with the fixed model"""
        self.model_path = model_path
        self.model = None
        self.class_names = [
            'Rice_Bacterial_Leaf_Blight',
            'Rice_Blast', 
            'Rice_Brown_Spot',
            'Rice_Healthy',
            'Rice_Leaf_Scald',
            'Rice_Sheath_Blight',
            'Rice_Tungro'
        ]
        self.input_size = (224, 224)
        
    def load_model(self):
        """Load the fixed model"""
        print(f"Loading fixed model from {self.model_path}...")
        
        # Check if model file exists
        if not os.path.exists(self.model_path):
            print(f"❌ Model file not found: {self.model_path}")
            return False
        
        try:
            # Load the fixed model (should work without issues now)
            self.model = keras.models.load_model(self.model_path)
            print("✅ Fixed model loaded successfully!")
            
            # Test the model with a sample input to ensure it works
            sample_input = tf.random.normal((1, 224, 224, 3))
            _ = self.model(sample_input)
            print("✅ Model test successful!")
            
            return True
        except Exception as e:
            print(f"❌ Error loading fixed model: {e}")
            return False
    
    def preprocess_image(self, image_file):
        """Preprocess image for prediction"""
        try:
            # Load image from file
            img = Image.open(image_file)
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize to model input size
            img = img.resize(self.input_size)
            
            # Convert to numpy array and normalize
            img_array = np.array(img) / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
            
        except Exception as e:
            print(f"❌ Error preprocessing image: {e}")
            return None
    
    def predict(self, image_file, top_k=3):
        """Predict rice disease from image"""
        if self.model is None:
            print("❌ Model not loaded")
            return None
        
        # Preprocess image
        img_array = self.preprocess_image(image_file)
        if img_array is None:
            return None
        
        # Make prediction
        try:
            print("Making prediction...")
            predictions = self.model.predict(img_array, verbose=0)
            
            # Get top-k predictions
            top_indices = np.argsort(predictions[0])[-top_k:][::-1]
            top_probabilities = predictions[0][top_indices]
            
            results = []
            for i, (idx, prob) in enumerate(zip(top_indices, top_probabilities)):
                results.append({
                    'rank': i + 1,
                    'class': self.class_names[idx],
                    'confidence': float(prob),
                    'percentage': float(prob * 100)
                })
            
            print(f"✅ Prediction successful: {results[0]['class']} ({results[0]['percentage']:.2f}%)")
            return results
            
        except Exception as e:
            print(f"❌ Error during prediction: {e}")
            return None

# Initialize predictor
predictor = RiceDiseasePredictor()

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image prediction"""
    try:
        # Check if file was uploaded
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Check file extension
        allowed_extensions = {'png', 'jpg', 'jpeg', 'JPG', 'JPEG', 'PNG'}
        if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({'error': 'Invalid file type. Please upload PNG or JPG images only.'}), 400
        
        # Load model if not already loaded
        if predictor.model is None:
            print("Model not loaded, attempting to load...")
            if not predictor.load_model():
                return jsonify({'error': 'Failed to load model. Please check the model file.'}), 500
        
        # Make prediction
        results = predictor.predict(file, top_k=3)
        
        if results is None:
            return jsonify({'error': 'Failed to process image or make prediction'}), 500
        
        return jsonify({
            'success': True,
            'predictions': results,
            'best_prediction': results[0]
        })
        
    except Exception as e:
        print(f"Error in predict route: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor.model is not None,
        'model_path': predictor.model_path,
        'model_exists': os.path.exists(predictor.model_path)
    })

if __name__ == '__main__':
    # Load model on startup
    print("🌾 Starting Rice Disease Classification Web App (Fixed Model)")
    print("=" * 60)
    
    if predictor.load_model():
        print("✅ Fixed model loaded successfully!")
    else:
        print("❌ Failed to load fixed model. App will start but predictions may fail.")
        print("💡 Make sure 'rice_disease_model_fixed.h5' exists in the current directory.")
    
    print("🚀 Starting Flask server...")
    print("📱 Open your browser and go to: http://127.0.0.1:5000")
    print("🛑 Press CTRL+C to stop the server")
    print("=" * 60)
    
    # Get port from environment variable (for Render) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
