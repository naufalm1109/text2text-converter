"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FormatSelect } from "./FormatSelect";
import { EditorPanel } from "./EditorPanel";
import { ActionBar } from "./ActionBar";
import type { TextFormat } from "@/lib/types";
import { convertText, getSupportedTargets } from "@/lib/converters";

const MAX_BYTES = 1_000_000; // 1000 KB 

/**
 * Label format untuk UI.
 * Jika nanti nambah XML/HTML/TOML/INI, tinggal tambah di sini.
 */
const FORMAT_OPTIONS: { value: TextFormat; label: string }[] = [
  { value: "txt", label: "TXT" },
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "md", label: "Markdown" },
];

function guessFormatFromFilename(name: string): TextFormat | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "yaml";
  if (lower.endsWith(".md")) return "md";
  if (lower.endsWith(".txt")) return "txt";
  return null;
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ConverterShell() {
  const [from, setFrom] = useState<TextFormat>("txt");
  const [to, setTo] = useState<TextFormat>("json");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");

  /**
   * Daftar target format valid berdasarkan "from".
   * Dropdown "To" hanya menampilkan opsi yang benar-benar didukung.
   */
  const supportedTo = useMemo(() => getSupportedTargets(from), [from]);

  const toOptions = useMemo(
    () => FORMAT_OPTIONS.filter((o) => supportedTo.includes(o.value)),
    [supportedTo]
  );

  /**
   * Kalau user ganti "from" dan pilihan "to" sebelumnya jadi tidak valid,
   * otomatis pilih opsi valid pertama agar UX tidak membingungkan.
   */
  useEffect(() => {
    if (!supportedTo.includes(to)) {
      setTo(supportedTo[0]);
    }
  }, [supportedTo, to]);

  const canCopy = useMemo(() => outputText.trim().length > 0, [outputText]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text)]">
          Text-to-Text File Converter{" "}
          <span className="text-[color:var(--primary)]">(MVP)</span>
        </h1>

        <p className="text-sm text-[color:var(--muted)]">
          Convert between Text-Based Formats: TXT, CSV, JSON, YAML, dan Markdown.
        </p>
      </div>

      {/* Top controls */}
      <div
        className="
          mb-4 flex flex-col gap-3 rounded-2xl
          border border-[color:var(--border)]
          bg-[linear-gradient(to_bottom_right,var(--surface),var(--surface2))]
          p-4 shadow-[var(--shadow)]
          transition
          hover:shadow-[var(--shadow-hover)]
        "
      >
        {/* Dropdowns (2 kolom) */}
        <div className="grid gap-3 md:grid-cols-2">
          <FormatSelect
            label="From"
            value={from}
            onChange={setFrom}
            options={FORMAT_OPTIONS}
          />
          <FormatSelect
            label="To"
            value={to}
            onChange={setTo}
            options={toOptions}
          />
        </div>

        {/* Action bar (kanan) */}
        <div className="flex justify-end">
          <ActionBar
            onConvert={() => {
              // 1) Guard: input kosong -> jangan panggil convertText sama sekali
              if (!inputText.trim()) {
                toast.error("Input masih kosong. Masukkan teks atau upload file dulu.");
                setOutputText(""); // biar output tetap bersih
                return;
              }
              
              // Alert untuk maximum input character
              const MAX_CHARS = 300_000; //300 Character
              if (inputText.length > MAX_CHARS) {
                toast.error("Teks terlalu besar. Maksimal 300k karakter untuk MVP.");
                return;
              }

              const result = convertText({ inputText, from, to });

              if (!result.ok) {
                // 2) Humanize: kalau error validator / object-like, tampilkan pesan ramah
                const raw = result.errorMessage ?? "";
                const lowered = raw.toLowerCase();

                const isValidation =
                  lowered.includes("too_small") ||
                  lowered.includes("input kosong") ||
                  lowered.includes("minimum") ||
                  lowered.includes("path") ||
                  lowered.includes("origin");

                const isUnsupported = lowered.includes("tidak didukung");

                const friendlyMessage = isValidation
                  ? "Input tidak valid. Pastikan kamu sudah memasukkan teks atau upload file yang sesuai."
                  : raw;

                if (isUnsupported) toast(friendlyMessage);
                else toast.error(friendlyMessage);

                // 3) Jangan push error panjang ke output: cukup ringkas & actionable
                setOutputText(
                  ` ${friendlyMessage}\n\n` +
                    `Tips: cek format "From/To", atau coba input contoh yang valid (lihat badge).`
                );
                return;
              }
              
              // 🔴 4) GUARD OUTPUT TERLALU BESAR 
              const MAX_OUTPUT_CHARS = 400_000;
              if (result.outputText.length > MAX_OUTPUT_CHARS) {
                toast.error(
                  "Output terlalu besar untuk ditampilkan. File akan langsung di-download."
                );
                downloadText(`converted.${to}`, result.outputText);
                setOutputText(""); // jangan render ke textarea
                return;
              }

              setOutputText(result.outputText);
              toast.success("Konversi berhasil.");
            }}

            onSwap={() => {
              setFrom(to);
              setTo(from);
              toast.success("Format ditukar.");
            }}
            onCopy={async () => {
              if (!canCopy) {
                toast.error("Output masih kosong.");
                return;
              }
              try {
                await navigator.clipboard.writeText(outputText);
                toast.success("Output berhasil di-copy.");
              } catch {
                toast.error("Gagal copy. Browser memblokir clipboard.");
              }
            }}
            onDownload={() => {
              if (!outputText.trim()) {
                toast.error("Output masih kosong.");
                return;
              }
              downloadText(`converted.${to}`, outputText);
              toast.success("File hasil di-download.");
            }}
            onClear={() => {
              setInputText("");
              setOutputText("");
              toast.success("Input & output dibersihkan.");
            }}
            onPickFile={async (file) => {
              if (file.size > MAX_BYTES) {
                toast.error("File terlalu besar. Maksimal 1MB.");
                return;
              }

              const text = await file.text();
              setInputText(text);

              const guessed = guessFormatFromFilename(file.name);
              if (guessed) setFrom(guessed);

              toast.success(`Loaded: ${file.name}`);
            }}
          />
        </div>

        {/* Tips + Supported conversions */}
        <div className="text-xs text-[color:var(--muted)] space-y-2">
          <div>
            Tip: Upload file or paste it in the Input Panel. Click{" "}
            <b className="text-[color:var(--text)]">Convert</b> for Result.
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className="
                rounded-full border border-[color:var(--border)]
                bg-[color:var(--primary-soft)]
                px-2 py-0.5
                text-[color:var(--primary)]
              "
            >
              JSON ↔ YAML
            </span>

            <span
              className="
                rounded-full border border-[color:var(--border)]
                bg-[color:var(--primary-soft)]
                px-2 py-0.5
                text-[color:var(--primary)]
              "
            >
              CSV ↔ JSON
            </span>

            <span
              className="
                rounded-full border border-[color:var(--border)]
                bg-[color:var(--primary-soft)]
                px-2 py-0.5
                text-[color:var(--primary)]
              "
            >
              TXT ↔ MD
            </span>
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="grid gap-4 md:grid-cols-2">
        <EditorPanel
          title="Input"
          subtitle="Paste Text or Upload File"
          value={inputText}
          onChange={setInputText}
          placeholder={`Input your text here...\n\nExample JSON:\n{\n  "hello": "world"\n}`}
          rightSlot={<span>{from.toUpperCase()}</span>}
        />

        <EditorPanel
          title="Output"
          subtitle="Convert Result (read-only)"
          value={outputText}
          readOnly
          placeholder="Convert Result will appear here."
          rightSlot={<span>{to.toUpperCase()}</span>}
        />
      </div>

    </div>
  );
}
