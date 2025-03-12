export const sanitizeData = <T extends Record<string, any>>(data: T): Record<string, any> => {
  if (!data) return data;

  const sanitized: Record<string, any> = { ...data };

  // Remove buffer objects and convert to plain objects
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key]?.buffer) {
      delete sanitized[key].buffer;
    }
    
    // Recursively sanitize nested objects
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });

  return sanitized as T;
};