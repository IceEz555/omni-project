export function validateTelemetry(data, profile) {
  const errors = [];
  const schema = profile.telemetry_schema;

  // 1) check required fields
  for (const field of schema.required_fields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // 2) check field types (basic)
  for (const [field, rule] of Object.entries(schema.fields)) {
    if (!(field in data)) continue;

    if (rule.type === "boolean" && typeof data[field] !== "boolean") {
      errors.push(`Field ${field} must be boolean`);
    }

    if (rule.type === "array" && !Array.isArray(data[field])) {
      errors.push(`Field ${field} must be array`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
