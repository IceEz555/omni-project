# Ingest Service Documentation

## 📋 Overview

Ingest Service เป็นบริการหลัก (Core Component) ในระบบ Omni ที่ทำหน้าที่รับข้อมูลเซนเซอร์ (Telemetry) จากอุปกรณ์ IoT ต่างๆ รองรับการรับข้อมูลทั้งแบบ **Real-time (MQTT)** และ **REST API (HTTP)**

ระบบมีความสามารถในการตรวจสอบความถูกต้องของข้อมูล (Validation) ตาม **Device Profile** ที่กำหนดไว้ และบันทึกข้อมูลลง Time-series Database (InfluxDB) เพื่อนำไปใช้งานต่อ

---

## 🏗️ Architecture

```
┌─────────────┐       ┌─────────────┐
│  IoT Device │       │ HTTP Device │
└──────┬──────┘       └──────┬──────┘
       │ MQTT Protocol       │ HTTP POST
       ▼                     ▼
┌───────────────────────────────────────┐
│           Ingest Service              │
│  ┌───────────┐         ┌───────────┐  │
│  │ MQTT Cli  │         │  API Svr  │  │
│  └─────┬─────┘         └─────┬─────┘  │
│        │                     │        │
│        ▼                     ▼        │
│  ┌─────────────────────────────────┐  │
│  │         Shared Logic            │  │
│  │  (Profile Loader + Validator)   │  │
│  └────────────────┬────────────────┘  │
│                   │                   │
│          ┌────────┴───────┐           │
│          │  InfluxWriter  │           │
│          └────────┬───────┘           │
└───────────────────┼───────────────────┘
                    │ Writes
                    ▼
           ┌─────────────────┐
           │     InfluxDB    │
           └─────────────────┘
```

---

## ✨ Key Features

1.  **Multi-Protocol Support**: รองรับทั้ง MQTT (Port 1883) และ HTTP (Port 3000)
2.  **Dynamic Device Profiles**: เพิ่ม/แก้ไข Profile ของอุปกรณ์ใหม่ได้ทันทีผ่าน API (ไม่ต้อง Restart Service)
3.  **Strict Validation**: ตรวจสอบข้อมูลละเอียด (Matrix Dimensions, Data Types, Timestamps)
4.  **Structured Logging**: Log แยกระดับความรุนแรง (INFO, WARN, ERROR)
5.  **InfluxDB Integration**: บันทึกข้อมูล Time-series อัตโนมัติ

---

## 📁 File Structure

```
ingest-service/
├── index.js                  # Entry point (Main)
├── api.js                    # Express API Server
├── mqttClient.js             # MQTT Message Handler
├── ingestLogic.js            # Shared processing logic (Unified)
├── validator.js              # Data validation rules
├── profileLoader.js          # Device profile management
├── influxWriter.js           # Database writer
├── device_profiles/          # Device configuration files
│   ├── index.json            # Registry file
│   └── *.json                # Profile definitions
└── Test/                     # Verification Scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- InfluxDB Server
- MQTT Broker (e.g., Mosquitto)

### 2. Configuration (`.env`)

สร้างไฟล์ `.env` และกำหนดค่าดังนี้:

```env
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=my-token
INFLUX_ORG=my-org
INFLUX_BUCKET=my-bucket
MQTT_BROKER=mqtt://localhost:1883
PORT=3000
```

### 3. Installation & Run

```bash
npm install
node index.js
```

---

## 🔌 API Documentation

Service นี้มาพร้อมกับ REST API สำหรับจัดการ Device Profile และรับข้อมูล

> **ดูรายละเอียดเต็มๆ ได้ที่ [API_DOCS.md](./API_DOCS.md)**

### Quick Reference

| Method   | Endpoint           | Description                   |
| :------- | :----------------- | :---------------------------- |
| **GET**  | `/device-profiles` | ดูรายชื่อ Profile ทั้งหมด     |
| **POST** | `/device-profiles` | เพิ่ม/อัปเดต Profile ใหม่     |
| **POST** | `/telemetry`       | ส่งข้อมูล Telemetry ผ่าน HTTP |

---

## 🛡️ Validation System

ระบบ Validator (`validator.js`) จะตรวจสอบข้อมูลตาม Rules ใน Profile:

- **Missing Fields**: ข้อมูลต้องมี Field ที่ระบุ `required: true`
- **Data Types**: เช็ค `boolean`, `number`, `matrix`
- **Matrix Checks**: ตรวจสอบขนาด (`rows` x `cols`) และชนิดข้อมูลภายใน Matrix
- **Timestamp**: ต้องมี `timestamp` ที่ถูกต้อง (ISO String หรือ Epoch)

**ตัวอย่าง Error Response:**

```json
{
  "success": false,
  "error": "Validation Failed",
  "details": [
    {
      "field": "pressure_map",
      "type": "INVALID_DIMENSION",
      "message": "Expected 32 rows, got 10"
    }
  ]
}
```

---

## 🧪 Verification

มี Script สำหรับทดสอบระบบเตรียมไว้ให้ในโฟลเดอร์ `Test/` (หรือ root):

- **ทดสอบความทนทาน (Hardening)**:
  ```bash
  node verify_hardening.js
  ```
- **ทดสอบ API**:
  ```bash
  node verify_api.js
  ```

---

**Last Updated**: January 19, 2026
