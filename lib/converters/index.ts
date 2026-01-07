import type { ConvertRequest, ConvertResult, TextFormat } from "../types";
import { requireNonEmptyText } from "../validators";
import { parseJsonOrThrow, stringifyJsonPretty } from "./json";
import { parseYamlOrThrow, stringifyYaml } from "./yaml";
import { csvToJsonText, jsonTextToCsv } from "./csv";
import { markdownToTxt, txtToMarkdown } from "./markdown";

/**
 * Guard sederhana untuk memastikan format yang dipilih user termasuk format yang didukung.
 */
export function isSupportedFormat(value: string): value is TextFormat {
  return ["txt", "csv", "json", "yaml", "md"].includes(value);
}

/**
 * Mengembalikan daftar format "To" yang valid untuk format "From" tertentu (MVP).
 * Dipakai UI agar user tidak memilih kombinasi konversi yang belum didukung.
 */
export function getSupportedTargets(from: TextFormat): TextFormat[] {
  switch (from) {
    case "json":
      return ["json", "yaml", "csv"];
    case "yaml":
      return ["yaml", "json"];
    case "csv":
      return ["csv", "json"];
    case "txt":
      return ["txt", "md"];
    case "md":
      return ["md", "txt"];
    default:
      return [from];
  }
}


/**
 * Konversi inti (MVP).
 * Prinsip:
 * - validasi input dulu (non-empty)
 * - parsing seperlunya
 * - error message dibuat user-friendly
 */
export function convertText(req: ConvertRequest): ConvertResult {
  try {
    const inputText = requireNonEmptyText(req.inputText);
    const { from, to } = req;

    // Passthrough
    if (from === to) return { ok: true, outputText: inputText };

    // JSON <-> YAML
    if (from === "json" && to === "yaml") {
      const data = parseJsonOrThrow(inputText);
      return { ok: true, outputText: stringifyYaml(data) };
    }
    if (from === "yaml" && to === "json") {
      const data = parseYamlOrThrow(inputText);
      return { ok: true, outputText: stringifyJsonPretty(data) };
    }

    // CSV <-> JSON
    if (from === "csv" && to === "json") {
      return { ok: true, outputText: csvToJsonText(inputText) };
    }
    if (from === "json" && to === "csv") {
      return { ok: true, outputText: jsonTextToCsv(inputText) };
    }

    // TXT <-> MD
    if (from === "txt" && to === "md") {
      return { ok: true, outputText: txtToMarkdown(inputText) };
    }
    if (from === "md" && to === "txt") {
      return { ok: true, outputText: markdownToTxt(inputText) };
    }

    // TXT -> JSON/YAML/CSV tidak kita “invent” (butuh aturan mapping), jadi kita tolak biar tidak misleading.
    return {
      ok: false,
      errorMessage: `Konversi "${from.toUpperCase()}" → "${to.toUpperCase()}" tidak didukung di MVP.`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan saat konversi.";
    return { ok: false, errorMessage: message };
  }
}
