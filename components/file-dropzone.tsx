"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/toast";

type Props = {
  acceptExt: string[]; // e.g. ["pdf"] or ["docx"]
  maxBytes: number; // e.g. 5 * 1024 * 1024
  file: File | null;
  onChangeFile: (file: File | null) => void;
  helperText?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function extOf(name: string) {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

export default function FileDropzone({
  acceptExt,
  maxBytes,
  file,
  onChangeFile,
  helperText,
}: Props) {
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const acceptLabel = useMemo(() => acceptExt.map((x) => `.${x}`).join(", "), [acceptExt]);

  const validateSingle = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      if (arr.length === 0) return null;

      if (arr.length > 1) {
        showToast({
          type: "error",
          title: "Only one file allowed",
          message: "Please upload a single file for this tool.",
        });
        return null;
      }

      const f = arr[0];
      const ext = extOf(f.name);

      if (!acceptExt.includes(ext)) {
        showToast({
          type: "error",
          title: "Invalid file type",
          message: `Only ${acceptLabel} files are supported.`,
        });
        return null;
      }

      if (f.size > maxBytes) {
        showToast({
          type: "error",
          title: "File is too large",
          message: `Max size is ${formatBytes(maxBytes)}.`,
        });
        return null;
      }

      return f;
    },
    [acceptExt, acceptLabel, maxBytes, showToast]
  );

  const onPick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = e.target.files;
      if (!picked) return;

      const next = validateSingle(picked);
      if (next) onChangeFile(next);

      // reset input so selecting same file again still triggers change
      e.target.value = "";
    },
    [onChangeFile, validateSingle]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const dt = e.dataTransfer;
      if (!dt?.files) return;

      const next = validateSingle(dt.files);
      if (next) onChangeFile(next);
    },
    [onChangeFile, validateSingle]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const onDragEnter = useCallback(() => setIsDragOver(true), []);
  const onDragLeave = useCallback(() => setIsDragOver(false), []);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptExt.map((x) => `.${x}`).join(",")}
        onChange={onInputChange}
      />

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className={[
          "rounded-3xl border bg-white p-6 shadow-sm transition sm:p-8",
          isDragOver ? "border-amber-300 ring-4 ring-amber-100" : "border-amber-100",
        ].join(" ")}
      >
        {!file ? (
          <div className="flex flex-col items-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-slate-700">
              <span className="text-lg">⬆️</span>
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              Drag & drop your file here
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Supported: {acceptLabel} • Max {formatBytes(maxBytes)}
            </p>

            <button
              type="button"
              onClick={onPick}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950"
            >
              Select file
            </button>

            {helperText ? (
              <p className="mt-3 text-xs text-slate-500">{helperText}</p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Selected file</p>
              <p className="mt-1 truncate text-sm text-slate-600">
                {file.name} • {formatBytes(file.size)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onChangeFile(null)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
