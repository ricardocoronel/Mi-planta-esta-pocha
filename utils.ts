/**
 * Safely retrieves environment variables in various environments (Vite, Next.js, Standard Node).
 * It checks import.meta.env first (Vite), then process.env.
 * It also automatically checks for VITE_ prefixed versions of the keys.
 */
export const getEnv = (keys: string | string[]): string | undefined => {
  const keyList = Array.isArray(keys) ? keys : [keys];

  // Helper to check a specific key in a specific object
  const checkObject = (obj: any, key: string) => {
    if (!obj) return undefined;
    // Check exact key
    if (obj[key]) return obj[key];
    // Check VITE_ prefix (common in Vite)
    if (obj[`VITE_${key}`]) return obj[`VITE_${key}`];
    // Check REACT_APP_ prefix (common in CRA)
    if (obj[`REACT_APP_${key}`]) return obj[`REACT_APP_${key}`];
    return undefined;
  };

  for (const key of keyList) {
    // 1. Try Vite / Modern Browsers (import.meta.env)
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        const val = checkObject(import.meta.env, key);
        if (val) return val;
      }
    } catch (e) {
      // Ignore errors accessing import.meta
    }

    // 2. Try Standard Node / Webpack (process.env)
    try {
      if (typeof process !== 'undefined' && process.env) {
        const val = checkObject(process.env, key);
        if (val) return val;
      }
    } catch (e) {
      // Ignore errors accessing process
    }
  }

  return undefined;
};

/**
 * Converts a File object to a Base64 string (without the data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data-URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
