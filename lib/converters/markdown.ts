/**
 * Markdown conversion (MVP):
 * - TXT -> MD: passthrough (anggap teks biasa adalah markdown juga).
 * - MD -> TXT: strip formatting dasar.
 *
 * Ini bukan parser markdown lengkap (MVP), tapi cukup untuk kebutuhan umum.
 */

export function txtToMarkdown(inputText: string): string {
  return inputText;
}

export function markdownToTxt(inputText: string): string {
  let out = inputText;

  // remove code fences ``` ```
  out = out.replace(/```[\s\S]*?```/g, (m) => {
    // Ambil isi codeblock tanpa backticks
    return m.replace(/```[a-zA-Z0-9_-]*\n?/g, "").replace(/```/g, "");
  });

  // inline code `x`
  out = out.replace(/`([^`]+)`/g, "$1");

  // links [text](url) -> text
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  // images ![alt](url) -> alt
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1");

  // headings #### Title -> Title
  out = out.replace(/^#{1,6}\s+/gm, "");

  // bold/italic **x** *x* __x__ _x_
  out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
  out = out.replace(/\*([^*]+)\*/g, "$1");
  out = out.replace(/__([^_]+)__/g, "$1");
  out = out.replace(/_([^_]+)_/g, "$1");

  // blockquotes > x
  out = out.replace(/^\s*>\s?/gm, "");

  // list markers "- " "* " "1. "
  out = out.replace(/^\s*[-*]\s+/gm, "");
  out = out.replace(/^\s*\d+\.\s+/gm, "");

  // extra blank lines normalize
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}
