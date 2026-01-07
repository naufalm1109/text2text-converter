import { z } from "zod";

/**
 * Skema minimal untuk memastikan input tidak kosong.
 * Supaya UX lebih baik: user dapat error yang jelas sebelum parsing.
 */
export const nonEmptyTextSchema = z
  .string()
  .trim()
  .min(1, "Input kosong. Masukkan teks atau upload file terlebih dahulu.");

/**
 * Helper untuk validasi input text.
 */
export function requireNonEmptyText(inputText: string): string {
  return nonEmptyTextSchema.parse(inputText);
}
