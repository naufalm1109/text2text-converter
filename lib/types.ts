export type TextFormat = "txt" | "csv" | "json" | "yaml" | "md";

export type ConvertRequest = {
  inputText: string;
  from: TextFormat;
  to: TextFormat;
};

export type ConvertResult =
  | { ok: true; outputText: string }
  | { ok: false; errorMessage: string };
