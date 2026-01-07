import Papa from "papaparse";

/**
 * CSV <-> JSON rules (MVP):
 * - CSV -> JSON: baris pertama dianggap header (key).
 * - JSON -> CSV: hanya mendukung array of objects atau single object.
 * - Nested object/array: akan jadi "[object Object]" jika dipaksa.
 *   Untuk MVP, kita kasih error kalau mendeteksi nested.
 */

function hasNestedValue(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((v) => typeof v === "object" && v !== null);
}

export function csvToJsonText(inputText: string): string {
  const result = Papa.parse<Record<string, string>>(inputText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors?.length) {
    throw new Error("CSV tidak valid. Periksa delimiter, quote, atau struktur kolom.");
  }

  // Jika header kosong, papaparse biasanya menghasilkan field kosong atau {}
  const data = result.data ?? [];
  if (!data.length) {
    throw new Error("CSV kosong atau tidak memiliki data.");
  }

  // Validasi header: minimal ada 1 key yang meaningful
  const keys = Object.keys(data[0] ?? {}).map((k) => k.trim()).filter(Boolean);
  if (keys.length === 0) {
    throw new Error("CSV tidak memiliki header. Untuk MVP, baris pertama wajib header.");
  }

  return JSON.stringify(data, null, 2);
}

export function jsonTextToCsv(inputText: string): string {
  let parsed: unknown;

  try {
    parsed = JSON.parse(inputText);
  } catch {
    throw new Error("JSON tidak valid. Tidak bisa dikonversi ke CSV.");
  }

  // Normalisasi menjadi array of objects
  const rows: Record<string, unknown>[] =
    Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [parsed as Record<string, unknown>];

  if (!rows.length) throw new Error("JSON array kosong. Tidak ada data untuk dijadikan CSV.");

  // Validasi tipe
  const allObjects = rows.every((r) => r && typeof r === "object" && !Array.isArray(r));
  if (!allObjects) {
    throw new Error("Untuk JSON -> CSV, data harus berupa object atau array of objects.");
  }

  // Cek nested
  if (rows.some((r) => hasNestedValue(r))) {
    throw new Error(
      "JSON mengandung nested object/array. MVP belum mendukung flatten. Silakan gunakan struktur flat."
    );
  }

  try {
    return Papa.unparse(rows, {
      quotes: false,
      skipEmptyLines: true,
    });
  } catch {
    throw new Error("Gagal mengubah JSON menjadi CSV.");
  }
}
