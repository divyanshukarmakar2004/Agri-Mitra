# Software Requirements Specification
## AgriMitra - Smart Agriculture Platform

**Version:** 1.0  
**Date:** February 5, 2026  
**Project:** Smart India Hackathon 2025 - Problem Statement ID 25044  
**Cloud Platform:** Amazon Web Services (AWS)

---

## 1. Problem Statement

Indian agriculture faces critical challenges:
- **Low Yields**: 20-30% below potential due to suboptimal practices
- **Pest/Disease Losses**: ₹50,000+ crores annual losses
- **Resource Waste**: Over-fertilization and improper irrigation
- **Information Gap**: Limited access to real-time advisory
- **Digital Divide**: Language and literacy barriers
- **Monitoring Gap**: Lack of real-time data for policy decisions

**Solution**: AgriMitra provides AI-powered crop recommendations, yield prediction, pest/disease detection, satellite monitoring, and agentic optimization through a voice-enabled mobile app and government dashboard on AWS.

---

## 2. System Actors

**Primary Actors**:
- **Farmers**: Android users (API 24+), multilingual (Hindi, English, Tamil, Odia), varying literacy
- **Government Officials**: Web dashboard users for monitoring and scheme implementation
- **Extension Officers**: Field officers providing farmer support

**Secondary Actors**:
- **System Administrators**: Technical support
- **Data Scientists**: ML model training
- **External Systems**: Weather APIs, Google Earth Engine, market data

---

## 3. Functional Requirements

### 3.1 Farmer Application

#### FR-FA-001: Crop Recommendation
- Accept inputs: N, P, K (kg/ha), pH, temperature, humidity, rainfall
- Predict from 22 crop types using Random Forest (≥99% accuracy)
- Response time <2 seconds
- **Input Ranges**: N (0-140), P (5-145), K (5-205), pH (3.5-9.9), Temp (8.8-43.7), Humidity (14.3-99.9), Rainfall (20.2-298.6)

#### FR-FA-002: Yield Prediction
- Predict yield in quintals/hectare with ±15% accuracy
- Accept soil data, weather forecast, crop type, sowing date, location
- Update predictions with new sensor data

#### FR-FA-003: Disease Detection
- Classify 22 disease types across 4 crops (Rice, Cotton, Groundnut, Sugarcane)
- Accept JPEG/PNG images (max 10MB, 224x224 pixels)
- Achieve ≥85% accuracy, process within 5 seconds
- Support offline inference
- **Disease Classes**: Rice (6), Cotton (4), Groundnut (5), Sugarcane (5)

#### FR-FA-004: Pest Detection
- Identify 19 pest types across 4 crops (Rice, Wheat, Cotton, Sugarcane)
- Achieve ≥60% accuracy
- Provide pest control recommendations
- Enable pest outbreak reporting

#### FR-FA-005: Agentic Optimization (LangChain/LangGraph)
- Optimize NPK values for 10 crops (Barley, Cotton, Corn, Potato, Rice, Soybean, Sugarcane, Sunflower, Tomato, Wheat)
- Provide soil pH correction and lime requirements
- Generate fertilizer schedules
- Support multilingual crop names

#### FR-FA-006: Satellite Monitoring (NDVI/NDRE)
- Process Sentinel-2 imagery (10m/20m resolution)
- Calculate NDVI and NDRE indices
- Classify growth stages with ≥95% accuracy
- Predict nitrogen levels (≥50% R²)
- Generate weekly reports with zone-wise recommendations

#### FR-FA-007: Voice Interface
- Support voice I/O in 4 languages (English, Hindi, Tamil, Odia)
- Achieve ≥90% speech recognition accuracy
- Work offline for basic commands

#### FR-FA-008: Market Prices
- Display real-time prices for major crops
- Show price trends and historical data
- Support location-based filtering
- Update prices twice daily

#### FR-FA-009: Community Features
- Provide community chat with image/text sharing
- Enable location-based farmer groups
- Moderate content for relevance

### 3.2 Government Dashboard

#### FR-GD-001: Farmer Registry
- Maintain profiles with contact, location, farm details
- Support search/filtering by district, crop, status
- Provide activity monitoring and engagement metrics
- Support bulk operations for scheme enrollment

#### FR-GD-002: Pest Outbreak Monitoring
- Display pest reports on interactive maps
- Provide outbreak severity indicators
- Support temporal analysis
- Generate pest alert notifications

#### FR-GD-003: Yield Analytics
- Display yield metrics and trends
- Support comparison across districts/seasons
- Provide prediction accuracy monitoring
- Generate yield reports for policy planning

#### FR-GD-004: Scheme Management
- Track scheme enrollment and utilization
- Provide performance analytics
- Support scheme announcements
- Generate compliance reports

### 3.3 Data Processing

#### FR-DP-001: IoT Data Collection
- Collect from ESP32/Arduino sensors via LoRaWAN
- Monitor NPK (0-999 ppm), pH (0-14), moisture (0-100%), temperature (-40 to 85°C), humidity (0-100%)
- Update every 2 seconds
- Provide sensor health monitoring

#### FR-DP-002: Weather Integration
- Integrate with weather APIs for real-time data
- Provide 7-day forecasts
- Support location-based information
- Provide weather-based alerts

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Response Time**: API <1s (95th percentile), ML predictions <2s, image processing <5s
- **Throughput**: 10,000 concurrent users, 1,000 API requests/min, 100 images/min
- **Scalability**: Auto-scaling, support 1M farmer records

### 4.2 Reliability
- **Availability**: 99.5% uptime
- **Offline Mode**: Core features work offline
- **Backup**: Automated daily backups, 30-day retention
- **Recovery**: RTO 4 hours, RPO 1 hour

### 4.3 Security
- **Authentication**: AWS Cognito with phone verification
- **Authorization**: Role-based access (farmers, officials, admins)
- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Rate Limiting**: 120 requests/minute per endpoint

### 4.4 Usability
- **Mobile**: Android API 24+, screen sizes 4"-12"
- **Languages**: English, Hindi, Tamil, Odia with proper font rendering
- **Accessibility**: Screen reader support, high contrast mode
- **Learning Curve**: New users complete tasks within 5 minutes

### 4.5 Compatibility
- **Mobile**: Android 7.0+, 2GB RAM, 16GB storage, 5MP camera
- **Web**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Network**: Support 2G, 3G, 4G, WiFi

---

## 5. Data Requirements

### 5.1 Data Sources

**Sensor Data**: ESP32/Arduino via LoRaWAN, every 2 seconds, ~43,200 records/sensor/day, JSON format

**Weather Data**: OpenWeatherMap/IMD APIs, hourly updates, ~8,760 records/location/year

**Satellite Imagery**: Google Earth Engine (Sentinel-2), weekly processing, ~50MB/field/week, JP2 format, Bands B2-B8A

**Crop Images**: Farmer mobile app, on-demand, ~1,000 images/day, JPEG/PNG (max 10MB)

### 5.2 Data Storage

**Amazon DynamoDB**:
- Purpose: Real-time sensor data, user sessions
- Tables: `SensorData`, `UserSessions`, `Predictions`
- Size: 100GB (1M farmers, 3 years)

**Amazon RDS (PostgreSQL)**:
- Purpose: Analytics, reporting
- Size: 50GB
- Tables: farmers, crops, yields, predictions, schemes, reports

**Amazon S3**:
- Purpose: Images, ML models, satellite data
- Size: 10TB
- Buckets: `agrimitra-images`, `agrimitra-models`, `agrimitra-satellite`

**Amazon ElastiCache (Redis)**:
- Purpose: Caching, session management
- Size: 10GB
- TTL: Crop recommendations (1h), weather (30m), market prices (15m), ML predictions (2h)

### 5.3 ML Training Data
- **Crop Recommendation**: 2,200 samples, 7 features, 22 classes
- **Disease Detection**: 50,000+ images, 22 classes, 224x224 pixels
- **Pest Detection**: 28,500 images (1,500/class), 19 classes
- **Yield Prediction**: 10+ years historical data

---

## 6. AWS Cloud Requirements

### 6.1 Compute Services

**Amazon EKS**: Microservices orchestration, 3-20 pods auto-scaling, t3.xlarge nodes, ap-south-1 region

**AWS Lambda**: Serverless event processing, Python 3.11/Node.js 18, 512MB-3GB memory, 1,000 concurrent executions

**Amazon EC2**: Backend API servers (if not EKS), t3.medium (dev), m5.xlarge (prod), Min 3, Max 20 instances

### 6.2 Storage Services

**Amazon S3**: Images/models/satellite data, 10TB total, lifecycle policies (Glacier after 90 days), versioning enabled

**Amazon RDS (PostgreSQL)**: db.t3.large (2 vCPU, 8GB RAM), 500GB SSD, Multi-AZ, automated daily backups

**Amazon DynamoDB**: Real-time sensor data, on-demand pricing, Global Tables, TTL enabled (90 days)

**Amazon ElastiCache (Redis)**: cache.t3.medium, 3 shards, TTL configured

### 6.3 ML/AI Services

**Amazon SageMaker**: 
- Endpoints: Crop Recommendation, Disease Detection, Pest Detection, Yield Prediction
- Instance: ml.m5.xlarge for inference
- Auto-scaling: Min 2, Max 10 instances
- Model Registry for versioning

**AWS Lambda + SageMaker**: Serverless ML inference for low-traffic endpoints

### 6.4 API & Integration

**Amazon API Gateway**: REST API management, rate limiting (1,000 req/min), API keys, 5-min caching, Cognito integration

**AWS IoT Core**: MQTT over TLS, Rules Engine, Device Registry, 1,000 messages/second capacity

### 6.5 Authentication & Security

**Amazon Cognito**: User Pools (farmers, officials, admins), phone verification, MFA, password policies

**AWS Secrets Manager**: Store API keys, database credentials, automatic rotation every 90 days

**AWS WAF**: DDoS protection, SQL injection prevention, rate limiting, geo-blocking, bot detection

### 6.6 Monitoring & Logging

**Amazon CloudWatch**: Metrics (CPU, memory, requests, errors), alarms, dashboards, centralized logs, 30-day retention (app logs), 1-year retention (audit logs)

**AWS X-Ray**: Distributed tracing for microservices

**Amazon SNS**: Alert notifications (email, SMS, push)

### 6.7 CI/CD Pipeline

**AWS CodePipeline**: GitHub integration, automated testing, blue-green deployment to EKS, manual approval for production

**Amazon ECR**: Docker image storage, automated vulnerability scanning, lifecycle policies

### 6.8 Networking

**Amazon VPC**: 10.0.0.0/16, Public/Private/Database subnets, NAT Gateway, VPC Endpoints (S3, DynamoDB)

**Amazon CloudFront**: CDN for mobile app assets, global distribution, AWS Certificate Manager for HTTPS

### 6.9 Cost Estimate (Monthly)

| Service | Cost |
|---------|------|
| EKS + EC2 | $1,800 |
| Lambda | $400 |
| S3 | $1,200 |
| RDS | $600 |
| DynamoDB | $500 |
| ElastiCache | $300 |
| SageMaker | $800 |
| API Gateway | $200 |
| IoT Core | $300 |
| CloudWatch | $150 |
| Data Transfer | $450 |
| **Total** | **~$6,700/month** |

*Based on 10,000 active farmers, 1M API calls/day*

---

## 7. Constraints

### 7.1 Technical Constraints
- **Mobile**: Android API 24+ limits advanced features on older devices
- **Model Size**: Offline ML models limited to 50MB
- **Network**: Intermittent rural connectivity requires offline functionality
- **Satellite**: Cloud cover limits imagery during monsoons, 10m resolution insufficient for <1 hectare plots
- **ML Accuracy**: Disease detection 85% ceiling, pest detection 64% due to variations

### 7.2 Business Constraints
- **Budget**: ₹50 lakhs development, ₹10 lakhs/year operational
- **Timeline**: 8 months (2m ML models, 3m dashboard, 2m IoT, 1m testing)
- **Team**: 6 developers, 2 domain experts, 1 PM, 1 tech lead

### 7.3 Regulatory Constraints
- **Data Privacy**: Indian data protection laws compliance, data localization required
- **Fertilizer**: FCO compliance for quality standards
- **Pesticide**: Insecticides Act compliance, no banned chemicals
- **Satellite**: ISRO guidelines for data sharing, resolution limits

### 7.4 Operational Constraints
- **Rural Infrastructure**: 2G/3G networks, frequent power outages, limited cellular coverage
- **User Adoption**: Low digital literacy, language barriers, conservative farming practices
- **Scalability**: Diverse climate zones require region-specific models, 22 official languages limit multilingual support
- **Support**: Limited capacity for technical support to millions of farmers

---

**Document Status**: Approved for Design Phase  
**Next Phase**: System Design and Architecture
