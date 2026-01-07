export type ToolKey =
  | "word-to-pdf"
  | "pdf-to-word"
  | "pdf-to-excel"
  | "excel-to-pdf"
  | "pptx-to-pdf"
  | "pdf-to-pptx";

export type ToolConfig = {
  key: ToolKey;
  title: string;
  description: string;
  href: string;

  inputExt: "pdf" | "docx" | "xlsx" | "pptx";
  outputExt: "pdf" | "docx" | "xlsx" | "pptx";
  outputMime: string;

  cloudConvertInputFormat: string;
  cloudConvertOutputFormat: string;
};

export const TOOL_CONFIG: Record<ToolKey, ToolConfig> = {
  "word-to-pdf": {
    key: "word-to-pdf",
    title: "Word to PDF",
    description: "Make DOCX files easy to read by converting them to PDF.",
    href: "/word-to-pdf",
    inputExt: "docx",
    outputExt: "pdf",
    outputMime: "application/pdf",
    cloudConvertInputFormat: "docx",
    cloudConvertOutputFormat: "pdf",
  },
  "pdf-to-word": {
    key: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert your PDF files into easy-to-edit DOCX documents.",
    href: "/pdf-to-word",
    inputExt: "pdf",
    outputExt: "docx",
    outputMime:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    cloudConvertInputFormat: "pdf",
    cloudConvertOutputFormat: "docx",
  },
  "pdf-to-excel": {
    key: "pdf-to-excel",
    title: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets.",
    href: "/pdf-to-excel",
    inputExt: "pdf",
    outputExt: "xlsx",
    outputMime:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    cloudConvertInputFormat: "pdf",
    cloudConvertOutputFormat: "xlsx",
  },
  "excel-to-pdf": {
    key: "excel-to-pdf",
    title: "Excel to PDF",
    description: "Make Excel spreadsheets easy to read by converting them to PDF.",
    href: "/excel-to-pdf",
    inputExt: "xlsx",
    outputExt: "pdf",
    outputMime: "application/pdf",
    cloudConvertInputFormat: "xlsx",
    cloudConvertOutputFormat: "pdf",
  },
  "pptx-to-pdf": {
    key: "pptx-to-pdf",
    title: "PowerPoint to PDF",
    description: "Make PPTX slideshows easy to view by converting them to PDF.",
    href: "/pptx-to-pdf",
    inputExt: "pptx",
    outputExt: "pdf",
    outputMime: "application/pdf",
    cloudConvertInputFormat: "pptx",
    cloudConvertOutputFormat: "pdf",
  },
  "pdf-to-pptx": {
    key: "pdf-to-pptx",
    title: "PDF to PowerPoint",
    description: "Turn your PDF files into easy-to-edit PPTX slideshows.",
    href: "/pdf-to-pptx",
    inputExt: "pdf",
    outputExt: "pptx",
    outputMime:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    cloudConvertInputFormat: "pdf",
    cloudConvertOutputFormat: "pptx",
  },
};

export function isToolKey(x: unknown): x is ToolKey {
  return typeof x === "string" && x in TOOL_CONFIG;
}
export function stripExt(filename: string) {
  const i = filename.lastIndexOf(".");
  return i > 0 ? filename.slice(0, i) : filename;
}
export function getExt(filename: string) {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i + 1).toLowerCase() : "";
}
