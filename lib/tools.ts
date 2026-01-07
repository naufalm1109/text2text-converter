export type Tool = {
  key: string;
  title: string;
  description: string;
  href: string;
  badge?: string; // optional label if needed later
};

export const TOOLS: Tool[] = [
  {
    key: "word-to-pdf",
    title: "Word to PDF",
    description: "Make DOCX files easy to read by converting them to PDF.",
    href: "/word-to-pdf",
  },
  {
    key: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert your PDF files into easy-to-edit DOCX documents.",
    href: "/pdf-to-word",
  },
  {
    key: "pdf-to-pptx",
    title: "PDF to PowerPoint",
    description: "Turn your PDF files into easy-to-edit PPTX slideshows.",
    href: "/pdf-to-pptx",
  },
  {
    key: "pptx-to-pdf",
    title: "PowerPoint to PDF",
    description: "Make PPTX slideshows easy to view by converting them to PDF.",
    href: "/pptx-to-pdf",
  },
  {
    key: "pdf-to-excel",
    title: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets.",
    href: "/pdf-to-excel",
  },
  {
    key: "excel-to-pdf",
    title: "Excel to PDF",
    description: "Make Excel spreadsheets easy to read by converting them to PDF.",
    href: "/excel-to-pdf",
  },
];
