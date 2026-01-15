export function validateTelemetry(data, profile) {
  const errors = []; // สร้างตะกร้าเก็บข้อผิดพลาด
  const schema = profile.telemetry_schema; // ดึงส่วน schema ออกมาจาก profile

  // Loop 1: เช็ค Field ที่จำเป็น (Required) (จาก fields[].required === true)
  for (const fieldDef of schema.fields) {
    if (fieldDef.required && !(fieldDef.name in data)) {
      errors.push(`Missing required field: ${fieldDef.name}`);
    }
  }

  // Loop 2: เช็คประเภทข้อมูล (Type Check)
  for (const fieldDef of schema.fields) {
    const name = fieldDef.name;
    if (!(name in data)) continue;

    const value = data[name];

    if (fieldDef.type === "boolean" && typeof value !== "boolean") {
      errors.push(`Field ${name} must be boolean`);
    }

    if (fieldDef.type === "matrix" && !Array.isArray(value)) {
      errors.push(`Field ${name} must be matrix (array)`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
