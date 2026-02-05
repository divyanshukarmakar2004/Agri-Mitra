# AgriMitra – Software Requirements Specification (SRS)

## 1. Problem Statement

Farmers in India lack timely, localized, and actionable guidance for crop planning, disease management, and resource optimization. Existing tools are fragmented, difficult to use, and not accessible to farmers with limited digital literacy. Authorities also lack real-time data for agricultural monitoring and decision-making.

AgriMitra addresses this by providing an integrated platform for crop prediction, optimization, disease detection, and governance-level monitoring.

---

## 2. System Actors

- Farmers (mobile app users)
- Government / Agricultural Authorities (web dashboard users)
- IoT Soil Sensors
- Satellite Data (Google Earth Engine)
- Weather & Market APIs

---

## 3. Functional Requirements

### Farmer Application
- Crop recommendation based on soil and weather inputs
- Crop yield prediction before harvest
- Pest detection from crop images
- Disease detection from crop images
- Fertilizer and irrigation optimization guidance
- Multilingual voice-based navigation
- Fertilizer authenticity verification via barcode scan

### Government Dashboard
- Regional crop health visualization using NDVI/NDRE
- Pest outbreak heatmaps
- Yield trend analytics
- Crop distribution insights

### Data Processing
- Real-time sensor data ingestion
- Satellite imagery processing
- ML/DL model inference for predictions and detection

---

## 4. Non-Functional Requirements

- Operable in low internet connectivity
- Multilingual voice support (English, Hindi, Tamil, Odia)
- Scalable from village to national level
- Secure cloud-hosted backend
- Offline support for key features

---

## 5. Data Requirements

- Soil: NPK, pH, moisture, temperature
- Weather: rainfall, humidity, temperature
- Satellite: NDVI, NDRE indices
- Crop images for pest/disease detection
- Historical yield data

---

## 6. Cloud & Infrastructure Requirements

- Python backend with REST APIs
- Real-time database for farmer data
- Storage for images and satellite data
- Compute for ML/DL inference
- Web dashboard for authorities
- Cloud deployment for scalability

---

## 7. Constraints

- Rural connectivity limitations
- Sensor affordability
- Variability in regional agricultural data
- Digital literacy barriers
