#include <Arduino.h>

// --- Configuration ---
#define TRIG_PIN 9
#define ECHO_PIN 10

// Change these to match what you created in Admin Dashboard
String DEVICE_ID = "Arduino_Ult_01"; 
String PROFILE_ID = "ultrasonic_sensor"; 

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  long duration;
  float distance;

  // 1. Measure Distance (Your original code)
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;

  // 2. Format Data for Gateway
  // Format: DEVICE_ID|PROFILE_ID|JSON
  
  String json = "{\"distance\": " + String(distance) + "}";
  String payload = DEVICE_ID + "|" + PROFILE_ID + "|" + json;

  // 3. Send via Serial
  Serial.println(payload);
  // Print debug (Optional: Gateway might ignore lines not starting with ID if logic was stricter, 
  
  delay(10000); 
}
