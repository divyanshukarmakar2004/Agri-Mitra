# app/api/main.py
import io
import json
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, request, jsonify

# --- Initialize Flask App and Load Model ---
app = Flask(__name__)
model = None
recommendations_data = None
class_names = None
input_size = (224, 224)

def load_model():
    """Load the trained model from disk."""
    global model
    model_path = '../../models/fast_efficient_best.h5'
    model = tf.keras.models.load_model(model_path)
    # Derive expected input size from the loaded model
    try:
        global input_size
        input_shape = model.input_shape
        if isinstance(input_shape, (list, tuple)) and len(input_shape) >= 3:
            input_size = (int(input_shape[1]), int(input_shape[2]))
    except Exception:
        # Keep default input size if not derivable
        pass
    print("✅ Model loaded successfully.")

def load_class_names():
    """Load class names from evaluation results if available, else fallback."""
    global class_names
    try:
        with open('../../fast_efficient_results.json', 'r') as f:
            data = json.load(f)
            cn = data.get('class_names')
            if isinstance(cn, list) and len(cn) > 0:
                class_names = cn
    except Exception:
        # Fallback to default 3 classes
        class_names = ['Healthy', 'Powdery', 'Rust']

def load_recommendations():
    """Load the recommendations knowledge base."""
    global recommendations_data
    try:
        with open('recommendations.json', 'r') as f:
            recommendations_data = json.load(f)
        print("✅ Recommendations data loaded successfully.")
    except FileNotFoundError:
        print("⚠️ Recommendations file not found. Using default responses.")
        recommendations_data = {}

def prepare_image(image, target_size):
    """Preprocesses the image for model prediction."""
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    # Normalization is part of the EfficientNet model, so no need to divide by 255.
    return image

@app.route("/predict", methods=["POST"])
def predict():
    """Endpoint to receive an image and return a disease prediction."""
    response_data = {"success": False}

    if "image" not in request.files:
        response_data["error"] = "No image file found in the request."
        return jsonify(response_data), 400

    image_file = request.files["image"]
    
    try:
        # Read image file
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Preprocess the image
        processed_image = prepare_image(image, target_size=input_size)
        
        # Make prediction
        predictions = model.predict(processed_image)
        
        # Format response
        predicted_class_index = np.argmax(predictions)
        predicted_class_name = class_names[predicted_class_index]
        confidence = float(np.max(predictions))
        
        response_data["prediction"] = {
            "class_name": predicted_class_name,
            "confidence": f"{confidence:.4f}"
        }
        response_data["success"] = True

    except Exception as e:
        response_data["error"] = str(e)
        return jsonify(response_data), 500

    return jsonify(response_data)

@app.route("/recommendations", methods=["GET"])
def get_recommendations():
    """Endpoint to get disease-specific recommendations."""
    disease = request.args.get('disease', '').strip()
    crop = request.args.get('crop', 'Rice').strip()
    region = request.args.get('region', 'General').strip()
    
    response_data = {"success": False}
    
    if not disease:
        response_data["error"] = "Disease parameter is required"
        return jsonify(response_data), 400
    
    try:
        # Navigate the recommendations JSON structure
        if disease in recommendations_data:
            disease_data = recommendations_data[disease]
            
            # Try to get crop-specific data, fallback to first available crop
            if crop in disease_data:
                crop_data = disease_data[crop]
            else:
                # Fallback to first available crop for this disease
                available_crops = list(disease_data.keys())
                if available_crops:
                    crop_data = disease_data[available_crops[0]]
                    crop = available_crops[0]  # Update crop name for response
                else:
                    response_data["error"] = f"No data available for disease: {disease}"
                    return jsonify(response_data), 404
            
            # Try to get region-specific data, fallback to General
            if region in crop_data:
                region_data = crop_data[region]
            else:
                region_data = crop_data.get("General", {})
                region = "General"  # Update region name for response
            
            # Get general information (always from General section)
            general_data = crop_data.get("General", {})
            
            # Combine data
            recommendations = {
                "disease": disease,
                "crop": crop,
                "region": region,
                "disease_info": general_data.get("disease_info", ""),
                "preventative_cultural": general_data.get("preventative_cultural", []),
                "organic_low_cost": general_data.get("organic_low_cost", []),
                "chemical_control": region_data.get("chemical_control", [])
            }
            
            response_data["recommendations"] = recommendations
            response_data["success"] = True
            
        else:
            response_data["error"] = f"No recommendations found for disease: {disease}"
            return jsonify(response_data), 404
            
    except Exception as e:
        response_data["error"] = f"Error retrieving recommendations: {str(e)}"
        return jsonify(response_data), 500
    
    return jsonify(response_data)

if __name__ == "__main__":
    print("🔄 Loading Keras model and starting Flask server...")
    print("Please wait until the server has fully started.")
    load_model()
    load_class_names()
    load_recommendations()
    app.run(host='0.0.0.0', port=5000, debug=True)
