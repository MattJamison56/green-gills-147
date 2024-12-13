#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <OneWire.h>
#include <DS18B20.h>
#include <time.h>

// Optional Libraries (Not used in this code snippet)
// #include <LittleFS.h>
// #include <SD.h>
// #include <Update.h>

// --------------------------
// Configuration Parameters
// --------------------------

// Wi-Fi credentials
const char *ssid = "Matt";          // Replace with your Wi-Fi SSID
const char *password = "abc123abc"; // Replace with your Wi-Fi password

// NTP Configuration
const char *ntpServer = "pool.ntp.org"; // NTP server
const long gmtOffset_sec = 0;           // Adjust according to your timezone
const int daylightOffset_sec = 0;       // Adjust if daylight saving is applicable

// Firebase configuration
#define FIREBASE_HOST "green-gills-default-rtdb.firebaseio.com"     // Firebase Realtime Database URL (without https://)
#define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET_OR_AUTH_TOKEN" // Replace with your Firebase Database Secret or Auth Token
#define API_KEY "AIzaSyBkfvZ18pQAE5KZnNm0Rya1B1QHWUyfCbU"           // Your Firebase API key

const char *firebase_email = "mjamiso1@uci.edu"; // Firebase email
const char *firebase_password = "565656";        // Firebase password

// DS18B20 Temperature Sensor setup
#define ONE_WIRE_BUS 33 // Pin connected to the DS18B20 data line
OneWire oneWire(ONE_WIRE_BUS);
DS18B20 sensor(&oneWire);

// Inland TDS Meter V1.0 setup
#define TDS_PIN 32              // Pin connected to the TDS sensor
const int sampleTime = 64;      // Number of samples for ADC averaging
const float vRef = 3.3;         // Reference voltage for ESP32 ADC
const int adcResolution = 4095; // 12-bit ADC

// Calibration coefficients for Inland TDS Meter V1.0
// **IMPORTANT:** Calibrate these values based on your sensor's calibration process.
const float tdsCalibrationFactor = 606.06; // Example: ppm per Volt (Replace with your calibrated value)

// pH Sensor setup
#define PH_PIN 39                       // Pin connected to the pH sensor
const int phSampleTime = 64;            // Number of samples for ADC averaging
const float phCalibrationSlope = 6.0;   // Replace with your calibrated slope
const float phCalibrationOffset = -4.0; // Replace with your calibrated offset

// --------------------------
// Firebase Objects
// --------------------------
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// --------------------------
// Function Prototypes
// --------------------------
void sendToFirebase(const String &datetime, float temp_f, float tds, float ph);
float readTDS();
float readPH();

// --------------------------
// Setup Function
// --------------------------
void setup()
{
  Serial.begin(9600);
  Serial.println("Starting DS18B20, Inland TDS Sensor, pH Sensor, and Firebase Integration...");

  // Initialize Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");

  // Initialize time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Fetching time from NTP...");

  struct tm timeinfo;
  int retry = 0;
  const int maxRetries = 10;
  const int retryDelay = 1000; // 1 second

  while (!getLocalTime(&timeinfo, 5000) && retry < maxRetries)
  {
    Serial.println("Failed to obtain time. Retrying...");
    retry++;
    delay(retryDelay);
  }

  if (retry < maxRetries)
  {
    Serial.println(&timeinfo, "Current time: %Y-%m-%d %H:%M:%S");
  }
  else
  {
    Serial.println("Failed to obtain time after multiple attempts.");
  }

  // Print system time for debugging
  time_t now;
  time(&now);
  Serial.print("Epoch Time: ");
  Serial.println(now);

  // Configure Firebase
  config.host = FIREBASE_HOST;
  config.api_key = API_KEY;

  // Firebase Authentication
  auth.user.email = firebase_email;
  auth.user.password = firebase_password;

  // Initialize Firebase and authenticate
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Authenticating with Firebase...");
  while (!Firebase.ready())
  {
    Serial.println("Connecting to Firebase...");
    delay(1000);
  }
  Serial.println("Firebase ready and authenticated!");

  // Initialize the DS18B20 sensor
  if (!sensor.begin())
  {
    Serial.println("DS18B20 sensor initialization failed! Check wiring.");
    while (1)
      ; // Halt if sensor initialization fails
  }
  Serial.println("DS18B20 sensor initialized.");

  // Initialize ADC for TDS sensor
  analogReadResolution(12);                   // 12-bit resolution
  analogSetPinAttenuation(TDS_PIN, ADC_11db); // Configure attenuation for 0-3.9V range
  Serial.println("Inland TDS sensor initialized on pin 32.");

  // Initialize ADC for pH sensor
  analogSetPinAttenuation(PH_PIN, ADC_11db); // Configure attenuation for 0-3.9V range
  Serial.println("pH sensor initialized on pin 39.");
}

// --------------------------
// Loop Function
// --------------------------
void loop()
{
  // Get current time
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo, 5000)) // 5 seconds timeout
  {
    Serial.println("Failed to obtain time");
    return;
  }

  char datetime[25];
  strftime(datetime, sizeof(datetime), "%Y-%m-%d %H:%M:%S", &timeinfo);

  // Read temperature
  sensor.requestTemperatures();

  while (!sensor.isConversionComplete())
  {
    delay(1); // Wait for temperature conversion
  }

  float temp_c = sensor.getTempC();
  if (temp_c == DEVICE_DISCONNECTED)
  {
    Serial.println("Error: DS18B20 sensor disconnected or not responding!");
  }
  else
  {
    float temp_f = (temp_c * 9.0 / 5.0) + 32.0; // Convert to Fahrenheit
    Serial.print("Temperature: ");
    Serial.print(temp_f);
    Serial.println(" °F");

    // Read TDS
    float tds = readTDS();
    Serial.print("TDS: ");
    Serial.println(tds);

    // Read pH
    float ph = readPH();
    Serial.print("pH: ");
    Serial.println(ph);

    // Send data to Firebase
    sendToFirebase(String(datetime), temp_f, tds, ph);
  }

  delay(5000); // Wait 10 seconds before next reading
}

// --------------------------
// Function Definitions
// --------------------------

// Function to send data to Firebase
void sendToFirebase(const String &datetime, float temp_f, float tds, float ph)
{
  // Prepare JSON objects
  FirebaseJson temperatureJson;
  temperatureJson.add("timestamp", datetime);
  temperatureJson.add("temp_fahrenheit", temp_f);

  FirebaseJson tdsJson;
  tdsJson.add("datetime", datetime);
  tdsJson.add("tds_value", tds);

  FirebaseJson phJson;
  phJson.add("datetime", datetime);
  phJson.add("ph_value", ph);

  // Push temperature data to Firebase
  if (Firebase.pushJSON(firebaseData, "/pond1/temperatureData", temperatureJson))
  {
    Serial.println("Temperature data sent to Firebase successfully!");
  }
  else
  {
    Serial.print("Failed to send temperature data to Firebase: ");
    Serial.println(firebaseData.errorReason());
  }

  // Push TDS data to Firebase
  if (Firebase.pushJSON(firebaseData, "/pond1/tdsData", tdsJson))
  {
    Serial.println("TDS data sent to Firebase successfully!");
  }
  else
  {
    Serial.print("Failed to send TDS data to Firebase: ");
    Serial.println(firebaseData.errorReason());
  }

  // Push pH data to Firebase
  if (Firebase.pushJSON(firebaseData, "/pond1/phData", phJson))
  {
    Serial.println("pH data sent to Firebase successfully!");
  }
  else
  {
    Serial.print("Failed to send pH data to Firebase: ");
    Serial.println(firebaseData.errorReason());
  }
}

// Function to read TDS value from Inland TDS Meter V1.0
float readTDS()
{
  // Read multiple samples and average them for stability
  long adcSum = 0;
  for (int i = 0; i < sampleTime; i++)
  {
    adcSum += analogRead(TDS_PIN);
    delay(10); // Delay between samples to stabilize readings
  }
  float adcAverage = adcSum / (float)sampleTime;
  float voltage = adcAverage * (vRef / adcResolution);

  // Debugging: Print raw ADC and voltage values
  Serial.print("ADC Average (TDS): ");
  Serial.println(adcAverage);
  Serial.print("Voltage (TDS): ");
  Serial.println(voltage);

  // Convert voltage to TDS value using calibration factor
  float tdsValue = tdsCalibrationFactor * voltage;

  // Optional: Implement minimum and maximum TDS limits to avoid unrealistic values
  if (tdsValue < 0)
    tdsValue = 0;

  return tdsValue;
}

// Function to read pH value from pH Sensor
float readPH()
{
  // Read multiple samples and average them for stability
  long adcSum = 0;
  for (int i = 0; i < phSampleTime; i++)
  {
    adcSum += analogRead(PH_PIN);
    delay(10); // Delay between samples to stabilize readings
  }
  float adcAverage = adcSum / (float)phSampleTime;
  float voltage = adcAverage * (vRef / adcResolution);

  // Debugging: Print raw ADC and voltage values
  Serial.print("ADC Average (pH): ");
  Serial.println(adcAverage);
  Serial.print("Voltage (pH): ");
  Serial.println(voltage);

  // Convert voltage to pH value using calibration coefficients
  float phValue = (voltage * phCalibrationSlope) + phCalibrationOffset;

  // Optional: Clamp pH value to realistic range
  if (phValue < 0)
    phValue = 0;
  if (phValue > 14)
    phValue = 14;

  return phValue;
}
