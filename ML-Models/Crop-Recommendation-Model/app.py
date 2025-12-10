import os
from flask import Flask, request, jsonify, render_template
import numpy as np
import joblib

app = Flask(__name__)

# Load the trained model and label encoder
model = joblib.load(open('robust_crop_model_20250913_210302.pkl', 'rb'))
label_encoder = joblib.load(open('robust_label_encoder_20250913_210302.pkl', 'rb'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    # Assuming the input data is a dictionary with keys matching the model's features
    # You might need to adjust this based on your model's expected input format
    features = np.array(list(data.values())).reshape(1, -1)

    prediction = model.predict(features)
    predicted_crop_encoded = prediction[0]
    predicted_crop = label_encoder.inverse_transform([predicted_crop_encoded])[0]

    return jsonify({'predicted_crop': predicted_crop})

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Run the app on 0.0.0.0 to make it accessible externally
    app.run(host='0.0.0.0', port=port, debug=False)