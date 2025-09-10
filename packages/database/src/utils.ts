/**
 * Convert snake_case keys to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert object keys from snake_case to camelCase
 */
export function convertKeysToCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item)) as any
  }

  if (obj instanceof Date) {
    return obj as any
  }

  if (typeof obj !== 'object') {
    return obj
  }

  const converted: any = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Keep keys that start with underscore as-is (like _count)
      const camelKey = key.startsWith('_') ? key : snakeToCamel(key)
      converted[camelKey] = convertKeysToCamelCase(obj[key])
    }
  }
  return converted
}

/**
 * Convert camelCase keys to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * Convert object keys from camelCase to snake_case
 */
export function convertKeysToSnakeCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToSnakeCase(item)) as any
  }

  if (obj instanceof Date) {
    return obj as any
  }

  if (typeof obj !== 'object') {
    return obj
  }

  const converted: any = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = camelToSnake(key)
      converted[snakeKey] = convertKeysToSnakeCase(obj[key])
    }
  }
  return converted
}