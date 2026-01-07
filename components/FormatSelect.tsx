import type { TextFormat } from "@/lib/types";

type Props = {
  label: string;
  value: TextFormat;
  onChange: (v: TextFormat) => void;
  options: { value: TextFormat; label: string }[];
  disabled?: boolean;
};

/**
 * Dropdown format yang reusable.
 * Menggunakan design token (CSS variables) agar konsisten dengan theme.
 */
export function FormatSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: Props) {
  return (
    <label className="flex flex-col gap-1">
      {/* Label */}
      <span className="text-xs font-mediumtext-[color:var(--muted)]">
        {label}
      </span>

      {/* Select */}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as TextFormat)}
        className="
          h-10 rounded-xl
          border border-[color:var(--border)]
          bg-[color:var(--surface)]
          px-3 text-sm
          text-[color:var(--text)]
          shadow-sm outline-none transition
          hover:border-[color:var(--accent)]
          focus:border-[color:var(--primary)]
          focus:ring-2 focus:ring-[color:var(--ring)]
          disabled:cursor-not-allowed
          disabled:opacity-60
        ">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
