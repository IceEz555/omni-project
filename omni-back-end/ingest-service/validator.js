export function validateTelemetry(data, profile) {
  const errors = [];
  const schema = profile.telemetry_schema;

  // 1. Common Field Validation (e.g., timestamp)
  if (!data.timestamp) {
    errors.push({ field: "timestamp", type: "MISSING_FIELD", message: "Timestamp is required by system" });
  } else {
    const ts = new Date(data.timestamp).getTime();
    if (isNaN(ts)) {
      errors.push({ field: "timestamp", type: "INVALID_TYPE", message: "Timestamp must be a valid ISO string or number" });
    }
  }

  // 2. Schema Field Validation
  for (const fieldDef of schema.fields) {
    const name = fieldDef.name;
    const value = data[name];

    // Check Required
    if (fieldDef.required && value === undefined) {
      errors.push({ field: name, type: "MISSING_FIELD", message: `Missing required field: ${name}` });
      continue;
    }

    // Skip if optional and missing
    if (value === undefined) continue;

    // Type Checking
    if (fieldDef.type === "boolean") {
      if (typeof value !== "boolean") {
        errors.push({ field: name, type: "INVALID_TYPE", message: `Field ${name} must be boolean` });
      }
    } else if (fieldDef.type === "matrix") {
      if (!Array.isArray(value)) {
        errors.push({ field: name, type: "INVALID_TYPE", message: `Field ${name} must be an array (matrix)` });
      } else {
        // Matrix Size Check
        if (fieldDef.rows && value.length !== fieldDef.rows) {
          errors.push({ field: name, type: "INVALID_DIMENSION", message: `Field ${name} must have ${fieldDef.rows} rows, got ${value.length}` });
        }
        // Matrix Element Check (assuming array of numbers or array of arrays)
        // Check if flat matrix or 2D. Let's assume 2D based on "rows/cols" description typically, 
        // OR it could be 1D depending on implementation. 
        // Looking at 'influxWriter.js' -> data.pressure_map.length, it is likely a 1D or 2D structure.
        // Let's implement generic check for "total elements" or structure if usually 1D for influx.
        // Actually, typical IoT matrixes might be flattened. 
        // Use recursive or flat check? 
        // Let's check if elements are numbers.
        const isAllNumbers = value.every(item => typeof item === "number");
        if (!isAllNumbers) {
             // If not numbers, maybe arrays?
             const isArrayOfArrays = value.every(item => Array.isArray(item));
             if (isArrayOfArrays) {
                 // Deep check number
                 const deepNumbers = value.every(row => row.every(col => typeof col === "number"));
                 if(!deepNumbers) {
                     errors.push({ field: name, type: "INVALID_ELEMENT", message: `Field ${name} elements must be numbers` });
                 }
             } else {
                 errors.push({ field: name, type: "INVALID_ELEMENT", message: `Field ${name} elements must be numbers` });
             }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
