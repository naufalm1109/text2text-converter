"use client";

export default function ToolActions({
  canConvert,
  onConvert,
  canDownload,
  onDownload,
}: {
  canConvert: boolean;
  onConvert: () => void;
  canDownload: boolean;
  onDownload: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        disabled={!canConvert}
        onClick={onConvert}
        className={[
          "inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm sm:w-auto",
          canConvert
            ? "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950"
            : "bg-slate-200 text-slate-500 cursor-not-allowed",
        ].join(" ")}
      >
        Convert
      </button>

      <button
        type="button"
        disabled={!canDownload}
        onClick={onDownload}
        className={[
          "inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold sm:w-auto",
          canDownload
            ? "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            : "border border-slate-200 bg-white text-slate-400 cursor-not-allowed",
        ].join(" ")}
      >
        Download
      </button>

      <p className="text-xs text-slate-500 sm:ml-auto">
        Your file is processed on the server after you click Convert.
      </p>
    </div>
  );
}
