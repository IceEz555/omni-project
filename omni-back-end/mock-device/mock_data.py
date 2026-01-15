import json
import time
import random
from datetime import datetime
import paho.mqtt.client as mqtt

BROKER_URL = "localhost"
PORT = 1883

client = mqtt.Client()
client.connect(BROKER_URL, PORT)

while True:
    data = {
        "profile_id": "yoga_mat_v1",
        "device_id": "mat_001",
        "timestamp": int(time.time() * 1000),
        "pressure_map": [[random.randint(0, 100) for _ in range(8)] for _ in range(8)]
    }
    client.publish("iot/mat_001/telemetry", json.dumps(data))
    print("Sent:", data)
    time.sleep(1)