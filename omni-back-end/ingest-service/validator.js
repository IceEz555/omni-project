export function validateTelemetry(data, profile) {
  const errors = [];
  const schema = profile.telemetry_schema;

  // 1) check required fields (จาก fields[].required === true)
  for (const fieldDef of schema.fields) {
    if (fieldDef.required && !(fieldDef.name in data)) {
      errors.push(`Missing required field: ${fieldDef.name}`);
    }
  }

  // 2) check field types (basic)
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
