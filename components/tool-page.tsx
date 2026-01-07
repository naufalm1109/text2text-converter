"use client";

import { useEffect, useMemo, useState } from "react";
import FileDropzone from "@/components/file-dropzone";
import ToolActions from "@/components/tool-actions";
import { useToast } from "@/components/toast";
import { MAX_BYTES } from "@/lib/constants";
import { TOOL_CONFIG, ToolKey } from "@/lib/tool-config";

function parseFilenameFromContentDisposition(cd: string | null) {
  if (!cd) return null;
  // attachment; filename="abc-converted.pdf"
  const m = /filename="([^"]+)"/.exec(cd);
  return m?.[1] ?? null;
}

export default function ToolPage({ toolKey }: { toolKey: ToolKey }) {
  const cfg = TOOL_CONFIG[toolKey];
  const { showToast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);

  // cleanup blob url
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  // kalau user ganti file, hapus hasil sebelumnya
  useEffect(() => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setDownloadName(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const canConvert = !!file && !isConverting;
  const canDownload = !!downloadUrl && !!downloadName && !isConverting;

  const helperText = useMemo(
    () => "After conversion is complete, the Download button will be enabled.",
    []
  );

  async function onConvert() {
    if (!file) return;

    setIsConverting(true);
    try {
      const fd = new FormData();
      fd.append("tool", toolKey);
      fd.append("file", file, file.name);

      const res = await fetch("/api/convert", { method: "POST", body: fd });

      if (!res.ok) {
        let msg = "Conversion failed.";
        try {
          const j = await res.json();
          if (typeof j?.error === "string") msg = j.error;
        } catch {}

        // ✅ Demo mode: CloudConvert credits exceeded
        if (msg.includes("CREDITS_EXCEEDED")) {
          showToast({
            type: "info",
            title: "Demo mode limitation",
            message:
              "Daily conversion quota has been reached. This demo uses a third-party document conversion API with limited free credits. Please try again later.",
          });
          return;
        }

        showToast({ type: "error", title: "Error", message: msg });
        return;
      }

      const outName =
        parseFilenameFromContentDisposition(res.headers.get("content-disposition")) ??
        `${file.name}-converted.${cfg.outputExt}`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(outName);

      showToast({
        type: "success",
        title: "Conversion complete",
        message: "Your file is ready to download.",
      });
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Error",
        message: e?.message ?? "Unexpected error.",
      });
    } finally {
      setIsConverting(false);
    }
  }

  function onDownload() {
    if (!downloadUrl || !downloadName) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900">{cfg.title}</h1>
          <p className="mt-2 text-slate-600">{cfg.description}</p>
        </header>

        <section className="mt-10 rounded-3xl border border-amber-100 bg-linear-to-b from-[#f7f0de] to-[#fbf6ea] p-6 shadow-sm sm:p-8">
          <FileDropzone
            acceptExt={[cfg.inputExt]}
            maxBytes={MAX_BYTES}
            file={file}
            onChangeFile={setFile}
            helperText={helperText}
          />

          <ToolActions
            canConvert={canConvert}
            onConvert={onConvert}
            canDownload={canDownload}
            onDownload={onDownload}
          />

          {isConverting ? (
            <p className="mt-4 text-sm text-slate-600">Converting… please wait.</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
