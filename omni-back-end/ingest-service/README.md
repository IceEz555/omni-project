# Ingest Service Documentation

## 📋 Overview

Ingest Service เป็นบริการที่รับและประมวลผลข้อมูลเซนเซอร์ (telemetry) จากอุปกรณ์ IoT ผ่าน MQTT Broker เป็นส่วนสำคัญของระบบ Omni ในการรับข้อมูลแบบ real-time จากอุปกรณ์ต่างๆ เช่น yoga mat, IMU sensor เป็นต้น

---

## 🏗️ Architecture

```
┌─────────────┐
│  IoT Device │
└──────┬──────┘
       │ MQTT Protocol
       ▼
┌─────────────────────────┐
│   MQTT Broker (Port 1883)│
└──────┬──────────────────┘
       │ Subscribe: iot/+/+/telemetry
       ▼
┌──────────────────────────────┐
│    Ingest Service            │
│  ┌────────────────────────┐  │
│  │   MQTT Client          │  │
│  │ ┌────────────────────┐ │  │
│  │ │ Profile Loader     │ │  │
│  │ └────────────────────┘ │  │
│  │ ┌────────────────────┐ │  │
│  │ │ Telemetry Validator│ │  │
│  │ └────────────────────┘ │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
       │
       ▼ (Valid Data)
   Processing/Storage
```

---

## 📁 File Structure

```
ingest-service/
├── index.js                 # Entry point - เริ่มต้นบริการ
├── mqttClient.js            # MQTT connection & message handling
├── profileLoader.js         # Device profile management
├── validator.js             # Data validation logic
├── package.json             # Dependencies
└── device_profiles/         # Device configuration files
    ├── index.json           # Profile registry/index
    ├── yoga_mat_v1.json     # Yoga mat device profile
    └── accel_3axis_v1.json  # 3-axis accelerometer profile (referenced)
```

---

## 🔧 Core Components

### 1. **index.js** - Entry Point
**ความสำคัญ**: จุดเริ่มต้นของบริการ

```javascript
import { startMqtt } from "./mqttClient.js";
startMqtt();
```

**หน้าที่**:
- เรียกใช้งาน MQTT client
- เริ่มต้นการฟังข้อมูลจากอุปกรณ์

---

### 2. **mqttClient.js** - MQTT Client & Message Handler
**ความสำคัญ**: หัวใจของการรับข้อมูล realtime

**คำที่สำคัญ**:
- `BROKER_URL`: เชื่อมต่อไปยัง MQTT Broker ที่ localhost:1883
- `TOPIC`: `iot/+/+/telemetry` สำหรับฟังข้อมูลจากอุปกรณ์ทั้งหมด
  - `+` = wildcard ซึ่งหมายถึง device_id, location, etc.

**Flow**:
```
1. client.on("connect") 
   → เชื่อมต่อสำเร็จกับ MQTT Broker
   → Subscribe topic iot/+/+/telemetry

2. client.on("message")
   → รับข้อมูล JSON จากอุปกรณ์
   → ตรวจสอบ profile_id ว่ามี
   → Load profile configuration
   → Validate ข้อมูล
   → ถ้า valid → accept (log success)
   → ถ้า invalid → reject (log errors)
```

**ข้อมูล Input ที่คาดหวัง**:
```json
{
  "device_id": "device_001",
  "profile_id": "yoga_mat_v1",
  "timestamp": 1673456789,
  "pressure_matrix": [[1,2,3...], [4,5,6...]...],
  "movement_status": true
}
```

---

### 3. **profileLoader.js** - Device Profile Management
**ความสำคัญ**: กำหนด schema และ validation rules สำหรับแต่ละประเภทอุปกรณ์

**หน้าที่**:
- อ่านไฟล์ `device_profiles/index.json` (registry)
- ค้นหา profile ที่ตรงกับ `profile_id` ที่ส่งมา
- โหลด profile configuration ที่เกี่ยวข้อง
- ส่ง schema กลับไปให้ validator ใช้

**ตัวอย่าง**:
```javascript
// Input: profileId = "yoga_mat_v1"
const profile = loadProfile("yoga_mat_v1");
// Output: 
{
  "profile_id": "yoga_mat_v1",
  "device_type": "yoga_mat",
  "telemetry_schema": { ... }
}
```

---

### 4. **validator.js** - Data Validation
**ความสำคัญ**: ตรวจสอบความถูกต้องของข้อมูลตามมาตรฐาน

**Validation Rules**:

1. **Required Fields Check**
   - ตรวจสอบว่าฟิลด์ที่กำหนด `required: true` มีค่าอยู่
   ```javascript
   if (fieldDef.required && !(fieldDef.name in data)) {
     errors.push(`Missing required field: ${fieldDef.name}`);
   }
   ```

2. **Type Checking**
   - ตรวจสอบประเภทของข้อมูล (boolean, matrix, etc.)
   ```javascript
   if (fieldDef.type === "boolean" && typeof value !== "boolean") {
     errors.push(`Field ${name} must be boolean`);
   }
   ```

3. **Matrix Validation**
   - ตรวจสอบว่า pressure_matrix เป็น array
   ```javascript
   if (fieldDef.type === "matrix" && !Array.isArray(value)) {
     errors.push(`Field ${name} must be matrix (array)`);
   }
   ```

**Output**:
```javascript
{
  valid: true/false,
  errors: ["error message 1", "error message 2"]
}
```

---

## 📊 Device Profiles

### **Profile Registry** (`device_profiles/index.json`)
```json
{
  "profiles": [
    { "profile_id": "yoga_mat_v1", "file": "yoga_mat_v1.json" },
    { "profile_id": "accel_3axis_v1", "file": "accel_3axis_v1.json" }
  ]
}
```
**ความสำคัญ**: Central registry ที่ช่วยให้ระบบรู้ว่าอุปกรณ์แต่ละประเภทมีไฟล์ configuration ที่ไหน

### **Device Profile** (`yoga_mat_v1.json`)
```json
{
  "profile_id": "yoga_mat_v1",
  "device_type": "yoga_mat",
  "telemetry_schema": {
    "fields": [
      {
        "name": "pressure_matrix",
        "type": "matrix",
        "rows": 32,
        "cols": 32,
        "required": true
      },
      {
        "name": "movement_status",
        "type": "boolean",
        "required": true
      }
    ]
  }
}
```

**อธิบาย**:
- `pressure_matrix`: ความดันที่เซนเซอร์จำนวน 32×32 = 1024 points
- `movement_status`: สถานะการเคลื่อนไหว (true/false)
- `required: true`: ฟิลด์ที่ต้องส่งมาเสมอ

---

## 🔄 Data Flow Example

### ✅ Success Case
```
1. Yoga Mat Device ส่งข้อมูล:
   {
     "device_id": "mat_001",
     "profile_id": "yoga_mat_v1",
     "pressure_matrix": [[...32x32...]],
     "movement_status": true
   }

2. mqttClient.js รับข้อมูล
   → ตรวจสอบ profile_id ✓
   → profileLoader.loadProfile("yoga_mat_v1") ✓

3. validator.js ตรวจสอบ
   → pressure_matrix exists ✓
   → movement_status exists ✓
   → pressure_matrix is array ✓
   → movement_status is boolean ✓

4. ✅ Result: ACCEPTED
   → Log: "✅ Accepted telemetry"
   → Data ready for processing
```

### ❌ Failure Case
```
1. Device ส่งข้อมูลขาดช่อง:
   {
     "device_id": "mat_002",
     "profile_id": "yoga_mat_v1",
     "movement_status": true
     // ❌ Missing pressure_matrix
   }

2. Validator ตรวจสอบ
   → pressure_matrix missing ✗

3. ❌ Result: REJECTED
   → Log: "❌ Rejected telemetry: Missing required field: pressure_matrix"
   → Data discarded
```

---

## 🚀 Usage

### Start Service
```bash
npm install
node index.js
```

### Expected Output
```
🚀 Ingest Service starting...
✅ Connected to MQTT broker
✅ Accepted telemetry { device_id: 'mat_001', profile_id: 'yoga_mat_v1', timestamp: 1673456789 }
```

---

## 🛠️ Adding New Device Type

### Step 1: Create Profile File
สร้าง `device_profiles/imu_sensor_v1.json`:
```json
{
  "profile_id": "imu_sensor_v1",
  "device_type": "imu",
  "telemetry_schema": {
    "fields": [
      { "name": "accel_x", "type": "number", "required": true },
      { "name": "accel_y", "type": "number", "required": true },
      { "name": "accel_z", "type": "number", "required": true }
    ]
  }
}
```

### Step 2: Register in index.json
```json
{
  "profiles": [
    { "profile_id": "yoga_mat_v1", "file": "yoga_mat_v1.json" },
    { "profile_id": "imu_sensor_v1", "file": "imu_sensor_v1.json" }
  ]
}
```

### Step 3: Devices can now send data with `profile_id: "imu_sensor_v1"`

---

## 📋 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `mqtt` | ^5.14.1 | MQTT client library สำหรับเชื่อมต่อ Broker |

---

## ⚠️ Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing profile_id` | ข้อมูลจาก device ไม่มี profile_id | เพิ่ม profile_id ใน device data |
| `Profile not found` | profile_id ไม่เจอในระบบ | ตรวจสอบ device_profiles/index.json |
| `Missing required field` | ฟิลด์ที่จำเป็นขาด | ส่งข้อมูลครบตามที่ schema กำหนด |
| `Field must be boolean` | Type ของข้อมูลไม่ถูก | ตรวจสอบประเภทข้อมูลใน device |

---

## 🔒 Security Considerations

- [ ] Add authentication/authorization to MQTT broker
- [ ] Validate profile_id is not user-controlled without verification
- [ ] Add rate limiting for MQTT messages
- [ ] Encrypt sensitive data in telemetry
- [ ] Add logging/monitoring for suspicious activities

---

## 📈 Future Enhancements

1. **Database Integration**: เก็บข้อมูล valid telemetry ไปยัง database
2. **Extended Validation**: Support for more data types (numbers, strings, nested objects)
3. **Transformation Pipeline**: Transform data ตามกฎที่กำหนด
4. **Performance Metrics**: Monitor throughput และ latency
5. **Graceful Shutdown**: Handle process termination properly
6. **Configuration Management**: Support environment-based settings

---

## 📞 Support

หากพบปัญหาในการใช้งาน:
1. ตรวจสอบ logs ในคำสั่ง `node index.js`
2. ตรวจสอบว่า MQTT Broker chạยอยู่
3. ตรวจสอบ device profile configuration
4. ตรวจสอบข้อมูลที่ส่งมาจาก device

---

**Last Updated**: January 15, 2026
