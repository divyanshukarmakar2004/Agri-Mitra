# Smart Agriculture Hardware System (SIH)

This hardware module uses an ESP32 microcontroller to simulate and upload soil and environmental parameters to Firebase in real time for the Smart India Hackathon (SIH) agriculture project.

---

## Parameters Uploaded
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- pH Value
- Soil Moisture
- Temperature
- Humidity

---

## Microcontroller Used
- ESP32 Dev Module

---

## Cloud Platform
- Firebase Realtime Database

---

## Data Update Interval
- Every 2 seconds

---

## Features
- Real-time cloud data upload
- Simulated sensor fallback for testing
- Ready for real sensor integration
- Stable random-walk based sensor behavior

---

## Folder Structure

hardware/
  esp32_firmware/
    NPKsensor.ino
  docs/
    pin_connections.md
  bill_of_materials.csv
  README.md

---

## Project Use Case
This system enables:
- Smart fertilizer recommendation
- Soil health monitoring
- Climate-aware agriculture decisions
- Real-time farmer dashboard integration

---

## Developed For
Smart India Hackathon (SIH) - Smart Agriculture Project
