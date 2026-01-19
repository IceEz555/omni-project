import json
import time
import random
from datetime import datetime
import paho.mqtt.client as mqtt

BROKER = "localhost"
PORT = 1883
TOPIC = "iot/yoga/yoga_mat_001/telemetry"


client = mqtt.Client()
client.connect(BROKER, PORT)

while True:
    data = {
        "device_id": "yoga_mat_001",
        "profile_id": "yoga_mat_v1",
        "device_id": "mat_001",
        "timestamp": int(time.time() * 1000),
        "pressure_map": [[random.randint(0, 100) for _ in range(32)] for _ in range(32)],
        "movement_status": random.choice([True, False])
    }
    client.publish("iot/mat_001/telemetry", json.dumps(data))
    print("Sent:", data)
    time.sleep(5)
