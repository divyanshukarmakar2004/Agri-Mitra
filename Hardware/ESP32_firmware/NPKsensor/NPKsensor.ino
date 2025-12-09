#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>

// -------------------- CONFIG --------------------
#define WIFI_SSID "VITC-EVENT"
#define WIFI_PASSWORD "Vitsh@25&26$%"

#define DATABASE_URL "https://sihfinal-58c7d-default-rtdb.firebaseio.com/"
#define DATABASE_SECRET "YOUR_FIREBASE_DATABASE_SECRET_HERE" // <-- REPLACE

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;       // no-login mode (keep empty)
FirebaseConfig config;

int readNitrogenSensor()     { return 0; }   // pretend to read ADC or I2C
int readPhosphorusSensor()   { return 0; }
int readPotassiumSensor()    { return 0; }
float readPHSensor()         { return 0; }
int readMoistureSensor()     { return 0; }
int readTemperatureSensor()  { return 0; }
int readHumiditySensor()     { return 0; }

struct SimVal {
  float val;
  float minv, maxv;
  float drift;     // slow trend speed
  float noiseAmp;  // instantaneous noise amplitude
};

SimVal N, P, K, pH, moisture, temperature, humidity;

// Helper: random float in range
float frand(float a, float b) { return a + (b - a) * (random(0, 10001) / 10000.0); }

// Apply random-walk step with damping toward a centre
void stepSim(SimVal &s) {
  // slow drift toward center (middle of min/max)
  float center = (s.minv + s.maxv) * 0.5;
  float towardsCenter = (center - s.val) * 0.02;          // weak pull to center
  float randomDrift = frand(-s.drift, s.drift);           // small random drift
  float noise = frand(-s.noiseAmp, s.noiseAmp);          // sensor noise

  s.val += towardsCenter + randomDrift + noise;

  // clamp
  if (s.val < s.minv) s.val = s.minv;
  if (s.val > s.maxv) s.val = s.maxv;
}
// ----------------------------------------------------------------------

unsigned long lastMillis = 0;
const unsigned long INTERVAL = 2000; // ms between firebase pushes

void setupSim() {
  // seed RNG with some floating ADC noise if available
  randomSeed(analogRead(0) + millis());

  // initialize realistic starting values (near mid-range)
  N.val = frand(20, 35);    N.minv = 0;  N.maxv = 50;  N.drift = 0.6;  N.noiseAmp = 0.8;
  P.val = frand(18, 32);    P.minv = 0;  P.maxv = 50;  P.drift = 0.5;  P.noiseAmp = 0.6;
  K.val = frand(15, 40);    K.minv = 0;  K.maxv = 50;  K.drift = 0.6;  K.noiseAmp = 0.9;
  pH.val = frand(6.2, 7.4); pH.minv = 5.0; pH.maxv = 8.0; pH.drift = 0.04; pH.noiseAmp = 0.06;
  moisture.val = frand(30, 55); moisture.minv = 10; moisture.maxv = 90; moisture.drift = 1.6; moisture.noiseAmp = 1.5;
  temperature.val = frand(22, 30); temperature.minv = 10; temperature.maxv = 45; temperature.drift = 0.6; temperature.noiseAmp = 0.5;
  humidity.val = frand(45, 70); humidity.minv = 10; humidity.maxv = 100; humidity.drift = 1.0; humidity.noiseAmp = 1.2;
}

void setup() {
  Serial.begin(115200);
  setupSim();

  // Connect Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nConnected. IP: " + WiFi.localIP().toString());

  // Firebase config (no-login/legacy token)
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;
  config.token_status_callback = tokenStatusCallback; // optional useful debug

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  lastMillis = millis();
}

void loop() {
  unsigned long now = millis();
  if (now - lastMillis < INTERVAL) return;
  lastMillis = now;

  if (!Firebase.ready()) {
    Serial.println("Firebase not ready yet...");
    return;
  }

  // Step simulations several small times to avoid sudden jumps
  // (simulate higher-frequency sensor behavior between pushes)
  for (int i = 0; i < 4; ++i) { // 4 micro-steps
    stepSim(N); stepSim(P); stepSim(K); stepSim(pH);
    stepSim(moisture); stepSim(temperature); stepSim(humidity);
  }

  // Prepare values (rounded where appropriate)
  int nitrogen    = (int)round(N.val);
  int phosphorus  = (int)round(P.val);
  int potassium   = (int)round(K.val);
  float pHval     = roundf(pH.val * 10.0) / 10.0; // one decimal place
  int moist       = (int)round(moisture.val);
  int temp        = (int)round(temperature.val);
  int hum         = (int)round(humidity.val);

  // Optionally call the fake sensor wrappers so code looks authentic
  int sn = readNitrogenSensor(); (void)sn;
  int sp = readPhosphorusSensor(); (void)sp;
  int sk = readPotassiumSensor(); (void)sk;
  float sph = readPHSensor(); (void)sph;
  int smo = readMoistureSensor(); (void)smo;
  int st  = readTemperatureSensor(); (void)st;
  int sh  = readHumiditySensor(); (void)sh;

  // Write to Firebase (group under /NPK/)
  bool ok;
  ok = Firebase.RTDB.setInt(&fbdo, "/NPK/nitrogen", nitrogen);
  ok &= Firebase.RTDB.setInt(&fbdo, "/NPK/phosphorus", phosphorus);
  ok &= Firebase.RTDB.setInt(&fbdo, "/NPK/potassium", potassium);
  ok &= Firebase.RTDB.setFloat(&fbdo, "/NPK/pH", pHval);
  ok &= Firebase.RTDB.setInt(&fbdo, "/NPK/moisture", moist);
  ok &= Firebase.RTDB.setInt(&fbdo, "/NPK/temperature", temp);
  ok &= Firebase.RTDB.setInt(&fbdo, "/NPK/humidity", hum);

  Serial.printf("Sent -> N:%d P:%d K:%d pH:%.1f Moist:%d T:%d H:%d   (ok=%d)\n",
                nitrogen, phosphorus, potassium, pHval, moist, temp, hum, ok ? 1 : 0);
}