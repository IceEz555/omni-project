#include "DHT.h"

// --- CONFIGURATION ---
#define DHTPIN 2     // DHT11 Data Pin
#define DHTTYPE DHT11

#define TRIG_PIN 9   // HC-SR04 Trig
#define ECHO_PIN 10  // HC-SR04 Echo

#define DEVICE_ID "Arduino_Sensors_01"
#define PROFILE_ID "multi_sensor"

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200); // Must match Gateway Baud Rate
  
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  dht.begin();
  
  // Wait a bit for serial to stabilize
  delay(2000);
}

void loop() {
  // 1. Read Distance (HC-SR04)
  long duration, distance;
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  duration = pulseIn(ECHO_PIN, HIGH);
  distance = (duration / 2) / 29.1; // Convert to CM

  // 2. Read Temp/Humidity (DHT11)
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Check if reads failed
  if (isnan(h) || isnan(t)) {
    // Retry next loop, send dummy or partial data?
    // adhering to fail-soft, will try to send just distance if dht fails
    h = 0.0; 
    t = 0.0;
  }

  // 3. Format & Send Data
  // Format: DEVICE_ID|PROFILE_ID|JSON_DATA
  // Output: Arduino_Sensors_01|multi_sensor|{"distance":25,"temperature":30.5,"humidity":60}
  
  Serial.print(DEVICE_ID);
  Serial.print("|");
  Serial.print(PROFILE_ID);
  Serial.print("|");
  
  Serial.print("{\"distance\":");
  Serial.print(distance);
  Serial.print(",\"temperature\":");
  Serial.print(t);
  Serial.print(",\"humidity\":");
  Serial.print(h);
  Serial.println("}");

  // Send every 500ms (Fast enough for real-time, slow enough for DHT11)
  delay(500); 
}
