# Omni Serial Bridge: Developer Guide & Workflow

เอกสารนี้รวบรวม **ทุกสิ่งที่ Developer ต้องรู้** เกี่ยวกับระบบ `serial-bridge`
ตั้งแต่แนวคิดการออกแบบ, สิ่งที่แก้ไขไปล่าสุด, วิธีเพิ่มอุปกรณ์ใหม่ และตัวอย่างโค้ดฝั่ง Hardware

---

## 1. สิ่งที่ทีม Backend ทำไปแล้ว (Latest Updates)

เราได้อัปเกรด `serial-bridge` ให้เป็นระบบ **Dynamic & Universal** เพื่อลดภาระการแก้โค้ดในระยะยาว:

### ✅ 1.1 ระบบ Auto-Discovery (เลิกใช้ Hardcoded Port)

- **Old Way:** ต้องแก้ไฟล์ `const port = 'COM3'` ทุกครั้งที่ย้ายเครื่อง
- **New Way:** เขียน Script ให้สแกนหา Port อัตโนมัติ (`SerialPort.list()`) โดยจะเชื่อมต่อกับอุปกรณ์ที่มีชื่อผู้ผลิตว่า "Arduino" หรือ Port ที่เป็น USB Serial เองทันที
- **Benefit:** Plug & Play เสียบปุ๊บ ใช้งานได้ปั๊บ สายหลุดก็ต่อใหม่ให้เอง (Auto-Reconnect)

### ✅ 1.2 ระบบ Universal Translator (ล่ามสากล)

- **Old Way:** เขียน Logic แยกรายอุปกรณ์ (`if device == 'mat' do...`)
- **New Way:** รับข้อมูลเป็น **Format มาตรฐาน** แล้วส่งต่อให้ MQTT ทันทีโดยไม่สนใจไส้ใน
- **Benefit:** เพิ่ม Sensor ใหม่ (เช่น ความชื้น, แสง) ได้ **โดยไม่ต้องแก้โค้ด Backend เลย**

---

## 2. เจาะลึกการทำงานของโค้ด (`bridge.js`)

ไฟล์ `bridge.js` ทำงานเป็น Loop ง่ายๆ ดังนี้:

1.  **Start:** รันฟังก์ชัน `autoConnect()` เพื่อสแกนหา Arduino ทุกๆ 5 วินาที
2.  **Connect:** เมื่อเจอ Port -> เปิด Connection (Baud Rate 460800)
3.  **Listen:** รอรับข้อมูลทีละบรรทัด (`\n`)
4.  **Parse:** แปลงข้อมูลดิบจาก Arduino ให้เป็น JSON
    - Format ที่รับ: `DEVICE_ID | PROFILE_ID | JSON_DATA`
5.  **Publish:** ส่งต่อเข้า MQTT Topic: `iot/{DEVICE_ID}/telemetry`

---

## 3. Workflow การเพิ่มอุปกรณ์ใหม่ (Step-by-Step)

เมื่อต้องการเพิ่มอุปกรณ์ใหม่ (สมมติ: "Smart Chair") ให้ทำตามนี้:

### Step 1: ฝั่ง Hardware (Arduino Dev)

เขียนโค้ดโดย **ฝัง ID 2 ตัว** ลงไปในบอร์ด (ดูตัวอย่างโค้ดในหัวข้อถัดไป):

1.  **Profile ID:** ตั้งชื่อรุ่นอุปกรณ์ เช่น `smart_chair_v1`
2.  **Hardware ID:** ตั้งชื่อเฉพาะของบอร์ดนั้น เช่น `CHAIR_001`

### Step 2: ฝั่ง Admin (Web UI Config)

ไปที่หน้าเว็บเพื่อลงทะเบียนอุปกรณ์ (เพื่อให้ Backend รู้จัก):

1.  เมนู **Create Device Profile**:
    - ช่อง **Profile ID**: กรอก `smart_chair_v1` (ต้องตรงกับ Arduino)
    - ตั้งค่าการแสดงผล (เช่น เป็นกราฟเส้น หรือ ค่าตัวเลข)
2.  เมนู **Add Device**:
    - ช่อง **Hardware ID**: กรอก `CHAIR_001` (ต้องตรงกับ Arduino)
    - เลือก Profile เป็น "Smart Chair" ที่สร้างไว้

### Step 3: พร้อมใช้งาน!

- เสียบ Arduino -> Bridge รับค่า `CHAIR_001` -> Backend รู้ว่าเป็น "เก้าอี้ห้องทำงาน" -> Frontend โชว์กราฟทันที

---

## 4. ตัวอย่างโค้ด Arduino (.ino)

ฝากโค้ดนี้ให้ทีม Hardware เพื่อเป็นมาตรฐานการส่งข้อมูล:

```cpp
// --- CONFIGURATION ---
String PROFILE_ID  = "smart_chair_v1"; // ชื่อรุ่น (ตรงกับ Profile ID หน้าเว็บ)
String HARDWARE_ID = "CHAIR_001";      // ชื่อเครื่อง (ตรงกับ Hardware ID หน้าเว็บ)
// ---------------------

void loop() {
  // 1. อ่านค่า Sensor
  int pressure = analogRead(A0);

  // 2. ปั้นก้อน JSON
  String jsonData = "{\"val\": " + String(pressure) + "}";

  // 3. ส่งข้อมูลตาม Format: ID|ID|JSON
  // ผลลัพธ์: CHAIR_001|smart_chair_v1|{"val": 512}

  Serial.print(HARDWARE_ID);
  Serial.print("|");
  Serial.print(PROFILE_ID);
  Serial.print("|");
  Serial.println(jsonData);

  delay(100);
}
```

---

## 5. ความสัมพันธ์ Backend <-> UI (Mapping)

ทำไมต้องกรอก ID ในหน้าเว็บ? มันสัมพันธ์กันยังไง?

| UI Field        | Backend Logic              | ความหมาย                                                                                                                                 |
| :-------------- | :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Profile ID**  | `DeviceProfile.profile_id` | **"คู่มือแปลภาษา"**: บอกระบบว่าข้อมูลชุดนี้คืออะไร (เช่น เป็นเมทริกซ์ หรือเป็นค่าอุณหภูมิ) ถ้าไม่ตรงกัน ระบบจะแสดงผลไม่ถูก               |
| **Hardware ID** | `Device.serial_number`     | **"เลขบัตรประชาชน"**: ใช้ระบุว่าข้อมูลนี้มาจาก _อุปกรณ์ชิ้นไหน_ (เช่น ถ้ามีเก้าอี้ 2 ตัว รุ่นเดียวกัน Backend จะแยกออกได้ด้วย ID ตัวนี้) |

---

## 6. คำแนะนำสำหรับการพัฒนาต่อ (Future Work)

- **Multiple Devices:** ปัจจุบันระบบ Auto-Discovery เลือกอุปกรณ์ตัวแรกที่เจอ หากต้องเสียบหลายตัวพร้อมกัน อาจต้องปรับ Logic ให้ Loop เชื่อมต่อทุก Port ที่เจอ
- **Bidirectional:** ตอนนี้รับข้อมูลขาเดียว (Arduino -> Web) หากต้องการสั่งงานกลับ (Web -> เปิดไฟ Arduino) ต้องเพิ่ม Logic `mqtt.subscribe` ใน `bridge.js`
