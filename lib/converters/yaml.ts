import yaml from "js-yaml";

/**
 * YAML utilities menggunakan js-yaml.
 * Aman untuk kasus umum MVP (tanpa fitur YAML advanced yang aneh-aneh).
 */

export function parseYamlOrThrow(inputText: string): unknown {
  try {
    return yaml.load(inputText);
  } catch {
    throw new Error("YAML tidak valid. Pastikan indentasi dan struktur YAML benar.");
  }
}

export function stringifyYaml(value: unknown): string {
  try {
    return yaml.dump(value, {
      indent: 2,
      lineWidth: 100,
      noRefs: true,
    });
  } catch {
    throw new Error("Gagal mengubah data menjadi YAML.");
  }
}
