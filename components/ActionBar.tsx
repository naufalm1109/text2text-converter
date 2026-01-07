import {
  ArrowLeftRight,
  ClipboardCopy,
  Download,
  Trash2,
  Upload,
} from "lucide-react";

type Props = {
  onConvert: () => void;
  onSwap: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
  onPickFile: (file: File) => void;
  isBusy?: boolean;
};

/**
 * Style tokens untuk tombol.
 * Dipisahkan agar konsisten & gampang diganti warna/feel-nya.
 */
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm shadow-sm transition " +
  "hover:-translate-y-[1px] " +
  "focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]";

const btnSecondary =
  `${btnBase} ` +
  "border border-[color:var(--border)] bg-[color:var(--surface)] " +
  "text-[color:var(--text)] " +
  "hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] " +
  "hover:shadow-md active:translate-y-0 " +
  "active:shadow-sm";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-xl " +
  "bg-[linear-gradient(to_right,var(--primary),var(--accent))] px-4 py-2 " +
  "text-sm font-semibold text-white " +
  "shadow-md transition " +
  "hover:opacity-95 hover:shadow-lg " +
  "hover:-translate-y-[1px] " +
  "focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] " +
  "disabled:opacity-60";

export function ActionBar({
  onConvert,
  onSwap,
  onCopy,
  onDownload,
  onClear,
  onPickFile,
  isBusy,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-end sm:justify-start">
      {/* Upload: dibuat label agar klik area-nya luas */}
      <label className={`${btnSecondary} cursor-pointer`}>
        <Upload className="h-4 w-4" />
        <span>Upload</span>

        <input
          type="file"
          className="hidden"
          accept=".txt,.csv,.json,.yaml,.yml,.md,text/plain,text/csv,application/json,application/x-yaml,text/markdown"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPickFile(file);

            // Reset agar bisa upload file yang sama lagi jika perlu
            e.currentTarget.value = "";
          }}
        />
      </label>

      {/* Primary CTA */}
      <button onClick={onConvert} disabled={isBusy} className={btnPrimary}>
        Convert
      </button>

      <button onClick={onSwap} disabled={isBusy} className={btnSecondary}>
        <ArrowLeftRight className="h-4 w-4" />
        Swap
      </button>

      {/* Divider */}
      <div className="h-6 w-px bg-(--border)" />

      <button onClick={onCopy} className={btnSecondary}>
        <ClipboardCopy className="h-4 w-4" />
        Copy
      </button>

      <button onClick={onDownload} className={btnSecondary}>
        <Download className="h-4 w-4" />
        Download
      </button>

      <button onClick={onClear} className={btnSecondary}>
        <Trash2 className="h-4 w-4" />
        Clear
      </button>
    </div>
  );
}
