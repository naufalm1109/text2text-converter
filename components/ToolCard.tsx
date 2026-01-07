import Link from "next/link";
import type { Tool } from "@/lib/tools";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13 5l7 7-7 7M20 12H4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon({ kind }: { kind: "word" | "pdf" | "ppt" | "xls" }) {
  // SVG kecil biar ringan, mirip "badge icon" di card
  const common = "h-10 w-10";
  if (kind === "pdf") {
    return (
      <div className="grid place-items-center h-10 w-10 rounded-xl bg-red-100 text-red-600">
        <span className="text-xs font-semibold">PDF</span>
      </div>
    );
  }
  if (kind === "word") {
    return (
      <div className="grid place-items-center h-10 w-10 rounded-xl bg-blue-100 text-blue-700">
        <span className="text-xs font-semibold">DOCX</span>
      </div>
    );
  }
  if (kind === "ppt") {
    return (
      <div className="grid place-items-center h-10 w-10 rounded-xl bg-orange-100 text-orange-700">
        <span className="text-xs font-semibold">PPTX</span>
      </div>
    );
  }
  return (
    <div className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700">
      <span className="text-xs font-semibold">XLSX</span>
    </div>
  );
}

function pickIcon(toolKey: string): "word" | "pdf" | "ppt" | "xls" {
  if (toolKey.includes("word")) return "word";
  if (toolKey.includes("ppt")) return "ppt";
  if (toolKey.includes("excel")) return "xls";
  return "pdf";
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const kind = pickIcon(tool.key);

  return (
    <Link
      href={tool.href}
      className="group block rounded-2xl border border-amber-100 bg-white/70 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <FileIcon kind={kind} />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">
            {tool.title}
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-700">
        <span className="font-medium">Open tool</span>
        <ArrowRightIcon className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-600" />
      </div>
    </Link>
  );
}
