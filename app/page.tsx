import ToolCard from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            All PDF Tools
          </h1>
          <p className="mt-3 text-base leading-6 text-slate-600">
            Convert, export, and transform documents using the available tools
            below. Choose a tool to start.
          </p>

          {/* filter placeholder (disabled / static) - sesuai scope: belum dipakai
          <div className="mt-6 flex gap-3">
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-slate-900">
              All
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Convert PDF
            </span>
          </div> */}
        </header>

        <section className="mt-10 rounded-3xl border border-amber-100 bg-linear-to-b from-[#f7f0de] to-[#fbf6ea] p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.key} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
