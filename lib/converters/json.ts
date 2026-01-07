/**
 * JSON utilities:
 * - parse JSON aman dengan error message yang lebih ramah
 * - stringify pretty untuk output
 */

export function parseJsonOrThrow(inputText: string): unknown {
  try {
    return JSON.parse(inputText);
  } catch {
    throw new Error("JSON tidak valid. Pastikan format JSON benar.");
  }
}

export function stringifyJsonPretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
